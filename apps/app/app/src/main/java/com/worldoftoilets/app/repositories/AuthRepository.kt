package com.worldoftoilets.app.repositories

import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.models.requests.LoginRequest
import com.worldoftoilets.app.models.requests.RegisterRequest
import com.worldoftoilets.app.network.AuthService
import com.worldoftoilets.app.security.CsrfTokenManager
import com.worldoftoilets.app.security.TokenManager
import com.worldoftoilets.app.ui.util.parseApiError
import javax.inject.Inject

class AuthRepository @Inject constructor(
    private val authService: AuthService,
    private val tokenManager: TokenManager,
    private val userPreferencesRepository: UserPreferencesRepository,
    private val csrfTokenManager: CsrfTokenManager
) {
    suspend fun fetchCsrfToken(): Result<Unit> {
        return try {
            val response = authService.getCsrfToken()
            val apiResponse = response.body()
            if (response.isSuccessful && apiResponse?.data != null) {
                csrfTokenManager.setCsrfToken(apiResponse.data.csrfToken)
                Result.success(Unit)
            } else {
                val errorMsg = apiResponse?.message ?: "Failed to fetch CSRF token"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

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

                // Verificar persistência do token
                var attempts = 0
                while (tokenManager.getAccessToken() != loginResponse.accessToken && attempts < 10) {
                    kotlinx.coroutines.delay(50)
                    attempts++
                }

                if (tokenManager.getAccessToken() != loginResponse.accessToken) {
                    return Result.failure(Exception("Falha ao persistir tokens. Tente novamente."))
                }

                // Atualizar CSRF token após login
                fetchCsrfToken()

                // Marcar como logado
                userPreferencesRepository.setLoggedIn(true)

                Result.success(loginResponse.user)
            } else {
                val errorMsg = apiResponse?.message ?: parseApiError(response.errorBody()?.string())
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
                val errorMsg = apiResponse?.message ?: parseApiError(response.errorBody()?.string())
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
            
            // Clear old CSRF and fetch a new one for the anonymous session
            csrfTokenManager.clearCsrfToken()
            fetchCsrfToken()

            Result.success(Unit)
        } catch (e: Exception) {
            // Mesmo com erro, limpar localmente
            tokenManager.clearTokens()
            try {
                userPreferencesRepository.clear()
            } catch (e: Exception) {
                // Ignorar erro ao limpar preferences
            }
            
            // Try to reset CSRF for safety
            csrfTokenManager.clearCsrfToken()
            fetchCsrfToken()
            
            Result.success(Unit)
        }
    }

    suspend fun resendVerification(email: String): Result<Unit> {
        return try {
            val response = authService.resendVerification(email)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                val errorMsg =
                    response.body()?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun forgotPassword(email: String): Result<Unit> {
        return try {
            val response = authService.forgotPassword(email)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                val errorMsg =
                    response.body()?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun refreshToken(): Result<Unit> {
        return try {
            val refreshToken = tokenManager.getRefreshToken()
                ?: return Result.failure(Exception("No refresh token"))
            val response = authService.refresh("Bearer $refreshToken")
            val apiResponse = response.body()

            if (response.isSuccessful && apiResponse?.data != null) {
                val data = apiResponse.data
                tokenManager.saveTokens(data.accessToken, data.refreshToken)
                Result.success(Unit)
            } else {
                tokenManager.clearTokens()
                userPreferencesRepository.clear()
                Result.failure(Exception("Failed to refresh token"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}