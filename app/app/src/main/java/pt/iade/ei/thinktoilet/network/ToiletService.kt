package pt.iade.ei.thinktoilet.network

import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.requests.ReportRequest
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
    suspend fun getToiletById(@Path("id") id: Int): Toilet

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
    suspend fun reportToilet(@Body reportRequest: ReportRequest)
}