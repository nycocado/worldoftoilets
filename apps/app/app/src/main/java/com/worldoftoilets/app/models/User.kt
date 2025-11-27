package com.worldoftoilets.app.models

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.res.painterResource
import com.google.gson.annotations.SerializedName
import com.worldoftoilets.app.R
import java.io.Serializable

data class User(
    @SerializedName("publicId") val publicId: String,
    @SerializedName("name") val name: String,
    @SerializedName("icon") val icon: String,
    @SerializedName("email") val email: String?,
    @SerializedName("commentsCount") val commentsCount: Int,
    @SerializedName("points") val points: Int,
    @SerializedName("birthDate") val birthDate: String?,
    @SerializedName("isPartner") val isPartner: Boolean,
    @SerializedName("roles") val roles: List<Role>?,
    @SerializedName("createdAt") val createdAt: String
) : Serializable {
    @Composable
    fun getIcon(): Painter {
        return when (icon) {
            "icon-1" -> painterResource(R.drawable.icon1)
            "icon-2" -> painterResource(R.drawable.icon2)
            "icon-3" -> painterResource(R.drawable.icon3)
            "icon-4" -> painterResource(R.drawable.icon4)
            "icon-5" -> painterResource(R.drawable.icon5)
            "icon-6" -> painterResource(R.drawable.icon6)
            "icon-default" -> painterResource(R.drawable.icon_default)
            else -> painterResource(R.drawable.icon_default)
        }
    }
}

data class Role(
    @SerializedName("name") val name: String,
    @SerializedName("apiName") val apiName: String
) : Serializable