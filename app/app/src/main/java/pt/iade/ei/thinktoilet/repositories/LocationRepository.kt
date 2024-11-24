package pt.iade.ei.thinktoilet.repositories

import android.annotation.SuppressLint
import android.content.Context
import android.location.Location
import androidx.lifecycle.MutableLiveData
import com.google.android.gms.location.LocationServices
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject

class LocationRepository @Inject constructor(@ApplicationContext context: Context) {
    private val fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)

    @SuppressLint("MissingPermission")
    fun getCurrentLocation(): MutableLiveData<Location?> {
        val locationData = MutableLiveData<Location?>()

        fusedLocationClient.lastLocation
            .addOnSuccessListener { location ->
                location?.let {
                    locationData.postValue(it)
                }
            }
            .addOnFailureListener {
                locationData.postValue(null)
            }

        return locationData
    }
}