package pt.iade.ei.thinktoilet.models

import java.io.Serializable

data class UserMain(
    val user: User,
    var email: String,
    var password: String
): Serializable
