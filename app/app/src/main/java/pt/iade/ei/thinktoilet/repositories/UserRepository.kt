package pt.iade.ei.thinktoilet.repositories

import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.network.RetrofitClient
import pt.iade.ei.thinktoilet.network.UserService
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

    suspend fun getUserComments(userId: Int): List<Comment> {
        return userService.getCommentsByUserId(userId)
    }
}