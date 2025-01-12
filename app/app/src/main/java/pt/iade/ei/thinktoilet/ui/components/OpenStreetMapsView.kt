package pt.iade.ei.thinktoilet.ui.components

import android.annotation.SuppressLint
import android.location.Location
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import org.osmdroid.events.MapListener
import org.osmdroid.events.ScrollEvent
import org.osmdroid.events.ZoomEvent
import org.osmdroid.tileprovider.tilesource.XYTileSource
import org.osmdroid.util.BoundingBox
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.Toilet

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

@SuppressLint("UseCompatLoadingForDrawables")
@Composable
fun OpenStreetMapsView(
    locationStateFlow: StateFlow<Location>,
    toiletsStateFlow: StateFlow<Map<Int, Toilet>>,
    toiletsBoundingBoxIdsStateFlow: StateFlow<List<Int>>,
    onRequestToiletsBoundingBox: (BoundingBox) -> Unit,
    onClickMarker: (Int) -> Unit
) {
    val scope = rememberCoroutineScope()
    val toilets = toiletsStateFlow.collectAsState().value
    val toiletsBoundingBoxIds = toiletsBoundingBoxIdsStateFlow.collectAsState().value
    val location = locationStateFlow.collectAsState().value
    val isDarkTheme = isSystemInDarkTheme()

    var mapView: MapView? by remember { mutableStateOf(null) }
    var interactionTimer: Job? by remember { mutableStateOf(null) }
    val iconSize = 52.dp

    Box(modifier = Modifier.fillMaxSize()) {
        AndroidView(
            modifier = Modifier.fillMaxSize(),
            factory = { context ->
                MapView(context).apply {
                    tileProvider.tileSource = when (isDarkTheme) {
                        true -> cartoDarkTileSource
                        false -> cartoLightTileSource
                    }
                    controller.setZoom(19.0)
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
                map.addMapListener(
                    object : MapListener {
                        override fun onScroll(event: ScrollEvent?): Boolean {
                            handleMapChange()
                            return true
                        }

                        override fun onZoom(event: ZoomEvent?): Boolean {
                            handleMapChange()
                            return true
                        }

                        private fun handleMapChange() {
                            interactionTimer?.cancel()
                            interactionTimer = scope.launch {
                                delay(500)
                                val boundingBox = mapView?.boundingBox
                                if (boundingBox != null) {
                                    onRequestToiletsBoundingBox(boundingBox)
                                }
                            }
                        }
                    }
                )
            }
        )
        IconButton(
            onClick = {
                scope.launch {
                    mapView?.controller?.animateTo(
                        GeoPoint(location.latitude, location.longitude),
                        19.0,
                        1000
                    )
                }
            },
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(16.dp)
                .padding(bottom = 140.dp)
                .size(iconSize),
            colors = IconButtonDefaults.iconButtonColors(
                containerColor = MaterialTheme.colorScheme.surfaceContainerLow,
                contentColor = MaterialTheme.colorScheme.primary
            )
        ) {
            Icon(
                painter = painterResource(id = R.drawable.my_location_24px),
                contentDescription = "My Location",
                modifier = Modifier.size(iconSize * 0.75f)
            )
        }
    }

    LaunchedEffect(location) {
        mapView?.let { map ->
            map.controller?.setCenter(GeoPoint(location.latitude, location.longitude))
        }
    }

    LaunchedEffect(toiletsBoundingBoxIds) {
        mapView?.let { map ->
            map.overlays.clear()
            toiletsBoundingBoxIds.forEach { toiletId ->
                toilets[toiletId]?.let { toilet ->
                    Marker(map).apply {
                        position = GeoPoint(toilet.latitude, toilet.longitude)
                        title = toilet.id.toString()
                        icon = map.context.getDrawable(R.drawable.pin)
                        setOnMarkerClickListener { marker, _ ->
                            onClickMarker(marker.title.toInt())
                            false
                        }
                        map.overlays.add(this)
                    }
                }
            }
            map.invalidate()
        }
    }
}