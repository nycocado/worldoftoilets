package com.worldoftoilets.app.security

import android.util.Log
import com.auth0.android.jwt.JWT
import java.util.Date

/**
 * Gerencia accessToken e refreshToken do usuário
 * Responsável por salvar, recuperar, validar e limpar tokens
 */
class TokenManager(private val tokenStorage: TokenRepository) {

    fun saveTokens(accessToken: String, refreshToken: String) {
        try {
            tokenStorage.saveAccessToken(accessToken)
            tokenStorage.saveRefreshToken(refreshToken)
            Log.d("TokenManager", "Tokens saved successfully")
        } catch (e: Exception) {
            Log.e("TokenManager", "Error saving tokens", e)
        }
    }

    fun getAccessToken(): String? {
        return try {
            tokenStorage.getAccessToken()
        } catch (e: Exception) {
            Log.e("TokenManager", "Error retrieving access token", e)
            null
        }
    }

    fun getRefreshToken(): String? {
        return try {
            tokenStorage.getRefreshToken()
        } catch (e: Exception) {
            Log.e("TokenManager", "Error retrieving refresh token", e)
            null
        }
    }

    fun hasRefreshToken(): Boolean {
        return getRefreshToken() != null
    }

    fun hasAccessToken(): Boolean {
        return getAccessToken() != null
    }

    fun isAccessTokenExpired(): Boolean {
        return try {
            val token = getAccessToken() ?: return true
            val jwt = JWT(token)
            val expiresAt = jwt.expiresAt ?: return true
            expiresAt.before(Date())
        } catch (e: Exception) {
            Log.e("TokenManager", "Error checking token expiration", e)
            true
        }
    }

    fun clearTokens() {
        try {
            tokenStorage.clearAccessToken()
            tokenStorage.clearRefreshToken()
            Log.d("TokenManager", "Tokens cleared successfully")
        } catch (e: Exception) {
            Log.e("TokenManager", "Error clearing tokens", e)
        }
    }
}
