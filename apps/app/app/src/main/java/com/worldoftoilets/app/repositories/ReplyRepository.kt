package com.worldoftoilets.app.repositories

import com.worldoftoilets.app.models.Reply
import com.worldoftoilets.app.models.requests.CreateReplyRequest
import com.worldoftoilets.app.models.requests.UpdateReplyRequest
import com.worldoftoilets.app.network.ReplyService
import javax.inject.Inject
import com.worldoftoilets.app.ui.util.parseApiError

class ReplyRepository @Inject constructor(
    private val replyService: ReplyService
) {
    suspend fun getRepliesByComment(
        commentPublicId: String,
        page: Int = 0,
        size: Int = 20
    ): Result<List<Reply>> {
        return try {
            val response =
                replyService.getRepliesByComment(commentPublicId, page = page, size = size)
            if (response.isSuccessful && response.body()?.data != null) {
                Result.success(response.body()!!.data!!)
            } else {
                val errorMsg =
                    response.body()?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createReply(commentPublicId: String, text: String): Result<Reply> {
        return try {
            val response = replyService.createReply(CreateReplyRequest(commentPublicId, text))
            if (response.isSuccessful && response.body()?.data != null) {
                Result.success(response.body()!!.data!!)
            } else {
                val errorMsg =
                    response.body()?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateReply(replyId: String, text: String): Result<Reply> {
        return try {
            val response = replyService.updateReply(replyId, UpdateReplyRequest(text))
            if (response.isSuccessful && response.body()?.data != null) {
                Result.success(response.body()!!.data!!)
            } else {
                val errorMsg =
                    response.body()?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteReply(replyId: String): Result<Unit> {
        return try {
            val response = replyService.deleteReply(replyId)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                val errorMsg =
                    response.body()?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
