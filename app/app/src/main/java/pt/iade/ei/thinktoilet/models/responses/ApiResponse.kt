package pt.iade.ei.thinktoilet.models.responses

import com.google.gson.annotations.SerializedName

data class ApiResponse(
    @SerializedName("status") val status: Int,
    @SerializedName("message") val message: String,
    @SerializedName("timestamp") val timestamp: String
)
