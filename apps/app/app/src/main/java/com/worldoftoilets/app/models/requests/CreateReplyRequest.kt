package com.worldoftoilets.app.models.requests

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class CreateReplyRequest(
    @SerialName("commentPublicId") val commentPublicId: String,
    @SerialName("text") val text: String
)