package com.worldoftoilets.app.network

import android.util.Log
import com.worldoftoilets.app.security.AuthEvent
import com.worldoftoilets.app.security.AuthEventBus
import com.worldoftoilets.app.security.TokenManager
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Provider

/**
 * Interceptor que trata respostas 401 (token expirado)
 * Tenta renovar o token usando o refresh token
 * Se bem-sucedido, retenta a requisição original
 */
class TokenRefreshInterceptor(
    private val tokenManager: TokenManager,
    private val authServiceProvider: Provider<AuthService>,
    private val authEventBus: AuthEventBus
) : Interceptor {

    companion object {
        private const val TAG = "TokenRefreshInterceptor"
        private const val AUTHORIZATION_HEADER = "Authorization"
        private const val BEARER_PREFIX = "Bearer "
    }

    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()

        // Se a requisição já for de refresh, não interceptar para evitar loop infinito
        if (originalRequest.url.encodedPath.contains("/auth/refresh")) {
            return chain.proceed(originalRequest)
        }

        val response = chain.proceed(originalRequest)

        // Se resposta não for 401, retornar normalmente
        if (response.code != 401) {
            return response
        }

        Log.d(TAG, "Received 401 response for ${originalRequest.url}, attempting to refresh token")

        val failedToken = originalRequest.header(AUTHORIZATION_HEADER)?.removePrefix(BEARER_PREFIX)

        // Se não houver refresh token, retornar 401 original
        if (!tokenManager.hasRefreshToken()) {
            Log.d(TAG, "No refresh token available locally")
            return response
        }

        // Sincronizar para evitar múltiplas requisições de refresh simultâneas
        synchronized(this) {
            val currentAccessToken = tokenManager.getAccessToken()

            // Cenário 1: O token mudou enquanto esperávamos o lock (outra thread renovou)
            // Ou o token armazenado já é diferente do que falhou.
            if (currentAccessToken != null && failedToken != null && currentAccessToken != failedToken) {
                Log.d(TAG, "Token changed by another thread. Retrying with new token.")
                response.close()
                val newRequest = originalRequest.newBuilder()
                    .header(AUTHORIZATION_HEADER, BEARER_PREFIX + currentAccessToken)
                    .build()
                return chain.proceed(newRequest)
            }

            // Cenário 2: O token ainda é o mesmo que falhou (ou null). Precisamos renovar.
            Log.d(TAG, "Token is stale or missing. Refreshing...")

            try {
                val refreshToken = tokenManager.getRefreshToken()
                // Se não tiver refresh token (ex: logout concorrente), retorna o 401 original
                if (refreshToken == null) {
                    return response
                }

                val refreshResponse = authServiceProvider.get().refreshSync(
                    BEARER_PREFIX + refreshToken
                ).execute()

                if (refreshResponse.isSuccessful) {
                    val apiResponse = refreshResponse.body()
                    val newTokens = apiResponse?.data

                    if (newTokens != null) {
                        Log.d(TAG, "Token refreshed successfully")
                        tokenManager.saveTokens(
                            newTokens.accessToken,
                            newTokens.refreshToken
                        )

                        // Retentar requisição original com novo token
                        response.close()

                        val newRequest = originalRequest.newBuilder()
                            .header(AUTHORIZATION_HEADER, BEARER_PREFIX + newTokens.accessToken)
                            .build()

                        return chain.proceed(newRequest)
                    }
                } else {
                    Log.d(TAG, "Failed to refresh token: ${refreshResponse.code()}")
                    // Se falhar no refresh (ex: refresh token expirado), limpar tokens e emitir evento
                    tokenManager.clearTokens()
                    runBlocking { authEventBus.emit(AuthEvent.SESSION_EXPIRED) }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error refreshing token", e)
                tokenManager.clearTokens()
                runBlocking { authEventBus.emit(AuthEvent.SESSION_EXPIRED) }
            }
        }

        return response
    }
}
