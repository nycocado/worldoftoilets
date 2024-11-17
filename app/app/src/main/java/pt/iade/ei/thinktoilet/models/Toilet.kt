package pt.iade.ei.thinktoilet.models

import java.io.Serializable

data class Toilet(
    var id: Int?,
    val name: String,
    val address: String,
    var ratingCategory: RatingCategory,
    val extras: List<Extra>,
    val position: Position,
    var numComments: Int,
    val googlePlaceId: String,
    var comments: List<Comment>,
    val distance: Double,
    val image: String
) : Serializable {
    fun getAverageRating(): Float {
        return ratingCategory.average()
    }
}
