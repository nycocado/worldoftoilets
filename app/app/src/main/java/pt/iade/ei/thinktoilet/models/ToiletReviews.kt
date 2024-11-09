package pt.iade.ei.thinktoilet.models

import java.time.LocalDateTime

class ToiletReviews(
    val toilet: Toilet,
    val user: UserForeigner,
    var comments: String,
    var ratingCategory: RatingCategory,
    var datetime: LocalDateTime,
)