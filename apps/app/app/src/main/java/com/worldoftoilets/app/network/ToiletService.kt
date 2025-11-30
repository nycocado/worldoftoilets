package com.worldoftoilets.app.network

import com.worldoftoilets.app.models.Toilet
import com.worldoftoilets.app.models.responses.ApiResponse
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface ToiletService {
    @GET("toilet")
    suspend fun getToilets(
        @Query("pageable") pageable: Boolean = true,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20,
        @Query("city") city: String? = null,
        @Query("country") country: String? = null,
        @Query("countryCode") countryCode: String? = null,
        @Query("access") access: String? = null,
        @Query("extras") extras: List<String>? = null,
        @Query("timestamp") timestamp: String? = null
    ): Response<ApiResponse<List<Toilet>>>

    @GET("toilet/proximity")
    suspend fun getToiletsByProximity(
        @Query("lat") lat: Double,
        @Query("lng") lng: Double,
        @Query("pageable") pageable: Boolean = true,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20,
        @Query("access") access: String? = null,
        @Query("extras") extras: List<String>? = null,
        @Query("timestamp") timestamp: String? = null
    ): Response<ApiResponse<List<Toilet>>>

    @GET("toilet/bounding-box")
    suspend fun getToiletsByBoundingBox(
        @Query("minLat") minLat: Double,
        @Query("minLng") minLng: Double,
        @Query("maxLat") maxLat: Double,
        @Query("maxLng") maxLng: Double,
        @Query("access") access: String? = null,
        @Query("extras") extras: List<String>? = null,
        @Query("timestamp") timestamp: String? = null
    ): Response<ApiResponse<List<Toilet>>>

    @GET("toilet/{publicId}")
    suspend fun getToilet(@Path("publicId") publicId: String): Response<ApiResponse<Toilet>>

    @PUT("toilet/{publicId}/view")
    suspend fun viewToilet(@Path("publicId") publicId: String): Response<ApiResponse<Unit>>

    @GET("search-toilet")
    suspend fun searchToilets(
        @Query("query") query: String,
        @Query("pageable") pageable: Boolean = true,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20
    ): Response<ApiResponse<List<Toilet>>>
}