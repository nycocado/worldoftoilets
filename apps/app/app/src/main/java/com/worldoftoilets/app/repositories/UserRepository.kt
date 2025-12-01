package com.worldoftoilets.app.repositories

import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.models.requests.DeleteUserRequest
import com.worldoftoilets.app.models.requests.UpdateUserRequest
import com.worldoftoilets.app.network.UserService
import javax.inject.Inject
import com.worldoftoilets.app.ui.util.parseApiError

class UserRepository @Inject constructor(
    private val userService: UserService
) {
    suspend fun getSelf(): Result<User> {
        return try {
            val response = userService.getSelf()
            val apiResponse = response.body()

            if (response.isSuccessful && apiResponse?.data != null) {
                Result.success(apiResponse.data)
            } else {
                val errorMsg = apiResponse?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateSelf(
        name: String?,
        icon: String?,
        birthDate: String?
    ): Result<User> {
        return try {
            val response = userService.updateSelf(
                UpdateUserRequest(name, icon, birthDate)
            )
            val apiResponse = response.body()

            if (response.isSuccessful && apiResponse?.data != null) {
                Result.success(apiResponse.data)
            } else {
                val errorMsg = apiResponse?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteSelf(password: String): Result<Unit> {
        return try {
            val response = userService.deleteSelf(DeleteUserRequest(password))
            val apiResponse = response.body()

            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                val errorMsg = apiResponse?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}