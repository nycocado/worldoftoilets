package pt.iade.ei.thinktoilet.models

import androidx.lifecycle.LiveData
import com.google.gson.annotations.SerializedName
import java.io.Serializable
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

data class Toilet(
    @SerializedName("id") var id: Int?,
    @SerializedName("name") val name: String,
    @SerializedName("address") val address: String,
    @SerializedName("rating") var rating: Rating,
    @SerializedName("extras") val extras: List<Extra>,
    @SerializedName("latitude") val latitude: Double,
    @SerializedName("longitude") val longitude: Double,
    @SerializedName("numComments") var numComments: Int,
    @SerializedName("placeId") val placeId: String? = null,
    @SerializedName("comments") var comments: List<Comment> = emptyList(),
    @SerializedName("image") val image: String? = null
) : Serializable {
    fun getAverageRating(): Float {
        return rating.average()
    }

    fun distanceTo(lat: Double, lon: Double): Double {
        val earthRadius = 6371.0
        val dLat = Math.toRadians(lat - latitude)
        val dLon = Math.toRadians(lon - longitude)
        val a = sin(dLat / 2) * sin(dLat / 2) +
                cos(Math.toRadians(lat)) * cos(Math.toRadians(latitude)) *
                sin(dLon / 2) * sin(dLon / 2)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return earthRadius * c
    }

    fun distanceToString(lat: Double, lon: Double): String {
        val distance = distanceTo(lat, lon)
        return if (distance < 1) {
            "${(distance * 1000).toInt()} m"
        } else {
            "${distance.toInt()} km"
        }
    }
}
