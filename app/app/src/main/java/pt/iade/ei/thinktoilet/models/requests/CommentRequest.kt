package pt.iade.ei.thinktoilet.models.requests

import com.google.gson.annotations.SerializedName

data class CommentRequest(
    @SerializedName("toiletId") val toiletId: Int,
    @SerializedName("userId") val userId: Int,
    @SerializedName("text") val text: String,
    @SerializedName("ratingClean") val ratingClean: Int,
    @SerializedName("ratingPaper") val ratingPaper: Boolean,
    @SerializedName("ratingStructure") val ratingStructure: Int,
    @SerializedName("ratingAccessibility") val ratingAccessibility: Int
)
