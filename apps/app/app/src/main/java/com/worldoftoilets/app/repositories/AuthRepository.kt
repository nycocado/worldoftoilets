package com.worldoftoilets.app.repositories

import com.google.gson.Gson
import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.models.requests.LoginRequest
import com.worldoftoilets.app.models.requests.RegisterRequest
import com.worldoftoilets.app.models.responses.ApiResponse
import com.worldoftoilets.app.network.AuthService
import com.worldoftoilets.app.network.RetrofitClient
import javax.inject.Inject

class AuthRepository @Inject constructor() {
    private val authService = RetrofitClient.retrofit.create(AuthService::class.java)

    suspend fun login(
        email: String,
        password: String
    ): Result<User> {
        return try {
            val response = authService.login(LoginRequest(email, password))
            if (response.isSuccessful) {
                response.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("No user found"))
            } else {
                val errorBody = response.errorBody()?.string()
                val errorResponse = Gson().fromJson(errorBody, ApiResponse::class.java)
                Result.failure(Exception(errorResponse.message))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun register(
        name: String,
        email: String,
        password: String,
        iconId: String?,
        birthDate: String?
    ): Result<ApiResponse> {
        return try {
            val response = authService.register(
                RegisterRequest(name, email, password, iconId, birthDate)
            )
            if (response.isSuccessful) {
                response.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("No response found"))
            } else {
                val errorBody = response.errorBody()?.string()
                val errorResponse = Gson().fromJson(errorBody, ApiResponse::class.java)
                Result.failure(Exception(errorResponse.message))
            }
        } catch (e: Exception) {
            throw e
        }
    }
}