package pt.iade.ei.thinktoilet.models

import java.io.Serializable

class  BadgesPoints(
    val Id: Int,
    val Title: String,
    val Description: String,
    val Points: Int,
    val Level: Int,
) : Serializable

