package pt.iade.ei.thinktoilet.models

import java.io.Serializable
import java.time.LocalDateTime

data class Comment(
    var id: Int?,
    var toiletId: Int,
    val userId: Int,
    val rate: Float,
    val text: String,
    val ratingCategory: RatingCategory,
    val date: LocalDateTime,
    val like: Int,
    val dislike: Int
) : Serializable