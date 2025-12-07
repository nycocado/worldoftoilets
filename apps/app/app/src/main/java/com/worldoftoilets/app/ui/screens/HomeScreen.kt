package com.worldoftoilets.app.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.DirectionsRun
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.rounded.MyLocation
import androidx.compose.material3.BottomSheetScaffold
import androidx.compose.material3.DockedSearchBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SearchBarDefaults
import androidx.compose.material3.SheetValue
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberBottomSheetScaffoldState
import androidx.compose.material3.rememberStandardBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.unit.dp
import androidx.compose.ui.zIndex
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import androidx.navigation.NavDestination.Companion.hasRoute
import androidx.navigation.NavHostController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.UiState
import com.worldoftoilets.app.models.responses.RouteResponse
import com.worldoftoilets.app.ui.components.CustomDragHandle
import com.worldoftoilets.app.ui.components.FilterDialog
import com.worldoftoilets.app.ui.components.FilterFloatingButton
import com.worldoftoilets.app.ui.components.MapLibreView
import com.worldoftoilets.app.ui.navegation.AppDestinations
import com.worldoftoilets.app.ui.navegation.BottomSheetNavigationGraph
import com.worldoftoilets.app.ui.util.NoRippleInteractionSource
import com.worldoftoilets.app.viewmodel.LocalViewModel
import com.worldoftoilets.app.viewmodel.UserViewModel
import kotlinx.coroutines.launch

