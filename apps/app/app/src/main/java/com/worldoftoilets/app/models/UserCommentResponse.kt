package com.worldoftoilets.app.models

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.res.painterResource
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import com.worldoftoilets.app.R

@Serializable
data class UserCommentResponse(
    @SerialName("publicId") val publicId: String = "",
    @SerialName("name") val name: String = "",
    @SerialName("icon") val icon: String = "icon-default",
    @SerialName("commentsCount") val commentsCount: Int = 0,
    @SerialName("points") val points: Int = 0,
    @SerialName("isPartner") val isPartner: Boolean = false
) : java.io.Serializable {
    @Composable
    fun getIcon(): Painter {
        return when (icon) {
            "icon-1" -> painterResource(R.drawable.icon1)
            "icon-2" -> painterResource(R.drawable.icon2)
            "icon-3" -> painterResource(R.drawable.icon3)
            "icon-4" -> painterResource(R.drawable.icon4)
            "icon-5" -> painterResource(R.drawable.icon5)
            "icon-6" -> painterResource(R.drawable.icon6)
            "icon-default" -> painterResource(R.drawable.icon1)
            else -> painterResource(R.drawable.icon1)
        }
    }
}
