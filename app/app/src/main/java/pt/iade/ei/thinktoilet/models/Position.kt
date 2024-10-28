package pt.iade.ei.thinktoilet.models

import java.io.Serializable

data class Position(
    var latitude: Double,
    var longitude: Double,
) : Serializable