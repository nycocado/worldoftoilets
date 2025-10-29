package com.worldoftoilets.app.models

import com.google.gson.annotations.SerializedName
import com.worldoftoilets.app.models.enums.TypeReaction

data class Reaction(
    @SerializedName("commentId") val commentId: Int,
    @SerializedName("typeReaction") val typeReaction: TypeReaction,
)
