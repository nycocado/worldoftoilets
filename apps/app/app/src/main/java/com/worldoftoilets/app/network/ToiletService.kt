package com.worldoftoilets.app.network

import com.worldoftoilets.app.models.SearchToilet
import com.worldoftoilets.app.models.Toilet
import com.worldoftoilets.app.models.requests.ReportRequest
import com.worldoftoilets.app.models.responses.ApiResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ToiletService {
    @GET("toilets")
    suspend fun getToilets(
        @Query("ids") ids: List<Int>? = null,
        @Query("userId") userId: Int? = null,
        @Query("pageable") pageable: Boolean = false,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20,
        @Query("state") state: String? = "active"
    ): List<Toilet>

    @GET("toilets/{id}")
    suspend fun getToiletById(@Path("id") id: Int): Response<Toilet>

    @GET("toilets/nearby")
    suspend fun getNearbyToilets(
        @Query("lat") lat: Double,
        @Query("lon") lon: Double,
        @Query("userId") userId: Int? = null,
        @Query("pageable") pageable: Boolean = false,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20,
        @Query("state") state: String? = "active"
    ): List<Toilet>

    @GET("toilets/users/{id}")
    suspend fun getToiletsByUserId(
        @Path("id") id: Int,
        @Query("pageable") pageable: Boolean = false,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20,
        @Query("state") state: String? = "active"
    ): List<Toilet>

    @POST("toilets/reports")
    suspend fun reportToilet(@Body reportRequest: ReportRequest): Response<ApiResponse>

    @GET("toilets/search/{query}")
    suspend fun searchToilets(
        @Path("query") query: String,
        @Query("state") pageable: Boolean = false,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 5
    ): List<SearchToilet>

    @GET("toilets/bounding")
    suspend fun getToiletsInBoundingBox(
        @Query("minLat") minLat: Double,
        @Query("maxLat") maxLat: Double,
        @Query("minLon") minLon: Double,
        @Query("maxLon") maxLon: Double
    ): List<Toilet>
}