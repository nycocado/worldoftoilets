package com.worldoftoilets.app.repositories

import com.worldoftoilets.app.models.Comment
import com.worldoftoilets.app.models.requests.CreateCommentRateRequest
import com.worldoftoilets.app.models.requests.CreateCommentRequest
import com.worldoftoilets.app.models.requests.UpdateCommentRequest
import com.worldoftoilets.app.models.responses.ApiResponse
import com.worldoftoilets.app.network.CommentService
import javax.inject.Inject

class CommentRepository @Inject constructor(
    private val commentService: CommentService
) {
    suspend fun getCommentsByToilet(
        toiletPublicId: String,
        page: Int = 0,
        size: Int = 20,
        timestamp: String? = null
    ): Result<List<Comment>> {
        return try {
            val response = commentService.getCommentsByToilet(
                toiletPublicId, true, page, size, timestamp
            )
            val apiResponse = response.body()

            if (response.isSuccessful && apiResponse?.data != null) {
                Result.success(apiResponse.data)
            } else {
                val errorMsg = apiResponse?.message ?: response.errorBody()?.string() ?: "Error getting comments"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getMyComments(
        page: Int = 0,
        size: Int = 20,
        timestamp: String? = null
    ): Result<List<Comment>> {
        return try {
            val response = commentService.getMyComments(true, page, size, timestamp)
            val apiResponse = response.body()

            if (response.isSuccessful && apiResponse?.data != null) {
                Result.success(apiResponse.data)
            } else {
                val errorMsg = apiResponse?.message ?: response.errorBody()?.string() ?: "Error getting my comments"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createComment(
        toiletPublicId: String,
        text: String?,
        clean: Int,
        paper: Boolean,
        structure: Int,
        accessibility: Int
    ): Result<Comment> {
        return try {
            val response = commentService.createComment(
                CreateCommentRequest(
                    toiletPublicId,
                    text,
                    CreateCommentRateRequest(clean, paper, structure, accessibility)
                )
            )
            val apiResponse = response.body()

            if (response.isSuccessful && apiResponse?.data != null) {
                Result.success(apiResponse.data)
            } else {
                val errorMsg = apiResponse?.message ?: response.errorBody()?.string() ?: "Error creating comment"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateComment(
        commentId: String,
        text: String?,
        clean: Int? = null,
        paper: Boolean? = null,
        structure: Int? = null,
        accessibility: Int? = null
    ): Result<Comment> {
        val rate = if (clean != null && paper != null && structure != null && accessibility != null) {
            CreateCommentRateRequest(clean, paper, structure, accessibility)
        } else {
            null
        }
        
        val request = UpdateCommentRequest(text = text, rate = rate)
        return try {
            val response = commentService.updateComment(commentId, request)
            if (response.isSuccessful && response.body()?.data != null) {
                Result.success(response.body()!!.data!!)
            } else {
                Result.failure(Exception("Error updating comment"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteComment(commentId: String): Result<Unit> {
        return try {
            val response = commentService.deleteComment(commentId)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Error deleting comment"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun reactToComment(
        commentPublicId: String,
        react: String
    ): Result<Comment> {
        return try {
            val response = commentService.reactToComment(commentPublicId, react)
            val apiResponse = response.body()

            if (response.isSuccessful && apiResponse?.data != null) {
                Result.success(apiResponse.data)
            } else {
                val errorMsg = apiResponse?.message ?: response.errorBody()?.string() ?: "Error reacting to comment"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}