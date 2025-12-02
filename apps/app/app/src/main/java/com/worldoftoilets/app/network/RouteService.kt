package com.worldoftoilets.app.network

import com.worldoftoilets.app.models.responses.ApiResponse
import com.worldoftoilets.app.models.responses.RouteResponse
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

interface RouteService {
    @GET("route/calculate/toilet/{publicId}")
    suspend fun calculateRouteToToilet(
        @Path("publicId") publicId: String,
        @Query("originLat") originLat: Double,
        @Query("originLon") originLon: Double
    ): Response<ApiResponse<RouteResponse>>
}
