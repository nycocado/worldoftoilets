package pt.iade.ei.thinktoilet.models

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.res.painterResource
import com.google.gson.annotations.SerializedName
import pt.iade.ei.thinktoilet.R
import java.io.Serializable

data class User(
    @SerializedName("id") var id: Int?,
    @SerializedName("name") val name: String,
    @SerializedName("email") var email: String? = null,
    @SerializedName("iconId") val iconId: String,
    @SerializedName("numComments") val numComments: Int,
    @SerializedName("points") val points: Int
): Serializable {
    @Composable
    fun getIcon(): Painter {
        return when (iconId) {
            "icon_1" -> painterResource(R.drawable.icon1)
            "icon_2" -> painterResource(R.drawable.icon2)
            "icon_3" -> painterResource(R.drawable.icon3)
            "icon_4" -> painterResource(R.drawable.icon4)
            "icon_5" -> painterResource(R.drawable.icon5)
            "icon_6" -> painterResource(R.drawable.icon6)
            else -> painterResource(R.drawable.icon_default)
        }
    }
}