package pt.iade.ei.thinktoilet.models

import android.net.Uri
import androidx.compose.runtime.Composable
import com.google.gson.annotations.SerializedName
import pt.iade.ei.thinktoilet.BuildConfig
import pt.iade.ei.thinktoilet.models.enums.TypeExtra
import java.io.Serializable
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

data class Toilet(
    @SerializedName("id") var id: Int,
    @SerializedName("name") val name: String,
    @SerializedName("address") val address: String,
    @SerializedName("rating") var rating: Rating,
    @SerializedName("latitude") val latitude: Double,
    @SerializedName("longitude") val longitude: Double,
    @SerializedName("numComments") var numComments: Int,
    @SerializedName("placeId") val placeId: String? = null,
    @SerializedName("extras") val extras: List<TypeExtra>
) : Serializable {
    fun getAverageRating(): Float {
        return rating.average()
    }

    private fun distanceTo(lat: Double, lon: Double): Double {
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

    fun getMapsUrl(): String {
        val lat = latitude.toString().replace(",", ".")
        val lon = longitude.toString().replace(",", ".")
        if (placeId != null) {
            return "https://www.google.com/maps/search/?api=1&query=$lat,$lon&query_place_id=$placeId"
        }
        return "https://www.google.com/maps/search/?api=1&query=$lat,$lon"
    }

    @Composable
    fun getImageUrl(): Uri {
        val url = BuildConfig.API_URL + "toilets/${this.id}/image?API_KEY=" + BuildConfig.API_KEY
        return Uri.parse(url)
    }
}
