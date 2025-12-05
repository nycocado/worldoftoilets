package com.worldoftoilets.app.models.responses

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class CsrfData(
    @SerialName("csrfToken") val csrfToken: String
)
