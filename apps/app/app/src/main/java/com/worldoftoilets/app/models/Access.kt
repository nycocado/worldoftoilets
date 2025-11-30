package com.worldoftoilets.app.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Access(
    @SerialName("name") val name: String = "",
    @SerialName("apiName") val apiName: String = ""
) : java.io.Serializable
