package pt.iade.ei.thinktoilet.models

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class Extra(
    @SerializedName("id") val id: Int?,
) : Serializable

object TypeExtra {
    const val ACCESSIBILITY = 1
    const val BABY_CHANGING_STATION = 2
}