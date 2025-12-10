package com.worldoftoilets.app.models.requests

import kotlinx.serialization.Serializable

@Serializable
data class CreateSuggestionRequest(
    val latitude: Double,
    val longitude: Double,
    val toilet: ToiletSuggestionRequest
)
