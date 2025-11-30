package com.worldoftoilets.app.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class CommentRate(
    @SerialName("clean") val clean: Int = 0,
    @SerialName("paper") val paper: Boolean = false,
    @SerialName("structure") val structure: Int = 0,
    @SerialName("accessibility") val accessibility: Int = 0
) : java.io.Serializable
