package com.worldoftoilets.app.models.requests

import kotlinx.serialization.Serializable

@Serializable
data class ToiletSuggestionRequest(
    val access: String,
    val name: String,
    val address: String,
    val latitude: Double,
    val longitude: Double,
    val city: String,
    val state: String,
    val country: String,
    val placeId: String? = null,
    val extras: List<String>
)
