package pt.iade.ei.thinktoilet.models

import com.google.gson.annotations.SerializedName

data class Page(
    @SerializedName("size") val size: Int,
    @SerializedName("number") val number: Int,
    @SerializedName("totalElements") val totalElements: Int,
    @SerializedName("totalPages") val totalPages: Int
)