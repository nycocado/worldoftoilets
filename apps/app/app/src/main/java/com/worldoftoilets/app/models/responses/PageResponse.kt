package com.worldoftoilets.app.models.responses

import com.google.gson.annotations.SerializedName
import com.worldoftoilets.app.models.Page

data class PageResponse<T>(
    @SerializedName("content") val content: List<T>,
    @SerializedName("page") val page: Page
)