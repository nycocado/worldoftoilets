package com.worldoftoilets.app.models.requests

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class CreateToiletRequest(
    @SerialName("name") val name: String,
    @SerialName("address") val address: String,
    @SerialName("city") val city: String,
    @SerialName("state") val state: String?,
    @SerialName("country") val country: String,
    @SerialName("countryCode") val countryCode: String,
    @SerialName("latitude") val latitude: Double,
    @SerialName("longitude") val longitude: Double,
    @SerialName("accessApiName") val accessApiName: String,
    @SerialName("extrasApiNames") val extrasApiNames: List<String>?,
    @SerialName("placeId") val placeId: String?
)