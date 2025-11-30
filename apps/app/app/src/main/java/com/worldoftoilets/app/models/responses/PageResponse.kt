package com.worldoftoilets.app.models.responses

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import com.worldoftoilets.app.models.Page

@Serializable
data class PageResponse<T>(
    @SerialName("content") val content: List<T> = emptyList(),
    @SerialName("page") val page: Page? = null
)