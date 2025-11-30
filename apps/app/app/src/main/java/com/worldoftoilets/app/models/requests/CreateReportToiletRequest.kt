package com.worldoftoilets.app.models.requests

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class CreateReportToiletRequest(
    @SerialName("toiletPublicId") val toiletPublicId: String,
    @SerialName("typeReportToilet") val typeReportToilet: String
)