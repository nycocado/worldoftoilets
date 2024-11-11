package pt.iade.ei.thinktoilet.models

import java.io.Serializable

data class User(
    var id: Int?,
    val name: String,
    val iconId: Int,
    val numComments: Int,
    val points: Int
): Serializable