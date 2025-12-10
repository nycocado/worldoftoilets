package com.worldoftoilets.app.models.responses

import com.worldoftoilets.app.models.Toilet
import kotlinx.serialization.Serializable

@Serializable
data class SuggestionResponse(
    val publicId: String,
    val latitude: Double,
    val longitude: Double,
    val photoUrl: String? = null,
    val status: String,
    val toilet: Toilet,
    val createdAt: String
)
