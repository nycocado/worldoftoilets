package com.worldoftoilets.app.models.requests

import com.google.gson.annotations.SerializedName

data class CreateCommentRequest(
    @SerializedName("toiletPublicId") val toiletPublicId: String,
    @SerializedName("text") val text: String?,
    @SerializedName("rate") val rate: CommentRateRequest
)

data class CommentRateRequest(
    @SerializedName("clean") val clean: Int,
    @SerializedName("paper") val paper: Boolean,
    @SerializedName("structure") val structure: Int,
    @SerializedName("accessibility") val accessibility: Int
)
