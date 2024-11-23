package pt.iade.ei.thinktoilet.repositories

import pt.iade.ei.thinktoilet.models.CommentItem
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.network.RetrofitClient
import pt.iade.ei.thinktoilet.network.UserService

class UserRepository {
    private val userService = RetrofitClient.retrofit.create(UserService::class.java)

    suspend fun getUsers(): List<User> {
        return userService.getUsers()
    }

    suspend fun getUserById(userId: Int): User {
        return userService.getUserById(userId)
    }

    suspend fun getUserComments(userId: Int): List<CommentItem> {
        return userService.getCommentsByUserId(userId)
    }
}