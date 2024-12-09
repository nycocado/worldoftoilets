package pt.iade.ei.thinktoilet.models

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class Rating(
    @SerializedName("avgClean") var clean: Float,
    @SerializedName("ratioPaper") var paper: Float,
    @SerializedName("avgStructure") var structure: Float,
    @SerializedName("avgAccessibility") var accessibility: Float
) : Serializable {
    fun average(): Float {
        return ((clean * 0.2f) + ((paper / 20) * 0.4f) + (structure * 0.2f) + accessibility * 0.2f)
    }
}
