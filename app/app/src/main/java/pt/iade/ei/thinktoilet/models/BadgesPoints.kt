package pt.iade.ei.thinktoilet.models

import java.io.Serializable

class  BadgesPoints(
    val id: Int,
    val title: String,
    val description: String,
    val points: Int,
    val level: Int,
) : Serializable

