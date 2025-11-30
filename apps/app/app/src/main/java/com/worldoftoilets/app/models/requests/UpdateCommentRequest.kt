package com.worldoftoilets.app.models.requests

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class UpdateCommentRequest(
    @SerialName("text") val text: String?,
    @SerialName("rate") val rate: CreateCommentRateRequest?
)