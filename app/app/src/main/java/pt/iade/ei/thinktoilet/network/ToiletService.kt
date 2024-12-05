package pt.iade.ei.thinktoilet.network

import pt.iade.ei.thinktoilet.models.CommentItem
import pt.iade.ei.thinktoilet.models.Toilet
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

interface ToiletService {
    @GET("toilets")
    suspend fun getToilets(
        @Query("ids") ids: List<Int>? = null,
    ): List<Toilet>

    @GET("toilets/{id}")
    suspend fun getToiletById(@Path("id") id: Int): Toilet

    @GET("toilets/{id}/comments")
    suspend fun getCommentsByToiletId(@Path("id") id: Int): List<CommentItem>

    @GET("toilets/nearby")
    suspend fun getNearbyToilets(
        @Query("lat") lat: Double,
        @Query("lon") lon: Double
    ): List<Toilet>

    @GET("toilets/users/{id}")
    suspend fun getToiletsByUserId(@Path("id") id: Int): List<Toilet>
}