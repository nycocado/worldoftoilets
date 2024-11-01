package pt.iade.ei.thinktoilet.models

import java.io.Serializable
import java.time.LocalDateTime

data class Comment(
    var id: Int?,
    val userForeigner: UserForeigner,
    val text: String,
    val ratingCategory: RatingCategory,
    val datetime: LocalDateTime,
) : Serializable