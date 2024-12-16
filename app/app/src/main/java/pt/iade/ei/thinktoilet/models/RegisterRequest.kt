package pt.iade.ei.thinktoilet.models

import com.google.gson.annotations.SerializedName
import java.time.LocalDate

data class RegisterRequest(
    @SerializedName("name") val name: String,
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String,
    @SerializedName("iconId") val iconId: String?,
    @SerializedName("birthDate") val birthDate: String?
)
