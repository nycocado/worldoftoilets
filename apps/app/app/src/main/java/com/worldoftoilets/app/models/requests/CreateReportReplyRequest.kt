package com.worldoftoilets.app.models.requests

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class CreateReportReplyRequest(
    @SerialName("replyPublicId") val replyPublicId: String,
    @SerialName("type") val type: String
)