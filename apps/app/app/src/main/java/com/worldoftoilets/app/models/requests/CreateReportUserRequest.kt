package com.worldoftoilets.app.models.requests

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class CreateReportUserRequest(
    @SerialName("userReportedPublicId") val userReportedPublicId: String,
    @SerialName("type") val type: String
)
