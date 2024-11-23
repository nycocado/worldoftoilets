package pt.iade.ei.thinktoilet.network

import pt.iade.ei.thinktoilet.models.CommentItem
import pt.iade.ei.thinktoilet.models.User
import retrofit2.http.GET
import retrofit2.http.Path

interface UserService {
    @GET("users")
    suspend fun getUsers(): List<User>

    @GET("users/{id}")
    suspend fun getUserById(@Path("id") id: Int): User

    @GET("users/{id}/comments")
    suspend fun getCommentsByUserId(@Path("id") id: Int): List<CommentItem>
}