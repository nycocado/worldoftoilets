package com.worldoftoilets.app.ui.components

import android.graphics.Color
import android.location.Location
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
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
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.toBitmap
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.google.gson.JsonPrimitive
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.GeoBox
import com.worldoftoilets.app.models.Toilet
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.maplibre.android.MapLibre
import org.maplibre.android.camera.CameraPosition
import org.maplibre.android.camera.CameraUpdateFactory
import org.maplibre.android.geometry.LatLng
import org.maplibre.android.geometry.LatLngBounds
import org.maplibre.android.maps.MapLibreMap
import org.maplibre.android.maps.MapView
import org.maplibre.android.plugins.annotation.Symbol
import org.maplibre.android.plugins.annotation.SymbolManager
import org.maplibre.android.plugins.annotation.SymbolOptions
import org.maplibre.android.style.layers.LineLayer
import org.maplibre.android.style.layers.PropertyFactory
import org.maplibre.android.style.sources.GeoJsonSource
import org.maplibre.geojson.Feature
import org.maplibre.geojson.FeatureCollection
import org.maplibre.geojson.LineString
import org.maplibre.geojson.Point
import androidx.core.graphics.toColorInt

@Composable
fun MapLibreView(
    location: Location?,
    toilets: Map<String, Toilet>,
    toiletsBoundingBoxIds: List<String>,
    centerCameraTrigger: Int = 0,
    routePoints: List<List<Double>>? = null,
    destinationToiletId: String? = null,
    sheetPeekHeightPx: Int = 0,
    onRequestToiletsBoundingBox: (GeoBox) -> Unit,
    onClickMarker: (String) -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val scope = rememberCoroutineScope()
    val routeColor = MaterialTheme.colorScheme.primary.toArgb()

    remember {
        MapLibre.getInstance(context)
    }

    val isDarkTheme = isSystemInDarkTheme()

    val currentOnRequestToiletsBoundingBox by rememberUpdatedState(onRequestToiletsBoundingBox)
    val currentOnClickMarker by rememberUpdatedState(onClickMarker)

    var mapView: MapView? by remember { mutableStateOf(null) }
    var mapLibreMap: MapLibreMap? by remember { mutableStateOf(null) }
    var symbolManager: SymbolManager? by remember { mutableStateOf(null) }
    var userLocationSymbol: Symbol? by remember { mutableStateOf(null) }
    var hasCentered by remember { mutableStateOf(false) }
    var isStyleLoaded by remember { mutableStateOf(false) }

    val toiletSymbols = remember { mutableMapOf<String, Symbol>() }

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
            // Ensure the GLThread stops and resources are released in order
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

                        val styleUrl = if (isDarkTheme) {
                            "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                        } else {
                            "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                        }

                        map.setStyle(styleUrl) { style ->
                            isStyleLoaded = true // Signal that style is ready

                            // Setup Symbol Manager
                            val manager = SymbolManager(this, map, style)
                            manager.iconAllowOverlap = true
                            manager.textAllowOverlap = true
                            manager.addClickListener { symbol ->
                                if (symbol.iconImage == "user-icon") {
                                    true // Consume click on user location to prevent crash
                                } else {
                                    val toiletId = symbol.data?.asString
                                    if (toiletId != null) {
                                        currentOnClickMarker(toiletId)
                                        true
                                    } else {
                                        false
                                    }
                                }
                            }
                            symbolManager = manager

                            ContextCompat.getDrawable(context, R.drawable.pin)?.toBitmap()?.let {
                                style.addImage("pin-icon", it)
                            }
                            ContextCompat.getDrawable(context, R.drawable.pin_green)?.toBitmap()
                                ?.let {
                                    style.addImage("pin-icon-green", it)
                                }
                            ContextCompat.getDrawable(context, R.drawable.pin_yellow)?.toBitmap()
                                ?.let {
                                    style.addImage("pin-icon-yellow", it)
                                }
                            ContextCompat.getDrawable(context, R.drawable.pin_red)?.toBitmap()
                                ?.let {
                                    style.addImage("pin-icon-red", it)
                                }
                            ContextCompat.getDrawable(context, R.drawable.user_location_marker)
                                ?.toBitmap()?.let {
                                    style.addImage("user-icon", it)
                                }
                        }

                        var interactionTimer: Job? = null
                        map.addOnCameraIdleListener {
                            interactionTimer?.cancel()
                            interactionTimer = scope.launch {
                                delay(500)
                                val projection = map.projection
                                val bounds = projection.visibleRegion.latLngBounds

                                val geoBox = GeoBox(
                                    north = bounds.latitudeNorth,
                                    east = bounds.longitudeEast,
                                    south = bounds.latitudeSouth,
                                    west = bounds.longitudeWest
                                )
                                currentOnRequestToiletsBoundingBox(geoBox)
                            }
                        }
                    }
                }
            },
            update = {
            }
        )
    }

    // Handle User Location Update
    LaunchedEffect(location, symbolManager) {
        if (location != null && mapLibreMap != null && symbolManager != null) {
            // Center camera only once
            if (!hasCentered) {
                mapLibreMap?.moveCamera(
                    CameraUpdateFactory.newCameraPosition(
                        CameraPosition.Builder()
                            .target(LatLng(location.latitude, location.longitude))
                            .zoom(15.0)
                            .build()
                    )
                )
                hasCentered = true
            }

            // Update User Marker Position
            val latLng = LatLng(location.latitude, location.longitude)
            if (userLocationSymbol == null) {
                userLocationSymbol = symbolManager?.create(
                    SymbolOptions()
                        .withLatLng(latLng)
                        .withIconImage("user-icon")
                        .withIconSize(0.8f)
                )
            } else {
                userLocationSymbol?.let { symbol ->
                    symbol.latLng = latLng
                    symbolManager?.update(symbol)
                }
            }
        }
    }

    // Handle Manual Camera Center Trigger
    LaunchedEffect(centerCameraTrigger) {
        if (centerCameraTrigger > 0 && location != null && mapLibreMap != null) {
            mapLibreMap?.animateCamera(
                CameraUpdateFactory.newCameraPosition(
                    CameraPosition.Builder()
                        .target(LatLng(location.latitude, location.longitude))
                        .zoom(15.0)
                        .build()
                )
            )
        }
    }

    // Handle Toilets Update
    LaunchedEffect(toiletsBoundingBoxIds, symbolManager, routePoints, destinationToiletId) {
        if (symbolManager != null) {
            val isRouteActive = routePoints != null && routePoints.isNotEmpty()

            val idsToDisplay = if (isRouteActive && destinationToiletId != null) {
                setOf(destinationToiletId)
            } else {
                toiletsBoundingBoxIds.toSet()
            }

            val symbolsToRemove = toiletSymbols.filterKeys { !idsToDisplay.contains(it) }

            symbolsToRemove.forEach { (id, symbol) ->
                symbolManager?.delete(symbol)
                toiletSymbols.remove(id)
            }

            idsToDisplay.forEach { toiletId ->
                if (!toiletSymbols.containsKey(toiletId)) {
                    toilets[toiletId]?.let { toilet ->
                        val avgRating = toilet.getAverageRating()
                        val iconImage = when {
                            avgRating >= 4.0 -> "pin-icon-green"
                            avgRating >= 2.5 -> "pin-icon-yellow"
                            else -> "pin-icon-red"
                        }

                        val symbol = symbolManager?.create(
                            SymbolOptions()
                                .withLatLng(LatLng(toilet.latitude, toilet.longitude))
                                .withIconImage(iconImage)
                                .withIconSize(1.0f)
                                .withData(JsonPrimitive(toiletId))
                        )
                        if (symbol != null) {
                            toiletSymbols[toiletId] = symbol
                        }
                    }
                }
            }
        }
    }

    // Handle Route Drawing
    LaunchedEffect(routePoints, mapLibreMap, isStyleLoaded) {
        val map = mapLibreMap ?: return@LaunchedEffect
        if (!isStyleLoaded) return@LaunchedEffect

        map.getStyle { style ->
            val layerId = "route-layer"
            val sourceId = "route-source"

            // Always clean up old route first
            if (style.getLayer(layerId) != null) {
                style.removeLayer(layerId)
            }
            if (style.getSource(sourceId) != null) {
                style.removeSource(sourceId)
            }

            if (routePoints != null && routePoints.isNotEmpty()) {
                val points = routePoints.map { Point.fromLngLat(it[0], it[1]) }
                val lineString = LineString.fromLngLats(points)
                val feature = Feature.fromGeometry(lineString)
                val featureCollection = FeatureCollection.fromFeature(feature)

                val source = GeoJsonSource(sourceId, featureCollection)
                style.addSource(source)

                val lineLayer = LineLayer(layerId, sourceId).apply {
                    setProperties(
                        PropertyFactory.lineCap(org.maplibre.android.style.layers.Property.LINE_CAP_ROUND),
                        PropertyFactory.lineJoin(org.maplibre.android.style.layers.Property.LINE_JOIN_ROUND),
                        PropertyFactory.lineWidth(4f),
                        PropertyFactory.lineColor(routeColor)
                    )
                }
                style.addLayer(lineLayer)

                // Fit Camera to Route + User Location
                try {
                    val bounds = LatLngBounds.Builder()
                    points.forEach { bounds.include(LatLng(it.latitude(), it.longitude())) }
                    location?.let { bounds.include(LatLng(it.latitude, it.longitude)) }

                    // Smart padding: consider bottom sheet peek height + 16dp margin + top search bar + 16dp margin
                    val horizontalPadding =
                        (48 * context.resources.displayMetrics.density).toInt() // 48dp sides
                    val topPadding =
                        (72 * context.resources.displayMetrics.density).toInt() // 72dp for search bar + margin
                    val bottomPadding =
                        sheetPeekHeightPx + (72 * context.resources.displayMetrics.density).toInt() // peek height + 72dp margin

                    map.animateCamera(
                        CameraUpdateFactory.newLatLngBounds(
                            bounds.build(),
                            horizontalPadding, // Left
                            topPadding, // Top
                            horizontalPadding, // Right
                            bottomPadding  // Bottom (sheet peek + margin)
                        ),
                        1500
                    )
                } catch (e: Exception) {

                }
            }
        }
    }
}