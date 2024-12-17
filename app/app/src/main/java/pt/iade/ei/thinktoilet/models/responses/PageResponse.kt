package pt.iade.ei.thinktoilet.models.responses

import com.google.gson.annotations.SerializedName
import pt.iade.ei.thinktoilet.models.Page

data class PageResponse<T>(
    @SerializedName("content") val content: List<T>,
    @SerializedName("page") val page: Page
)