package pt.iade.ei.thinktoilet.repositories

import pt.iade.ei.thinktoilet.models.CommentItem
import pt.iade.ei.thinktoilet.models.Toilet
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

    suspend fun getToiletComment(toiletId: Int): List<CommentItem> {
        return toiletService.getCommentsByToiletId(toiletId)
    }

    suspend fun getToiletsNearby(lat: Double, lon: Double): List<Toilet> {
        return toiletService.getNearbyToilets(lat, lon)
    }

    suspend fun getToiletsByUserId(userId: Int): List<Toilet> {
        return toiletService.getToiletsByUserId(userId)
    }
}