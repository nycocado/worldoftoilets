package pt.iade.ei.thinktoilet.repositories

import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.network.ToiletService
import pt.iade.ei.thinktoilet.network.RetrofitClient

class ToiletRepository {
    private val toiletService = RetrofitClient.retrofit.create(ToiletService::class.java)

    suspend fun getToilets(): List<Toilet> {
        return toiletService.getToilets()
    }

    suspend fun getToiletComment(toiletId: Int): List<Comment> {
        return toiletService.getCommentsByToiletId(toiletId)
    }

    suspend fun getToiletsNearby(lat: Double, lon: Double): List<Toilet> {
        return toiletService.getNearbyToilets(lat, lon)
    }
}