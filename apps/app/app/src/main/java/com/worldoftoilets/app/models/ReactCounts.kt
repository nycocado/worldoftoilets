package com.worldoftoilets.app.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ReactCounts(
    @SerialName("likes") val likes: Int = 0,
    @SerialName("dislikes") val dislikes: Int = 0
) : java.io.Serializable {
    val likeCount: Int
        get() = likes
    val dislikeCount: Int
        get() = dislikes
}
