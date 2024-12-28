package pt.iade.ei.thinktoilet.models

import com.google.gson.annotations.SerializedName

data class SearchToilet(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String
)
