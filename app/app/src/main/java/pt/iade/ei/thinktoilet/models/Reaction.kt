package pt.iade.ei.thinktoilet.models

import com.google.gson.annotations.SerializedName

data class Reaction(
    @SerializedName("commentId") val commentId: Int,
    @SerializedName("typeReaction") val typeReaction: TypeReaction,
)
