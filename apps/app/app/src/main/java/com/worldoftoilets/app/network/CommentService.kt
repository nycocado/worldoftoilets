package com.worldoftoilets.app.network

import com.worldoftoilets.app.models.Comment
import com.worldoftoilets.app.models.requests.CreateCommentRequest
import com.worldoftoilets.app.models.requests.UpdateCommentRequest
import com.worldoftoilets.app.models.responses.ApiResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface CommentService {
    @GET("comment/toilet/{publicId}")
    suspend fun getCommentsByToilet(
        @Path("publicId") toiletPublicId: String,
        @Query("pageable") pageable: Boolean = true,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20,
        @Query("timestamp") timestamp: String? = null
    ): Response<ApiResponse<List<Comment>>>

    @GET("comment/user/self")
    suspend fun getMyComments(
        @Query("pageable") pageable: Boolean = true,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20,
        @Query("timestamp") timestamp: String? = null
    ): Response<ApiResponse<List<Comment>>>

    @POST("comment")
    suspend fun createComment(@Body request: CreateCommentRequest): Response<ApiResponse<Comment>>

    @PATCH("comment/{publicId}")
    suspend fun updateComment(
        @Path("publicId") publicId: String,
        @Body request: UpdateCommentRequest
    ): Response<ApiResponse<Comment>>

    @DELETE("comment/{publicId}")
    suspend fun deleteComment(@Path("publicId") publicId: String): Response<ApiResponse<Unit>>

    @PUT("comment/{publicId}/react")
    suspend fun reactToComment(
        @Path("publicId") publicId: String,
        @Query("react") react: String
    ): Response<ApiResponse<Comment>>
}