package com.worldoftoilets.app.models

import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.core.net.toUri
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

@Serializable
data class Toilet(
    @SerialName("publicId") val publicId: String = "",
    @SerialName("name") val name: String = "",
    @SerialName("address") val address: String = "",
    @SerialName("city") val city: String = "",
    @SerialName("state") val state: String? = null,
    @SerialName("country") val country: String = "",
    @SerialName("countryCode") val countryCode: String = "",
    @SerialName("latitude") val latitude: Double = 0.0,
    @SerialName("longitude") val longitude: Double = 0.0,
    @SerialName("access") val access: Access = Access(),
    @SerialName("extras") val extras: List<TypeExtra> = emptyList(),
    @SerialName("photoUrl") val photoUrl: String? = null,
    @SerialName("placeId") val placeId: String? = null,
    @SerialName("rating") val rating: ToiletRating = ToiletRating()
) : java.io.Serializable {
    fun getAverageRating(): Double {
        return (rating.avgClean + rating.avgStructure + rating.avgAccessibility) / 3f
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
        return photoUrl?.replace("localhost", "10.0.2.2")?.toUri() ?: Uri.EMPTY
    }
}
