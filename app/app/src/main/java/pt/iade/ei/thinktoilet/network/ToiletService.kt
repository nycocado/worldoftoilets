package pt.iade.ei.thinktoilet.network

import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Toilet
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

interface ToiletService {
    @GET("toilets")
    suspend fun getToilets(
        @Query("ids") ids: List<Int>? = null,
        @Query("pageable") pageable: Boolean = false,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20
    ): List<Toilet>

    @GET("toilets/{id}")
    suspend fun getToiletById(@Path("id") id: Int): Toilet

    @GET("toilets/{id}/comments")
    suspend fun getCommentsByToiletId(
        @Path("id") id: Int,
        @Query("pageable") pageable: Boolean = false,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20
    ): List<Comment>

    @GET("toilets/nearby")
    suspend fun getNearbyToilets(
        @Query("lat") lat: Double,
        @Query("lon") lon: Double,
        @Query("pageable") pageable: Boolean = false,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20
    ): List<Toilet>

    @GET("toilets/users/{id}")
    suspend fun getToiletsByUserId(@Path("id") id: Int): List<Toilet>
}