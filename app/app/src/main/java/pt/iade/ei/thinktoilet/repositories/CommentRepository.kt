package pt.iade.ei.thinktoilet.repositories

import com.google.gson.Gson
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Reaction
import pt.iade.ei.thinktoilet.models.requests.CommentRequest
import pt.iade.ei.thinktoilet.models.requests.ReactionRequest
import pt.iade.ei.thinktoilet.models.responses.ApiResponse
import pt.iade.ei.thinktoilet.network.CommentService
import pt.iade.ei.thinktoilet.network.RetrofitClient
import javax.inject.Inject

class CommentRepository @Inject constructor(){
    private val commentService = RetrofitClient.retrofit.create(CommentService::class.java)

    suspend fun getCommentsByToiletId(toiletId: Int, userId: Int): List<Comment> {
        return commentService.getCommentsByToiletId(toiletId, userId)
    }

    suspend fun getCommentsByUserId(userId: Int): List<Comment> {
        return commentService.getCommentsByUserId(userId)
    }

    suspend fun getReactionsByUserId(userId: Int, commentIds: List<Int>): List<Reaction> {
        return commentService.getReactionsByUserId(userId, commentIds)
    }

    suspend fun postComment(
        toiletId: Int,
        userId: Int,
        text: String,
        ratingClean: Int,
        ratingPaper: Boolean,
        ratingStructure: Int,
        ratingAccessibility: Int
    ): Result<Comment> {
        return try {
            val response = commentService.postComment(
                CommentRequest(
                    toiletId,
                    userId,
                    text,
                    ratingClean,
                    ratingPaper,
                    ratingStructure,
                    ratingAccessibility
                )
            )
            if (response.isSuccessful) {
                response.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("No comment found"))
            } else {
                val errorBody = response.errorBody()?.string()
                val errorResponse = Gson().fromJson(errorBody, ApiResponse::class.java)
                Result.failure(Exception(errorResponse.message))
            }
        } catch (e: Exception) {
            throw e
        }
    }

    suspend fun postReaction(commentId: Int, userId: Int, typeReaction: String) {
        commentService.postReaction(ReactionRequest(commentId, userId, typeReaction))
    }

    suspend fun deleteReaction(commentId: Int, userId: Int) {
        commentService.deleteReaction(commentId, userId)
    }
}