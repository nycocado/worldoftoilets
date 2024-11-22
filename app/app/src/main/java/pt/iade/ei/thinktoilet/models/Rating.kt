package pt.iade.ei.thinktoilet.models

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class Rating(
    @SerializedName("clean") var clean: Float,
    @SerializedName("paper") var paper: Float,
    @SerializedName("structure") var structure: Float,
    @SerializedName("accessibility") var accessibility: Float
) : Serializable {
    fun average(): Float {
        return (clean + paper + structure + accessibility) / 4
    }
}