import androidx.navigation.toRoute

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    rootNavController: NavController,
    localViewModel: LocalViewModel,
    userViewModel: UserViewModel,
    selectedToiletId: String? = null,
    navController: NavHostController = rememberNavController()
) {
    val context = LocalContext.current
    val focusManager = LocalFocusManager.current
    val scope = rememberCoroutineScope()
    val density = LocalDensity.current
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    val isDetails = currentDestination?.hasRoute(AppDestinations.ToiletDetails::class) == true
    val isList = currentDestination?.hasRoute(AppDestinations.ToiletList::class) == true
    val isRoute = currentDestination?.hasRoute(AppDestinations.Route::class) == true

    val activeRouteToiletId = if (isRoute) {
        try {
            navBackStackEntry?.toRoute<AppDestinations.Route>()?.toiletId
        } catch (e: Exception) {
            null
        }
    } else null

    val routeState by localViewModel.routeState.collectAsStateWithLifecycle()
    val isRouteActive = isRoute && routeState is UiState.Success

    val bottomSheetLazyListState = rememberLazyListState()
    val snackbarHostState = remember { SnackbarHostState() }

    val scaffoldState = rememberBottomSheetScaffoldState(
        bottomSheetState = rememberStandardBottomSheetState(
            initialValue = if (isDetails) SheetValue.Expanded else SheetValue.PartiallyExpanded,
            confirmValueChange = {
                if (isRouteActive) {
                    it == SheetValue.PartiallyExpanded
                } else if (isDetails) {
                    it == SheetValue.Expanded
                } else {
                    it == SheetValue.Expanded || it == SheetValue.PartiallyExpanded
                }
            }
        )
    )

    var query by remember { mutableStateOf("") }
    var isSearching by remember { mutableStateOf(false) }
    val toiletsSearch by localViewModel.toiletsSearch.collectAsStateWithLifecycle()

    val isLoggedIn by userViewModel.isLoggedIn.collectAsStateWithLifecycle()
    val toilets by localViewModel.toiletsCache.collectAsStateWithLifecycle()
    val toiletsBoundingBoxIds by localViewModel.toiletsBoundingBoxIds.collectAsStateWithLifecycle()

    val location by localViewModel.location.collectAsStateWithLifecycle()

    BackHandler(enabled = isSearching) {
        isSearching = false
        focusManager.clearFocus()
    }

    var centerCameraTrigger by remember { mutableIntStateOf(0) }

    LaunchedEffect(Unit, location) {
        scope.launch { localViewModel.loadLocation() }
    }

    LaunchedEffect(selectedToiletId) {
        if (selectedToiletId != null) {
            navController.navigate(AppDestinations.ToiletDetails(selectedToiletId)) {
                launchSingleTop = true
            }
        }
    }

    // Centralizar camera no usuario quando sair da rota
    var wasInRoute by remember { mutableStateOf(isRoute) }
    LaunchedEffect(isRoute) {
        if (wasInRoute && !isRoute) {
            // Saiu da rota, centralizar no usuario
            centerCameraTrigger++
        }
        wasInRoute = isRoute
    }

    // Lógica de expansão/recolhimento do sheet baseada na rota
    LaunchedEffect(isDetails, isList, isRouteActive) {
        if (isRouteActive) {
            scope.launch { scaffoldState.bottomSheetState.partialExpand() }
        } else if (isDetails && scaffoldState.bottomSheetState.currentValue != SheetValue.Expanded) {
            scope.launch { scaffoldState.bottomSheetState.expand() }
        } else if (isList && scaffoldState.bottomSheetState.currentValue != SheetValue.PartiallyExpanded) {
            scope.launch { scaffoldState.bottomSheetState.partialExpand() }
        }
    }

    LaunchedEffect(scaffoldState.bottomSheetState.currentValue) {
        if (isSearching) {
            isSearching = false
            focusManager.clearFocus()
        }
    }

    val toggleSheetState: () -> Unit = {
        scope.launch {
            if (scaffoldState.bottomSheetState.currentValue == SheetValue.Expanded) {
                scaffoldState.bottomSheetState.partialExpand()
            } else {
                scaffoldState.bottomSheetState.expand()
            }
        }
    }

    val sheetPeekHeight = 140.dp
    val sheetPeekHeightPx = with(density) { sheetPeekHeight.toPx().toInt() }
    val isSheetExpanded = scaffoldState.bottomSheetState.currentValue == SheetValue.Expanded ||
            scaffoldState.bottomSheetState.targetValue == SheetValue.Expanded

    val isFilterButtonVisible = !isSearching
    val isSearchBarVisible = !isDetails && !isRoute
    val isRouteInfoVisible = isRouteActive && !isSearching

    // BackHandler Logic
    BackHandler(enabled = isSearching || isSheetExpanded) {
        if (isSearching) {
            isSearching = false
            focusManager.clearFocus()
        } else if (isSheetExpanded) {
            scope.launch {
                scaffoldState.bottomSheetState.partialExpand()
            }
        }
    }

    val currentFilter by localViewModel.toiletFilter.collectAsStateWithLifecycle()
    var showFilterDialog by remember { mutableStateOf(false) }

    // Centralized error handling
    val error by localViewModel.error.collectAsStateWithLifecycle()
    LaunchedEffect(error) {
        if (error.isNotEmpty()) {
            scope.launch {
                snackbarHostState.showSnackbar(error)
                localViewModel.clearError()
            }
        }
    }

    if (showFilterDialog) {
        FilterDialog(
            currentFilter = currentFilter,
            onDismiss = { showFilterDialog = false },
            onApply = { filter ->
                localViewModel.updateFilter(filter)
                showFilterDialog = false
            }
        )
    }

    Box(modifier = Modifier.fillMaxSize()) {
        MapLibreView(
            location = location,
            toilets = toilets,
            toiletsBoundingBoxIds = toiletsBoundingBoxIds,
            centerCameraTrigger = centerCameraTrigger,
            routePoints = if (routeState is UiState.Success) (routeState as UiState.Success<RouteResponse>).data.path else null,
            destinationToiletId = activeRouteToiletId,
            sheetPeekHeightPx = sheetPeekHeightPx,
            onRequestToiletsBoundingBox = { geoBox ->
                localViewModel.loadToiletsBoundingBox(
                    geoBox.south,
                    geoBox.west,
                    geoBox.north,
                    geoBox.east
                )
            },
            onClickMarker = { toiletId ->
                if (isLoggedIn == true) {
                    navController.navigate(AppDestinations.ToiletDetails(toiletId)) {
                        launchSingleTop = true
                    }
                } else {
                    rootNavController.navigate(AppDestinations.Login)
                }
            }
        )

        // Map Controls (Location & Filter)
        AnimatedVisibility(
            visible = isFilterButtonVisible,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(bottom = sheetPeekHeight + 16.dp, end = 16.dp)
                .zIndex(1f)
        ) {
            Column(
                verticalArrangement = Arrangement.spacedBy(16.dp),
                horizontalAlignment = Alignment.End
            ) {
                FloatingActionButton(
                    onClick = { centerCameraTrigger++ },
                    containerColor = MaterialTheme.colorScheme.surfaceContainerLow,
                    contentColor = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(56.dp)
                ) {
                    Icon(
                        imageVector = Icons.Rounded.MyLocation,
                        contentDescription = context.getString(R.string.my_location),
                        modifier = Modifier.size(24.dp)
                    )
                }

                FilterFloatingButton(
                    currentFilter = currentFilter,
                    onClick = { showFilterDialog = true }
                )
            }
        }

        // Route Info Chips
        AnimatedVisibility(
            visible = isRouteInfoVisible,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(bottom = sheetPeekHeight + 16.dp, start = 16.dp)
                .zIndex(1f)
        ) {
            val state = routeState
            if (state is UiState.Success) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    RouteInfoChip(
                        icon = Icons.AutoMirrored.Filled.DirectionsRun,
                        text = formatTime(state.data.stats.timeSeconds)
                    )
                    RouteInfoChip(
                        icon = Icons.Default.LocationOn,
                        text = formatDistance(state.data.stats.distanceMeters)
                    )
                }
            }
        }

        // Search Scrim (Covers Map, behind SearchBar)
        AnimatedVisibility(
            visible = isSearching,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier.zIndex(0.5f)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.3f))
                    .clickable {
                        isSearching = false
                        focusManager.clearFocus()
                    }
            )
        }

        AnimatedVisibility(
            visible = isSearchBarVisible,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier.zIndex(1f)
        ) {
            DockedSearchBar(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .padding(top = 16.dp),
                inputField = {
                SearchBarDefaults.InputField(
                    query = query,
                    onQueryChange = {
                        query = it
                        localViewModel.searchToilets(it)
                    },
                    onSearch = {
                        focusManager.clearFocus()
                    },
                    expanded = isSearching,
                    onExpandedChange = { isSearching = it },
                    placeholder = {
                        Text(context.getString(R.string.search))
                    },
                    leadingIcon = {
                        if (isSearching) {
                            IconButton(onClick = {
                                isSearching = false
                                focusManager.clearFocus()
                            }) {
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                    contentDescription = context.getString(R.string.content_description_back_button)
                                )
                            }
                        } else {
                            Icon(
                                Icons.Default.Search,
                                contentDescription = context.getString(R.string.image_description_null)
                            )
                        }
                    },
                    trailingIcon = {
                        if (query.isNotEmpty()) {
                            IconButton(onClick = { query = "" }) {
                                Icon(
                                    Icons.Default.Clear,
                                    contentDescription = context.getString(R.string.clear_search)
                                )
                            }
                        }
                    },
                )
            },
            expanded = isSearching,
            onExpandedChange = { isSearching = it },
            shadowElevation = 4.dp
        ) {
            LazyColumn {
                itemsIndexed(toiletsSearch) { index, toilet ->
                    if (index != 0) {
                        HorizontalDivider(
                            thickness = 1.dp,
                            color = MaterialTheme.colorScheme.outlineVariant
                        )
                    }
                    Surface(
                        onClick = {
                            isSearching = false
                            focusManager.clearFocus()
                            if (isLoggedIn == true) {
                                navController.navigate(
                                    AppDestinations.ToiletDetails(
                                        toilet.publicId
                                    )
                                ) {
                                    launchSingleTop = true
                                }
                            } else {
                                rootNavController.navigate(AppDestinations.Login)
                            }
                        },
                        interactionSource = remember { NoRippleInteractionSource() },
                        modifier = Modifier
                            .fillMaxWidth(),
                        color = Color.Transparent
                    ) {
                        Text(
                            modifier = Modifier
                                .padding(horizontal = 16.dp, vertical = 8.dp),
                            text = toilet.name,
                            style = MaterialTheme.typography.bodyLarge,
                        )
                    }
                }
            }
        }
        }

        // Sheet Scrim (Covers SearchBar and Map, behind BottomSheet)
        AnimatedVisibility(
            visible = isSheetExpanded,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier.zIndex(1.5f)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.3f))
                    .clickable {
                        scope.launch {
                            scaffoldState.bottomSheetState.partialExpand()
                        }
                    }
            )
        }

        BottomSheetScaffold(
            modifier = Modifier
                .zIndex(2f),
            scaffoldState = scaffoldState,
            sheetPeekHeight = sheetPeekHeight,
            sheetShadowElevation = 8.dp,
            sheetContainerColor = MaterialTheme.colorScheme.surfaceContainerLow,
            containerColor = Color.Transparent,
            contentColor = Color.Transparent,
            sheetDragHandle = {
                CustomDragHandle {
                    toggleSheetState()
                }
            },
            sheetSwipeEnabled = !isDetails && !isRouteActive,
            snackbarHost = {
                SnackbarHost(
                    hostState = snackbarHostState,
                    modifier = Modifier.padding(bottom = if (scaffoldState.bottomSheetState.currentValue == SheetValue.PartiallyExpanded) sheetPeekHeight else 0.dp)
                )
            },
            sheetContent = {
                Box(
                    modifier = Modifier.fillMaxHeight(0.99f)
                ) {
                    BottomSheetNavigationGraph(
                        navController,
                        rootNavController,
                        localViewModel,
                        userViewModel,
                        lazyListState = bottomSheetLazyListState,
                        isExpanded = isSheetExpanded
                    )
                }
            },
            content = {
            },
        )
    }
}

@Composable
fun RouteInfoChip(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    text: String
) {
    Surface(
        shape = MaterialTheme.shapes.medium,
        color = MaterialTheme.colorScheme.surfaceContainerLow,
        contentColor = MaterialTheme.colorScheme.primary,
        shadowElevation = 4.dp
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(20.dp)
            )
            Text(
                text = text,
                style = MaterialTheme.typography.labelLarge,
                fontWeight = androidx.compose.ui.text.font.FontWeight.Bold
            )
        }
    }
}

fun formatTime(seconds: Double): String {
    val minutes = (seconds / 60).toInt()
    return if (minutes < 60) {
        "$minutes min"
    } else {
        val hours = minutes / 60
        val remainingMinutes = minutes % 60
        "${hours}h ${remainingMinutes}min"
    }
}

fun formatDistance(meters: Double): String {
    return if (meters < 1000) {
        "${meters.toInt()} m"
    } else {
        String.format("%.1f km", meters / 1000)
    }
}
