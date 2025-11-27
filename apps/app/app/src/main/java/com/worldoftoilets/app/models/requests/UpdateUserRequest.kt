package com.worldoftoilets.app.models.requests

import com.google.gson.annotations.SerializedName

data class UpdateUserRequest(
    @SerializedName("name") val name: String?,
    @SerializedName("icon") val icon: String?,
    @SerializedName("birthDate") val birthDate: String?
)
