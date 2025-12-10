package com.worldoftoilets.app.network

import com.worldoftoilets.app.models.requests.CreateSuggestionRequest
import com.worldoftoilets.app.models.responses.ApiResponse
import com.worldoftoilets.app.models.responses.SuggestionResponse
import okhttp3.MultipartBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Path

interface SuggestionService {
    @POST("suggestion")
    suspend fun createSuggestion(
        @Body request: CreateSuggestionRequest
    ): Response<ApiResponse<SuggestionResponse>>

    @Multipart
    @POST("suggestion/{publicId}/image")
    suspend fun uploadImage(
        @Path("publicId") publicId: String,
        @Part image: MultipartBody.Part
    ): Response<ApiResponse<Unit>>
}
