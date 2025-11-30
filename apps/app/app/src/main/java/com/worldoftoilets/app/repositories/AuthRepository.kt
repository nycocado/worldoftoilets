package com.worldoftoilets.app.repositories

import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.models.requests.LoginRequest
import com.worldoftoilets.app.models.requests.RegisterRequest
import com.worldoftoilets.app.models.responses.ApiResponse
import com.worldoftoilets.app.network.AuthService
import com.worldoftoilets.app.security.TokenManager
import javax.inject.Inject

class AuthRepository @Inject constructor(
    private val authService: AuthService,
    private val tokenManager: TokenManager,
    private val userPreferencesRepository: UserPreferencesRepository
) {
    suspend fun login(
        email: String,
        password: String
    ): Result<User> {
        return try {
            val response = authService.login(LoginRequest(email, password))
            val apiResponse = response.body()

            if (response.isSuccessful && apiResponse?.data != null) {
                val loginResponse = apiResponse.data

                // Salvar tokens
                tokenManager.saveTokens(
                    loginResponse.accessToken,
                    loginResponse.refreshToken
                )

                // Marcar como logado
                userPreferencesRepository.setLoggedIn(true)

                Result.success(loginResponse.user)
            } else {
                val errorMsg = apiResponse?.message ?: response.errorBody()?.string() ?: "Login failed"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun register(
        name: String,
        email: String,
        password: String,
        icon: String?,
        birthDate: String
    ): Result<Unit> {
        return try {
            val response = authService.register(
                RegisterRequest(name, email, password, icon, birthDate)
            )
            val apiResponse = response.body()
            
            if (response.isSuccessful) {
                // API might return 200/201 with data or message
                Result.success(Unit)
            } else {
                val errorMsg = apiResponse?.message ?: response.errorBody()?.string() ?: "Registration failed"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun logout(): Result<Unit> {
        return try {
            val refreshToken = tokenManager.getRefreshToken()
            if (refreshToken != null) {
                try {
                    authService.logout("Bearer $refreshToken")
                } catch (e: Exception) {
                    // Continuar mesmo com erro na chamada de logout
                }
            }

            tokenManager.clearTokens()
            userPreferencesRepository.clear()

            Result.success(Unit)
        } catch (e: Exception) {
            // Mesmo com erro, limpar localmente
            tokenManager.clearTokens()
            try {
                userPreferencesRepository.clear()
            } catch (e: Exception) {
                // Ignorar erro ao limpar preferences
            }
            Result.success(Unit)
        }
    }
}