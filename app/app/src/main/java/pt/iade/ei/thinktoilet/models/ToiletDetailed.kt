package pt.iade.ei.thinktoilet.models

import java.io.Serializable

data class ToiletDetailed(
    val toilet: Toilet,
    var comments: List<Comment>,
    val distance: Double
) : Serializable
