package com.worldoftoilets.app.repositories

import com.google.gson.Gson
import com.worldoftoilets.app.models.Comment
import com.worldoftoilets.app.models.requests.CreateCommentRequest
import com.worldoftoilets.app.models.requests.CommentRateRequest
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
                    CommentRateRequest(clean, paper, structure, accessibility)
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