package com.worldoftoilets.app.models.responses

import com.google.gson.annotations.SerializedName

data class ApiResponse<T>(
    @SerializedName("statusCode") val statusCode: Int?,
    @SerializedName("status") val status: Int?,
    @SerializedName("message") val message: String?,
    @SerializedName("data") val data: T?,
    @SerializedName("timestamp") val timestamp: String?
)
