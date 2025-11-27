package com.worldoftoilets.app.security

/**
 * Interface abstrata para armazenamento de tokens
 * Implementações concretas podem usar diferentes mecanismos de armazenamento
 */
interface TokenRepository {
    fun saveAccessToken(token: String)
    fun getAccessToken(): String?
    fun clearAccessToken()

    fun saveRefreshToken(token: String)
    fun getRefreshToken(): String?
    fun clearRefreshToken()
}
