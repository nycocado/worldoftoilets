package com.worldoftoilets.app.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.BottomSheetScaffold
import androidx.compose.material3.DockedSearchBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SearchBarDefaults
import androidx.compose.material3.SheetValue
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberBottomSheetScaffoldState
import androidx.compose.material3.rememberStandardBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
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
import com.worldoftoilets.app.ui.components.CustomDragHandle
import com.worldoftoilets.app.ui.components.MapLibreView
import com.worldoftoilets.app.ui.navegation.BottomSheetNavigationGraph
import com.worldoftoilets.app.ui.navegation.AppDestinations
import com.worldoftoilets.app.ui.util.NoRippleInteractionSource
import com.worldoftoilets.app.viewmodel.LocalViewModel
import com.worldoftoilets.app.viewmodel.UserViewModel
import kotlinx.coroutines.launch
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut

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
    val currentDestination = navController.currentBackStackEntryAsState().value?.destination

    val isDetails = currentDestination?.hasRoute(AppDestinations.ToiletDetails::class) == true
    val isList = currentDestination?.hasRoute(AppDestinations.ToiletList::class) == true

    val scaffoldState = rememberBottomSheetScaffoldState(
        bottomSheetState = rememberStandardBottomSheetState(
            initialValue = if (isDetails) SheetValue.Expanded else SheetValue.PartiallyExpanded,
            confirmValueChange = {
                it == SheetValue.Expanded || it == SheetValue.PartiallyExpanded
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

    LaunchedEffect(Unit, location) {
        scope.launch { localViewModel.loadLocation() }
    }

    LaunchedEffect(selectedToiletId) {
        if (selectedToiletId != null) {
            navController.navigate(AppDestinations.ToiletDetails(selectedToiletId)) {
                launchSingleTop = true
            }
            scope.launch {
                scaffoldState.bottomSheetState.expand() // Expande o sheet ao navegar para detalhes
            }
        }
    }

    // Lógica de expansão/recolhimento do sheet baseada na rota de detalhes
    LaunchedEffect(isDetails, isList) {
        if (isDetails && scaffoldState.bottomSheetState.currentValue != SheetValue.Expanded) {
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
    val isSheetExpanded = scaffoldState.bottomSheetState.currentValue == SheetValue.Expanded ||
            scaffoldState.bottomSheetState.targetValue == SheetValue.Expanded

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

    Box(modifier = Modifier.fillMaxSize()) {
        MapLibreView(
            location = location,
            toilets = toilets,
            toiletsBoundingBoxIds = toiletsBoundingBoxIds,
            bottomControlsPadding = sheetPeekHeight,
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

        DockedSearchBar(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .padding(top = 16.dp)
                .zIndex(1f),
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
                                    contentDescription = "Back"
                                )
                            }
                        } else {
                            Icon(Icons.Default.Search, contentDescription = null)
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
            sheetContent = {
                Box(
                    modifier = Modifier.fillMaxHeight(0.99f)
                ) {
                    BottomSheetNavigationGraph(
                        navController,
                        rootNavController,
                        localViewModel,
                        userViewModel
                    )
                }
            },
            content = {
            },
        )
    }
}