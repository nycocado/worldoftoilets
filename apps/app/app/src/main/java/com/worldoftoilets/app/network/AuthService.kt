package com.worldoftoilets.app.network

import com.worldoftoilets.app.models.requests.LoginRequest
import com.worldoftoilets.app.models.requests.RegisterRequest
import com.worldoftoilets.app.models.responses.ApiResponse
import com.worldoftoilets.app.models.responses.LoginResponse
import com.worldoftoilets.app.models.responses.RefreshTokenResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Query

interface AuthService {
    @POST("auth/login")
    suspend fun login(@Body loginRequest: LoginRequest): Response<ApiResponse<LoginResponse>>

    @POST("auth/register")
    suspend fun register(@Body registerRequest: RegisterRequest): Response<ApiResponse<Unit>>

    @POST("auth/refresh")
    suspend fun refresh(
        @Header("Authorization") bearerToken: String
    ): Response<ApiResponse<RefreshTokenResponse>>

    @POST("auth/refresh")
    fun refreshSync(
        @Header("Authorization") bearerToken: String
    ): retrofit2.Call<ApiResponse<RefreshTokenResponse>>

    @POST("auth/logout")
    suspend fun logout(
        @Header("Authorization") bearerToken: String
    ): Response<ApiResponse<Unit>>

    @POST("auth/logout-all")
    suspend fun logoutAll(
        @Header("Authorization") bearerToken: String
    ): Response<ApiResponse<Unit>>

    @POST("auth/resend-verification")
    suspend fun resendVerification(
        @Query("email") email: String
    ): Response<ApiResponse<Unit>>
}