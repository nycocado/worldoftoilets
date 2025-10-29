package com.worldoftoilets.app.repositories

import com.worldoftoilets.app.models.SearchToilet
import com.worldoftoilets.app.models.Toilet
import com.worldoftoilets.app.models.requests.ReportRequest
import com.worldoftoilets.app.models.responses.ApiResponse
import com.worldoftoilets.app.network.RetrofitClient
import com.worldoftoilets.app.network.ToiletService
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

    suspend fun getToiletById(id: Int): Result<Toilet> {
        return try {
            val response = toiletService.getToiletById(id)
            if (response.isSuccessful) {
                response.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("No response found"))
            } else {
                Result.failure(Exception("Error getting toilet"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
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
    ): Result<ApiResponse> {
        return try {
            val response = toiletService.reportToilet(ReportRequest(toiletId, userId, typeReport))
            if (response.isSuccessful) {
                response.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("No response found"))
            } else {
                Result.failure(Exception("Error reporting toilet"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun searchToilets(query: String): List<SearchToilet> {
        return toiletService.searchToilets(query)
    }

    suspend fun getToiletsInBoundingBox(
        minLat: Double,
        maxLat: Double,
        minLon: Double,
        maxLon: Double
    ): List<Toilet> {
        return toiletService.getToiletsInBoundingBox(minLat, maxLat, minLon, maxLon)
    }
}