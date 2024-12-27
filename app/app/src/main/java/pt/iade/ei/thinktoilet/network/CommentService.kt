package pt.iade.ei.thinktoilet.network

import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Reaction
import pt.iade.ei.thinktoilet.models.requests.CommentRequest
import pt.iade.ei.thinktoilet.models.requests.ReactionRequest
import pt.iade.ei.thinktoilet.models.responses.ApiResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface CommentService {
    @GET("comments/toilets/{id}")
    suspend fun getCommentsByToiletId(
        @Path("id") id: Int,
        @Query("userId") userId: Int? = null,
        @Query("pageable") pageable: Boolean = false,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20
    ): List<Comment>

    @GET("comments/users/{id}")
    suspend fun getCommentsByUserId(
        @Path("id") id: Int,
        @Query("pageable") pageable: Boolean = false,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20
    ): List<Comment>

    @GET("comments/reactions")
    suspend fun getReactionsByUserId(
        @Query("userId") userId: Int,
        @Query("commentIds") commentId: List<Int>
    ): List<Reaction>

    @POST("comments")
    suspend fun postComment(@Body commentRequest: CommentRequest): Response<Comment>

    @POST("comments/reactions")
    suspend fun postReaction(@Body reactionRequest: ReactionRequest): Response<ApiResponse>

    @DELETE("comments/reactions")
    suspend fun deleteReaction(
        @Query("commentId") commentId: Int,
        @Query("userId") userId: Int
    )
}