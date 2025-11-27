package com.worldoftoilets.app.network

import android.util.Log
import com.worldoftoilets.app.security.TokenManager
import okhttp3.Interceptor
import okhttp3.Response

/**
 * Interceptor que adiciona o token JWT ao header Authorization
 * Pula endpoints públicos que não requerem autenticação
 */
class AuthInterceptor(private val tokenManager: TokenManager) : Interceptor {

    companion object {
        private const val TAG = "AuthInterceptor"
        private const val AUTHORIZATION_HEADER = "Authorization"
        private const val BEARER_PREFIX = "Bearer "

        // Endpoints públicos que não precisam de autenticação
        private val PUBLIC_ENDPOINTS = setOf(
            "/auth/login",
            "/auth/register",
            "/auth/verify-email",
            "/auth/resend-verification",
            "/auth/forgot-password",
            "/auth/reset-password",
            "/auth/refresh"
        )
    }

    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        val requestPath = originalRequest.url.encodedPath

        // Se for endpoint público, prosseguir sem adicionar token
        if (isPublicEndpoint(requestPath)) {
            Log.d(TAG, "Public endpoint: $requestPath - skipping auth header")
            return chain.proceed(originalRequest)
        }

        // Adicionar token JWT ao header
        val accessToken = tokenManager.getAccessToken()
        if (accessToken != null) {
            val authenticatedRequest = originalRequest.newBuilder()
                .header(AUTHORIZATION_HEADER, BEARER_PREFIX + accessToken)
                .build()
            Log.d(TAG, "Adding auth header to request: $requestPath")
            return chain.proceed(authenticatedRequest)
        } else {
            Log.w(TAG, "Access token is NULL for authenticated endpoint: $requestPath")
        }

        Log.d(TAG, "No access token available for request: $requestPath")
        return chain.proceed(originalRequest)
    }

    private fun isPublicEndpoint(path: String): Boolean {
        return PUBLIC_ENDPOINTS.any { path.contains(it) }
    }
}
