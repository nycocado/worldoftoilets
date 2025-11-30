package com.worldoftoilets.app.repositories

import com.worldoftoilets.app.models.Toilet
import com.worldoftoilets.app.network.ToiletService
import javax.inject.Inject

class ToiletRepository @Inject constructor(
    private val toiletService: ToiletService
) {
    suspend fun getToiletsByProximity(
        lat: Double,
        lng: Double,
        page: Int = 0,
        size: Int = 20,
        timestamp: String? = null
    ): Result<List<Toilet>> {
        return try {
            val response = toiletService.getToiletsByProximity(
                lat, lng, true, page, size, null, null, timestamp
            )
            val apiResponse = response.body()

            if (response.isSuccessful && apiResponse?.data != null) {
                Result.success(apiResponse.data)
            } else {
                val errorMsg = apiResponse?.message ?: response.errorBody()?.string() ?: "Error getting nearby toilets"
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
        maxLng: Double
    ): Result<List<Toilet>> {
        return try {
            val response = toiletService.getToiletsByBoundingBox(
                minLat, minLng, maxLat, maxLng, null, null, null
            )
            val apiResponse = response.body()

            if (response.isSuccessful && apiResponse?.data != null) {
                Result.success(apiResponse.data)
            } else {
                val errorMsg = apiResponse?.message ?: response.errorBody()?.string() ?: "Error getting toilets in bounding box"
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
                val errorMsg = apiResponse?.message ?: response.errorBody()?.string() ?: "Error getting toilet"
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
                val errorMsg = apiResponse?.message ?: response.errorBody()?.string() ?: "Error registering view"
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
                val errorMsg = apiResponse?.message ?: response.errorBody()?.string() ?: "Error searching toilets"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}