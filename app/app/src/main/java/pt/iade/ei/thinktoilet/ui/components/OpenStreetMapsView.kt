package pt.iade.ei.thinktoilet.ui.components

import android.annotation.SuppressLint
import android.location.Location
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import kotlinx.coroutines.flow.StateFlow
import org.osmdroid.tileprovider.tilesource.XYTileSource
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import pt.iade.ei.thinktoilet.R

private val cartoLightTileSource = XYTileSource(
    "Carto Light",
    0,
    20,
    256,
    ".png",
    arrayOf("https://basemaps.cartocdn.com/light_all/")
)

private val cartoDarkTileSource = XYTileSource(
    "Carto Dark",
    0,
    20,
    256,
    ".png",
    arrayOf("https://basemaps.cartocdn.com/dark_all/")
)

/**
 * Exibe um mapa utilizando a biblioteca OpenStreetMaps.
 *
 * @param locationStateFlow [StateFlow] que contém um [Location] com a localização atual do usuário.
 */
@SuppressLint("UseCompatLoadingForDrawables")
@Composable
fun OpenStreetMapsView(
    locationStateFlow: StateFlow<Location>,
) {
    val location = locationStateFlow.collectAsState().value
    val isDarkTheme = isSystemInDarkTheme()

    var mapView: MapView? by remember { mutableStateOf(null) }
    val userMarker = remember { mutableStateOf<Marker?>(null) }

    AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = { context ->
            MapView(context).apply {
                tileProvider.tileSource = if (isDarkTheme) {
                    cartoDarkTileSource
                } else {
                    cartoLightTileSource
                }
                controller.setZoom(18.0)
                controller.setCenter(GeoPoint(location.latitude, location.longitude))
                setMultiTouchControls(true)

                minZoomLevel = 3.0
                maxZoomLevel = 20.0

                setScrollableAreaLimitLatitude(85.051128, -85.051128, 0)
                setScrollableAreaLimitLongitude(-180.0, 180.0, 0)

                mapView = this
            }
        },
        update = { map ->
            map.controller.setCenter(GeoPoint(location.latitude, location.longitude))
        }
    )

    LaunchedEffect(location) {
        mapView?.let { map ->
            if (userMarker.value == null) {
                userMarker.value = Marker(map).apply {
                    icon = ContextCompat.getDrawable(map.context, R.drawable.thumb_up_24px)
                    map.overlays.add(this)
                }
            }
            userMarker.value?.position = GeoPoint(location.latitude, location.longitude)
            map.invalidate()
        }
    }
}