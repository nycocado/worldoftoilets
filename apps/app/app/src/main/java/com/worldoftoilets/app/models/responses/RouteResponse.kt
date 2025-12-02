package com.worldoftoilets.app.models.responses

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class RouteResponse(
    @SerialName("status") val status: String,
    @SerialName("algorithm") val algorithm: String,
    @SerialName("path") val path: List<List<Double>>, // [[lng, lat], [lng, lat]]
    @SerialName("stats") val stats: RouteStats
)
