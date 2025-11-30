package com.worldoftoilets.app.models.requests

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class UpdateUserRequest(
    @SerialName("name") val name: String?,
    @SerialName("icon") val icon: String?,
    @SerialName("birthDate") val birthDate: String?
)