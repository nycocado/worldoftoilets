package com.worldoftoilets.app.models.requests

import com.google.gson.annotations.SerializedName

data class ReactionRequest(
    @SerializedName("commentId") val commentId: Int,
    @SerializedName("userId") val userId: Int,
    @SerializedName("typeReaction") val typeReaction: String
)
