package com.worldoftoilets.app.network

import com.worldoftoilets.app.models.requests.CreateReportCommentRequest
import com.worldoftoilets.app.models.requests.CreateReportReplyRequest
import com.worldoftoilets.app.models.requests.CreateReportToiletRequest
import com.worldoftoilets.app.models.requests.CreateReportUserRequest
import com.worldoftoilets.app.models.responses.ApiResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ReportService {
    @POST("report-toilet")
    suspend fun reportToilet(@Body request: CreateReportToiletRequest): Response<ApiResponse<Unit>>

    @POST("report-comment")
    suspend fun reportComment(@Body request: CreateReportCommentRequest): Response<ApiResponse<Unit>>

    @POST("report-reply")
    suspend fun reportReply(@Body request: CreateReportReplyRequest): Response<ApiResponse<Unit>>

    @POST("report-user")
    suspend fun reportUser(@Body request: CreateReportUserRequest): Response<ApiResponse<Unit>>
}
