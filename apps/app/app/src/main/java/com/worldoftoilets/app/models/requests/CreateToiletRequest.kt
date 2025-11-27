package com.worldoftoilets.app.models.requests

import com.google.gson.annotations.SerializedName

data class CreateToiletRequest(
    @SerializedName("name") val name: String,
    @SerializedName("address") val address: String,
    @SerializedName("city") val city: String,
    @SerializedName("state") val state: String?,
    @SerializedName("country") val country: String,
    @SerializedName("countryCode") val countryCode: String,
    @SerializedName("latitude") val latitude: Double,
    @SerializedName("longitude") val longitude: Double,
    @SerializedName("accessApiName") val accessApiName: String,
    @SerializedName("extrasApiNames") val extrasApiNames: List<String>?,
    @SerializedName("placeId") val placeId: String?
)
