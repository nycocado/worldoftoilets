package pt.iade.ei.thinktoilet.repositories

import com.google.android.gms.common.api.Api
import com.google.gson.Gson
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.requests.CommentRequest
import pt.iade.ei.thinktoilet.models.responses.ApiResponse
import pt.iade.ei.thinktoilet.network.ToiletService
import pt.iade.ei.thinktoilet.network.RetrofitClient
import javax.inject.Inject

class ToiletRepository @Inject constructor() {
    private val toiletService = RetrofitClient.retrofit.create(ToiletService::class.java)

    suspend fun getToilets(
        ids: List<Int>? = null
    ): List<Toilet> {
        return toiletService.getToilets(ids)
    }

    suspend fun getToiletComment(toiletId: Int): List<Comment> {
        return toiletService.getCommentsByToiletId(toiletId)
    }

    suspend fun getToiletsNearby(lat: Double, lon: Double): List<Toilet> {
        return toiletService.getNearbyToilets(lat, lon)
    }

    suspend fun getToiletsByUserId(userId: Int): List<Toilet> {
        return toiletService.getToiletsByUserId(userId)
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
            val response = toiletService.postComment(
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
            if(response.isSuccessful) {
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
}