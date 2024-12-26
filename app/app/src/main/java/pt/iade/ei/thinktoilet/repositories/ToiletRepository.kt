package pt.iade.ei.thinktoilet.repositories

import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.requests.ReportRequest
import pt.iade.ei.thinktoilet.network.RetrofitClient
import pt.iade.ei.thinktoilet.network.ToiletService
import javax.inject.Inject

class ToiletRepository @Inject constructor() {
    private val toiletService = RetrofitClient.retrofit.create(ToiletService::class.java)

    suspend fun getToilets(
        ids: List<Int>? = null,
        userId: Int? = null,
        pageable: Boolean = false,
        page: Int = 0,
        size: Int = 20
    ): List<Toilet> {
        return toiletService.getToilets(ids, userId, pageable, page, size)
    }

    suspend fun getToiletsNearby(
        lat: Double,
        lon: Double,
        userId: Int? = null,
        pageable: Boolean = false,
        page: Int = 0,
        size: Int = 20
    ): List<Toilet> {
        return toiletService.getNearbyToilets(lat, lon, userId, pageable, page, size)
    }

    suspend fun getToiletsByUserId(
        userId: Int,
        pageable: Boolean = false,
        page: Int = 0,
        size: Int = 20
    ): List<Toilet> {
        return toiletService.getToiletsByUserId(userId, pageable, page, size)
    }

    suspend fun postReport(
        toiletId: Int,
        userId: Int,
        typeReport: String
    ) {
        toiletService.reportToilet(ReportRequest(toiletId, userId, typeReport))
    }
}