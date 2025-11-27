package com.worldoftoilets.app.models.requests

import com.google.gson.annotations.SerializedName

data class RegisterRequest(
    @SerializedName("name") val name: String,
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String,
    @SerializedName("icon") val icon: String?,
    @SerializedName("birthDate") val birthDate: String
)
