package pt.iade.ei.thinktoilet.models

import com.google.gson.annotations.SerializedName
import pt.iade.ei.thinktoilet.models.enums.TypeReaction

data class Reaction(
    @SerializedName("commentId") val commentId: Int,
    @SerializedName("typeReaction") val typeReaction: TypeReaction,
)
