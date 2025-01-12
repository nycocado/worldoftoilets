package pt.iade.ei.thinktoilet.ui.screens

import android.location.Location
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.BottomSheetScaffold
import androidx.compose.material3.DockedSearchBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SearchBarDefaults
import androidx.compose.material3.SheetValue
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberBottomSheetScaffoldState
import androidx.compose.material3.rememberStandardBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.ui.components.CustomDragHandle
import pt.iade.ei.thinktoilet.ui.components.OpenStreetMapsView
import pt.iade.ei.thinktoilet.ui.navegation.AppGraph
import pt.iade.ei.thinktoilet.ui.navegation.BottomSheetNavigationGraph
import pt.iade.ei.thinktoilet.ui.util.NoRippleInteractionSource
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel
import pt.iade.ei.thinktoilet.viewmodel.UserViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    rootNavController: NavController,
    localViewModel: LocalViewModel,
    userViewModel: UserViewModel,
    selectedToiletId: Int? = null,
    navController: NavHostController = rememberNavController()
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val bottomSheetCurrentRoute =
        navController.currentBackStackEntryAsState().value?.destination?.route
    val initialSheetValue: SheetValue = SheetValue.PartiallyExpanded
    val scaffoldState = rememberBottomSheetScaffoldState(
        bottomSheetState = rememberStandardBottomSheetState(
            initialValue = initialSheetValue,
            confirmValueChange = {
                it == SheetValue.Expanded || it == SheetValue.PartiallyExpanded
            }
        )
    )

    var query by remember { mutableStateOf("") }
    var isSearching by remember { mutableStateOf(false) }
    val toiletsSearch = localViewModel.toiletsSearch.collectAsState().value
    val toiletSearchSelected = localViewModel.toiletSearchSelected.collectAsState().value

    val user = userViewModel.user.collectAsState().value
    val isUserLoggedIn = userViewModel.isUserLoggedIn.collectAsState().value
    val toiletsStateFlow = localViewModel.toiletsCache
    val toiletsBoundingBoxIdsStateFlow = localViewModel.toiletsBoundingBoxIds

    val locationStateFlow: StateFlow<Location> = localViewModel.location
    val location = locationStateFlow.collectAsState().value

    LaunchedEffect(toiletSearchSelected) {
        toiletSearchSelected?.onSuccess {
            isSearching = false
            localViewModel.clearSearchToilets()
            localViewModel.clearToiletSearchSelected()
            navController.navigate(AppGraph.bottomSheet.toiletDetail(it.id)) {
                launchSingleTop = true
            }
        }
    }

    LaunchedEffect(Unit, location) {
        scope.launch { localViewModel.loadLocation(userId = user?.id) }
    }

    LaunchedEffect(selectedToiletId) {
        if (selectedToiletId != null) {
            navController.navigate(AppGraph.bottomSheet.toiletDetail(selectedToiletId)) {
                launchSingleTop = true
            }
        }
    }

    LaunchedEffect(bottomSheetCurrentRoute) {
        if (bottomSheetCurrentRoute == AppGraph.bottomSheet.TOILET_DETAILS) {
            scaffoldState.bottomSheetState.expand()
        } else {
            scaffoldState.bottomSheetState.partialExpand()
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

    BottomSheetScaffold(
        scaffoldState = scaffoldState,
        sheetPeekHeight = 140.dp,
        sheetShadowElevation = 8.dp,
        sheetContainerColor = MaterialTheme.colorScheme.surfaceContainerLow,
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
        }
    ) {
        DockedSearchBar(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .padding(top = 16.dp),
            inputField = {
                SearchBarDefaults.InputField(
                    query = query,
                    expanded = isSearching,
                    onExpandedChange = { isSearching = it },
                    placeholder = {
                        Text(context.getString(R.string.search))
                    },
                    leadingIcon = {
                        Icon(Icons.Default.Search, contentDescription = null)
                    },
                    onQueryChange = {
                        query = it
                        localViewModel.loadToiletsSearch(it)
                    },
                    onSearch = { }
                )
            },
            expanded = isSearching,
            onExpandedChange = { isSearching = it },
            colors = SearchBarDefaults.colors(
                containerColor = MaterialTheme.colorScheme.surfaceContainerLow,
                dividerColor = MaterialTheme.colorScheme.onSurface,
            ),
            shadowElevation = 4.dp
        ) {
            LazyColumn {
                itemsIndexed(toiletsSearch) { index, toilet ->
                    if (index != 0) {
                        HorizontalDivider(
                            thickness = 1.dp,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                    Surface(
                        onClick = {
                            if (isUserLoggedIn) {
                                localViewModel.loadToiletSearchSelected(toilet.id)
                            } else {
                                rootNavController.navigate(AppGraph.auth.LOGIN)
                            }
                        },
                        interactionSource = NoRippleInteractionSource(),
                        modifier = Modifier
                            .fillMaxWidth(),
                        color = Color.Transparent
                    ) {
                        Text(
                            modifier = Modifier
                                .padding(horizontal = 16.dp),
                            text = toilet.name,
                            style = MaterialTheme.typography.bodyLarge,
                        )
                    }
                }
            }
        }
        OpenStreetMapsView(
            locationStateFlow,
            toiletsStateFlow,
            toiletsBoundingBoxIdsStateFlow,
            onRequestToiletsBoundingBox = { boundingBox ->
                localViewModel.loadToiletsBoundingBox(
                    boundingBox.latSouth,
                    boundingBox.latNorth,
                    boundingBox.lonWest,
                    boundingBox.lonEast
                )
            },
            onClickMarker = { toiletId ->
                if (isUserLoggedIn) {
                    navController.navigate(AppGraph.bottomSheet.toiletDetail(toiletId)) {
                        launchSingleTop = true
                    }
                } else {
                    rootNavController.navigate(AppGraph.auth.LOGIN)
                }
            }
        )
    }
}