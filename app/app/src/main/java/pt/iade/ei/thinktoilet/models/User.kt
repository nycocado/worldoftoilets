package pt.iade.ei.thinktoilet.models

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class User(
    @SerializedName("id") var id: Int?,
    @SerializedName("name") val name: String,
    @SerializedName("email") var email: String? = null,
    @SerializedName("iconId") val iconId: String? = null,
    @SerializedName("numComments") val numComments: Int,
    @SerializedName("points") val points: Int
): Serializable