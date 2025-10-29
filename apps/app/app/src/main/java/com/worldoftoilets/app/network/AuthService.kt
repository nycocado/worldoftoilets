package com.worldoftoilets.app.network

import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.models.requests.LoginRequest
import com.worldoftoilets.app.models.requests.RegisterRequest
import com.worldoftoilets.app.models.responses.ApiResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthService {
    @POST("auth/login")
    suspend fun login(@Body loginRequest: LoginRequest): Response<User>

    @POST("auth/register")
    suspend fun register(@Body registerRequest: RegisterRequest): Response<ApiResponse>
}