package pt.iade.ei.thinktoilet.models

import java.io.Serializable

data class Extra(
    val id: Int?,
    val confirm: Boolean
) : Serializable

object TypeExtra {
    const val ACCESSIBILITY = 1
    const val BABY_CHANGING_STATION = 2
}