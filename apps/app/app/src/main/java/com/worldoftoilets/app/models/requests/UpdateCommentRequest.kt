package com.worldoftoilets.app.models.requests

import com.google.gson.annotations.SerializedName

data class UpdateCommentRequest(
    @SerializedName("text") val text: String?,
    @SerializedName("rate") val rate: CommentRateRequest?
)
