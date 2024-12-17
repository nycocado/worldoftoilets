package pt.iade.ei.thinktoilet.models

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class Comment(
    @SerializedName("id") var id: Int?,
    @SerializedName("toiletId") var toiletId: Int,
    @SerializedName("userId") val userId: Int,
    @SerializedName("text") val text: String,
    @SerializedName("ratingClean") val ratingClean: Int,
    @SerializedName("ratingPaper") val ratingPaper: Boolean,
    @SerializedName("ratingStructure") val ratingStructure: Int,
    @SerializedName("ratingAccessibility") val ratingAccessibility: Int,
    @SerializedName("datetime") val dateTime: String,
    @SerializedName("numLikes") var like: Int,
    @SerializedName("numDislikes") var dislike: Int,
    @SerializedName("score") var score: Int,
) : Serializable {
    fun average(): Float {
        var avgPaper = 0f
        if (ratingPaper) {
            avgPaper = 2f // 40%
        }
        return ((ratingClean * 0.2f) + avgPaper + (ratingStructure * 0.2f) + (ratingAccessibility * 0.2f))
    }
}