package pt.iade.ei.thinktoilet.repositories

import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.network.RetrofitClient
import pt.iade.ei.thinktoilet.network.UserService
import retrofit2.Response
import javax.inject.Inject

class UserRepository @Inject constructor() {
    private val userService = RetrofitClient.retrofit.create(UserService::class.java)

    suspend fun getUsers(
        ids: List<Int>? = null
    ): List<User> {
        return userService.getUsers(ids)
    }

    suspend fun getUserById(userId: Int): User {
        return userService.getUserById(userId)
    }

    suspend fun editName(userId: Int, name: String, password: String): Result<User> {
        return try {
            val response = userService.editName(userId, name, password)
            if (response.isSuccessful) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(response.errorBody()?.string()))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun editEmail(userId: Int, email: String, password: String): Result<User> {
        return try {
            val response = userService.editEmail(userId, email, password)
            if (response.isSuccessful) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(response.errorBody()?.string()))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun editPassword(userId: Int, password: String, newPassword: String): Result<User> {
        return try {
            val response = userService.editPassword(userId, password, newPassword)
            if (response.isSuccessful) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(response.errorBody()?.string()))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun editIcon(userId: Int, iconId: String): Result<User> {
        return try {
            val response = userService.editIcon(userId, iconId)
            if (response.isSuccessful) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(response.errorBody()?.string()))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}