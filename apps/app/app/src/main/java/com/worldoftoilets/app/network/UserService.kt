package com.worldoftoilets.app.network

import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.models.requests.DeleteUserRequest
import com.worldoftoilets.app.models.requests.UpdateUserRequest
import com.worldoftoilets.app.models.responses.ApiResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH

interface UserService {
    @GET("user/self")
    suspend fun getSelf(): Response<ApiResponse<User>>

    @PATCH("user/self")
    suspend fun updateSelf(@Body request: UpdateUserRequest): Response<ApiResponse<User>>

    @DELETE("user/self")
    suspend fun deleteSelf(@Body request: DeleteUserRequest): Response<ApiResponse<Unit>>
}