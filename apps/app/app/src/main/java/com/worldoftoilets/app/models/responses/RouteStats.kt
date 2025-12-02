package com.worldoftoilets.app.models.responses

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class RouteStats(
    @SerialName("distanceMeters") val distanceMeters: Double,
    @SerialName("timeSeconds") val timeSeconds: Double,
    @SerialName("nodesInPath") val nodesInPath: Int,
    @SerialName("nodesExpanded") val nodesExpanded: Int
)
