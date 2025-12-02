package com.worldoftoilets.app.repositories

import com.worldoftoilets.app.models.responses.RouteResponse
import com.worldoftoilets.app.network.RouteService
import com.worldoftoilets.app.ui.util.parseApiError
import javax.inject.Inject

class RouteRepository @Inject constructor(
    private val routeService: RouteService
) {
    suspend fun calculateRouteToToilet(
        publicId: String,
        originLat: Double,
        originLon: Double
    ): Result<RouteResponse> {
        return try {
            val response = routeService.calculateRouteToToilet(publicId, originLat, originLon)
            val apiResponse = response.body()

            if (response.isSuccessful && apiResponse?.data != null) {
                Result.success(apiResponse.data)
            } else {
                val errorMsg = apiResponse?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
