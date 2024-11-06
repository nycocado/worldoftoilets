package pt.iade.ei.thinktoilet.models

import java.io.Serializable

data class Position(
    var latitude: Double,
    var longitude: Double
) : Serializable

fun distanceToString(distance: Double): String {
    return if (distance < 1000) {
        "${distance.toInt()}m"
    } else {
        "${(distance / 1000).toInt()}km"
    }
}