package com.worldoftoilets.app.models.requests

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class CreateReportCommentRequest(
    @SerialName("commentPublicId") val commentPublicId: String,
    @SerialName("typeReportComment") val typeReportComment: String
)