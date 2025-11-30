package com.worldoftoilets.app.network

import com.worldoftoilets.app.models.Reply
import com.worldoftoilets.app.models.requests.CreateReplyRequest
import com.worldoftoilets.app.models.requests.UpdateReplyRequest
import com.worldoftoilets.app.models.responses.ApiResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ReplyService {
    @GET("reply/comment/{publicId}")
    suspend fun getRepliesByComment(
        @Path("publicId") commentPublicId: String,
        @Query("pageable") pageable: Boolean = true,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20
    ): Response<ApiResponse<List<Reply>>>

    @POST("reply")
    suspend fun createReply(
        @Body request: CreateReplyRequest
    ): Response<ApiResponse<Reply>>

    @PATCH("reply/{publicId}")
    suspend fun updateReply(
        @Path("publicId") publicId: String,
        @Body request: UpdateReplyRequest
    ): Response<ApiResponse<Reply>>

    @DELETE("reply/{publicId}")
    suspend fun deleteReply(
        @Path("publicId") publicId: String
    ): Response<ApiResponse<Unit>>
}
