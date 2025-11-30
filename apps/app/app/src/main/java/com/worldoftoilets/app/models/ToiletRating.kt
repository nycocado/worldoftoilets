package com.worldoftoilets.app.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ToiletRating(
    @SerialName("totalRatings") val totalRatings: Int = 0,
    @SerialName("avgClean") val avgClean: Double = 0.0,
    @SerialName("avgStructure") val avgStructure: Double = 0.0,
    @SerialName("avgAccessibility") val avgAccessibility: Double = 0.0,
    @SerialName("paperAvailability") val paperAvailability: Double = 0.0
) : java.io.Serializable
