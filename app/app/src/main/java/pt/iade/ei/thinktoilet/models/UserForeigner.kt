package pt.iade.ei.thinktoilet.models

import java.io.Serializable

data class UserForeigner(
    var id: Int?,
    val name: String,
    val iconId: Int,
    val numComments: Int,
    val points: Int
): Serializable //! falta criar o sistema de pontos