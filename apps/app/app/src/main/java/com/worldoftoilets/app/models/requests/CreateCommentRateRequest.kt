package com.worldoftoilets.app.models.requests

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class CreateCommentRateRequest(
    @SerialName("clean") val clean: Int,
    @SerialName("paper") val paper: Boolean,
    @SerialName("structure") val structure: Int,
    @SerialName("accessibility") val accessibility: Int
)