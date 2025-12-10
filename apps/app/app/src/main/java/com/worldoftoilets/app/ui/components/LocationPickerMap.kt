package com.worldoftoilets.app.ui.components

import android.location.Location
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.worldoftoilets.app.R
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.maplibre.android.MapLibre
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.camera.CameraUpdateFactory
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.MapView

import androidx.compose.foundation.Image
import androidx.compose.ui.graphics.asImageBitmap
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.toBitmap

@Composable
fun LocationPickerMap(
    initialLocation: Location?,
    onLocationSelected: (Double, Double) -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val scope = rememberCoroutineScope()

    remember {
        MapLibre.getInstance(context)
    }

    val isDarkTheme = isSystemInDarkTheme()
    val currentOnLocationSelected by rememberUpdatedState(onLocationSelected)

    var mapView: MapView? by remember { mutableStateOf(null) }
    var mapLibreMap: MapLibreMap? by remember { mutableStateOf(null) }
    var hasCentered by remember { mutableStateOf(false) }

    val pinBitmap = remember {
        ContextCompat.getDrawable(context, R.drawable.pin)?.toBitmap()?.asImageBitmap()
    }

    // Manage MapView Lifecycle
    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_START -> mapView?.onStart()
                Lifecycle.Event.ON_RESUME -> mapView?.onResume()
                Lifecycle.Event.ON_PAUSE -> mapView?.onPause()
                Lifecycle.Event.ON_STOP -> mapView?.onStop()
                Lifecycle.Event.ON_DESTROY -> {
                    // onDestroy is called in onDispose
                }
                else -> {}
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
            mapView?.onPause()
            mapView?.onStop()
            mapView?.onDestroy()
            mapView = null
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        AndroidView(
            modifier = Modifier.fillMaxSize(),
            factory = { ctx ->
                MapView(ctx).apply {
                    mapView = this
                    this.onCreate(null)

                    this.getMapAsync { map ->
                        mapLibreMap = map
                        map.uiSettings.isRotateGesturesEnabled = false
                        map.uiSettings.isLogoEnabled = false
                        map.uiSettings.isAttributionEnabled = false

                        val styleUrl = if (isDarkTheme) {
                            "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                        } else {
                            "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                        }

                        map.setStyle(styleUrl)

                        var interactionTimer: Job? = null
                        map.addOnCameraIdleListener {
                            interactionTimer?.cancel()
                            interactionTimer = scope.launch {
                                delay(300) // Debounce
                                val target = map.cameraPosition.target
                                if (target != null) {
                                    currentOnLocationSelected(target.latitude, target.longitude)
                                }
                            }
                        }
                    }
                }
            }
        )

        // Center Pin
        if (pinBitmap != null) {
            Image(
                bitmap = pinBitmap,
                contentDescription = null,
                modifier = Modifier
                    .size(64.dp)
                    .align(Alignment.Center)
                    .padding(bottom = 24.dp) // Adjust so the bottom of the pin is at the center
            )
        }
    }

    // Handle Initial Location
    LaunchedEffect(initialLocation, mapLibreMap) {
        if (initialLocation != null && mapLibreMap != null && !hasCentered) {
            mapLibreMap?.moveCamera(
                CameraUpdateFactory.newCameraPosition(
                    CameraPosition.Builder()
                        .target(LatLng(initialLocation.latitude, initialLocation.longitude))
                        .zoom(16.0)
                        .build()
                )
            )
            hasCentered = true
        }
    }
}