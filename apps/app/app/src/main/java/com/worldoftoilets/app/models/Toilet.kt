package com.worldoftoilets.app.models

import android.net.Uri
import androidx.compose.runtime.Composable
import com.google.gson.annotations.SerializedName
import java.io.Serializable
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt
import androidx.core.net.toUri

data class Toilet(
    @SerializedName("publicId") val publicId: String,
    @SerializedName("name") val name: String,
    @SerializedName("address") val address: String,
    @SerializedName("city") val city: String,
    @SerializedName("state") val state: String?,
    @SerializedName("country") val country: String,
    @SerializedName("countryCode") val countryCode: String,
    @SerializedName("latitude") val latitude: Double,
    @SerializedName("longitude") val longitude: Double,
    @SerializedName("access") val access: Access,
    @SerializedName("extras") val extras: List<TypeExtra>,
    @SerializedName("photoUrl") val photoUrl: String?,
    @SerializedName("placeId") val placeId: String?,
    @SerializedName("rating") val rating: ToiletRating
) : Serializable {
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

data class Access(
    @SerializedName("name") val name: String,
    @SerializedName("apiName") val apiName: String
) : Serializable

data class TypeExtra(
    @SerializedName("name") val name: String,
    @SerializedName("apiName") val apiName: String
) : Serializable

data class ToiletRating(
    @SerializedName("totalRatings") val totalRatings: Int,
    @SerializedName("avgClean") val avgClean: Double,
    @SerializedName("avgStructure") val avgStructure: Double,
    @SerializedName("avgAccessibility") val avgAccessibility: Double,
    @SerializedName("paperAvailability") val paperAvailability: Double
) : Serializable
