package com.worldoftoilets.app.models.responses

import com.google.gson.annotations.SerializedName
import com.worldoftoilets.app.models.User

data class LoginResponse(
    @SerializedName("accessToken") val accessToken: String,
    @SerializedName("refreshToken") val refreshToken: String,
    @SerializedName("user") val user: User
)
