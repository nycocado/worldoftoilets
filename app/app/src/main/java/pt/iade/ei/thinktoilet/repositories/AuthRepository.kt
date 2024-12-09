package pt.iade.ei.thinktoilet.repositories

import com.google.gson.Gson
import pt.iade.ei.thinktoilet.models.ApiResponse
import pt.iade.ei.thinktoilet.models.LoginRequest
import pt.iade.ei.thinktoilet.models.RegisterRequest
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.network.AuthService
import pt.iade.ei.thinktoilet.network.RetrofitClient
import java.time.LocalDate
import javax.inject.Inject

class AuthRepository @Inject constructor() {
    private val authService = RetrofitClient.retrofit.create(AuthService::class.java)

    suspend fun login(email: String, password: String): Result<User> {
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
        iconId: String,
        birthDate: LocalDate
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