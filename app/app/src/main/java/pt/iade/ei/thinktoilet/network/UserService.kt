package pt.iade.ei.thinktoilet.network

import pt.iade.ei.thinktoilet.models.User
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface UserService {
    @GET("users")
    suspend fun getUsers(
        @Query("ids") ids: List<Int>? = null
    ): List<User>

    @GET("users/{id}")
    suspend fun getUserById(@Path("id") id: Int): User

    @POST("users/edit/name/{id}")
    suspend fun editName(
        @Path("id") id: Int,
        @Query("name") name: String,
        @Query("password") password: String
    ): Response<User>

    @POST("users/edit/email/{id}")
    suspend fun editEmail(
        @Path("id") id: Int,
        @Query("email") email: String,
        @Query("password") password: String
    ): Response<User>

    @POST("users/edit/password/{id}")
    suspend fun editPassword(
        @Path("id") id: Int,
        @Query("password") password: String,
        @Query("newPassword") newPassword: String
    ): Response<User>

    @POST("users/edit/icon/{id}")
    suspend fun editIcon(
        @Path("id") id: Int,
        @Query("iconId") iconId: String
    ): Response<User>
}