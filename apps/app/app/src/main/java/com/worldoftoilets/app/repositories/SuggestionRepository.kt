package com.worldoftoilets.app.repositories

import com.worldoftoilets.app.models.requests.CreateSuggestionRequest
import com.worldoftoilets.app.models.requests.ToiletSuggestionRequest
import com.worldoftoilets.app.models.responses.SuggestionResponse
import com.worldoftoilets.app.network.SuggestionService
import com.worldoftoilets.app.ui.util.parseApiError
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File
import javax.inject.Inject

class SuggestionRepository @Inject constructor(
    private val suggestionService: SuggestionService
) {
    suspend fun createSuggestion(
        name: String,
        address: String,
        city: String,
        state: String,
        country: String,
        access: String,
        extras: List<String>,
        toiletLatitude: Double,
        toiletLongitude: Double,
        userLatitude: Double,
        userLongitude: Double
    ): Result<SuggestionResponse> {
        return try {
            val toiletRequest = ToiletSuggestionRequest(
                access = access,
                name = name,
                address = address,
                latitude = toiletLatitude,
                longitude = toiletLongitude,
                city = city,
                state = state,
                country = country,
                placeId = null, // Not used for now
                extras = extras
            )
            val request = CreateSuggestionRequest(
                latitude = userLatitude,
                longitude = userLongitude,
                toilet = toiletRequest
            )

            val response = suggestionService.createSuggestion(request)
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

    suspend fun uploadImage(publicId: String, file: File): Result<Unit> {
        return try {
            val requestFile = file.asRequestBody("image/*".toMediaTypeOrNull())
            val body = MultipartBody.Part.createFormData("image", file.name, requestFile)

            val response = suggestionService.uploadImage(publicId, body)
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
}
