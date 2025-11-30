package com.worldoftoilets.app.models.responses

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ApiResponse<T>(
    @SerialName("statusCode") val statusCode: Int? = null,
    @SerialName("status") val status: Int? = null,
    @SerialName("message") val message: String? = null,
    @SerialName("data") val data: T? = null,
    @SerialName("timestamp") val timestamp: String? = null
)
