package pt.iade.ei.thinktoilet.models

import java.io.Serializable

data class UserMain(
    var id: Int?,
    var name: String,
    var iconId: Int,
    var numComments: Int,
    var points: Int,
    var email: String,
    var password: String,
    var position: Position,
) : Serializable
