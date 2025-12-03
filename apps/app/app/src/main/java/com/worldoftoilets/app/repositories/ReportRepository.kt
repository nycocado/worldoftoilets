package com.worldoftoilets.app.repositories

import com.worldoftoilets.app.models.requests.CreateReportCommentRequest
import com.worldoftoilets.app.models.requests.CreateReportReplyRequest
import com.worldoftoilets.app.models.requests.CreateReportToiletRequest
import com.worldoftoilets.app.models.requests.CreateReportUserRequest
import com.worldoftoilets.app.network.ReportService
import javax.inject.Inject
import com.worldoftoilets.app.ui.util.parseApiError

class ReportRepository @Inject constructor(
    private val reportService: ReportService
) {
    suspend fun reportToilet(
        toiletPublicId: String,
        typeReport: String
    ): Result<Unit> {
        return try {
            val response = reportService.reportToilet(
                CreateReportToiletRequest(toiletPublicId, typeReport)
            )
            val apiResponse = response.body()

            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                val errorMsg = apiResponse?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun reportComment(
        commentPublicId: String,
        typeReport: String
    ): Result<Unit> {
        return try {
            val response = reportService.reportComment(
                CreateReportCommentRequest(commentPublicId, typeReport)
            )
            val apiResponse = response.body()

            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                val errorMsg = apiResponse?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun reportReply(
        replyPublicId: String,
        typeReport: String
    ): Result<Unit> {
        return try {
            val response = reportService.reportReply(
                CreateReportReplyRequest(replyPublicId, typeReport)
            )
            val apiResponse = response.body()

            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                val errorMsg = apiResponse?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun reportUser(
        userPublicId: String,
        typeReport: String
    ): Result<Unit> {
        return try {
            val response = reportService.reportUser(
                CreateReportUserRequest(userPublicId, typeReport)
            )
            val apiResponse = response.body()

            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                val errorMsg = apiResponse?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
