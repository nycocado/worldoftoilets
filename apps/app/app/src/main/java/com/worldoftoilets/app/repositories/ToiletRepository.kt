package com.worldoftoilets.app.repositories

import com.worldoftoilets.app.models.Toilet
import com.worldoftoilets.app.network.ToiletService
import javax.inject.Inject
import com.worldoftoilets.app.ui.util.parseApiError

class ToiletRepository @Inject constructor(
    private val toiletService: ToiletService
) {
    suspend fun getToiletsByProximity(
        lat: Double,
        lng: Double,
        page: Int = 0,
        size: Int = 20,
        timestamp: String? = null,
        access: String? = null,
        extras: List<String>? = null
    ): Result<List<Toilet>> {
        return try {
            val extrasString = extras?.joinToString(",")
            val response = toiletService.getToiletsByProximity(
                lat, lng, true, page, size, access, extrasString, timestamp
            )
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

    suspend fun getToiletsByBoundingBox(
        minLat: Double,
        minLng: Double,
        maxLat: Double,
        maxLng: Double,
        access: String? = null,
        extras: List<String>? = null
    ): Result<List<Toilet>> {
        return try {
            val extrasString = extras?.joinToString(",")
            val response = toiletService.getToiletsByBoundingBox(
                minLat, minLng, maxLat, maxLng, access, extrasString, null
            )
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

    suspend fun getToilet(publicId: String): Result<Toilet> {
        return try {
            val response = toiletService.getToilet(publicId)
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

    suspend fun viewToilet(publicId: String): Result<Unit> {
        return try {
            val response = toiletService.viewToilet(publicId)
            val apiResponse = response.body()

            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                val errorMsg = apiResponse?.message ?: parseApiError(response.errorBody()?.string())
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun searchToilets(query: String): Result<List<Toilet>> {
        return try {
            val response = toiletService.searchToilets(query)
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