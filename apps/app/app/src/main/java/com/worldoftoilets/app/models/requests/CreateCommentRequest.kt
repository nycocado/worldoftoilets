package com.worldoftoilets.app.models.requests

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class CreateCommentRequest(
    @SerialName("toiletPublicId") val toiletPublicId: String,
    @SerialName("text") val text: String?,
    @SerialName("rate") val rate: CreateCommentRateRequest
)