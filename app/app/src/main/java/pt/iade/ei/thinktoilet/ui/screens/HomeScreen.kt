package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CornerBasedShape
import androidx.compose.material3.BottomSheetScaffold
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SheetValue
import androidx.compose.material3.Surface
import androidx.compose.material3.rememberBottomSheetScaffoldState
import androidx.compose.material3.rememberStandardBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.viewmodels.LocalViewModel
import pt.iade.ei.thinktoilet.ui.components.LocationCard
import pt.iade.ei.thinktoilet.ui.components.ToiletPage

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    navController: NavController = rememberNavController(),
    initialToiletID: Int? = null,
    initialSheetValue: SheetValue = SheetValue.PartiallyExpanded,
    viewModel: LocalViewModel = viewModel()
) {
    val bottomSheetNavController = rememberNavController()
    val scope = rememberCoroutineScope()
    val currentRoute = bottomSheetNavController.currentBackStackEntryAsState().value?.destination?.route
    val scaffoldState = rememberBottomSheetScaffoldState(
        bottomSheetState = rememberStandardBottomSheetState(
            initialValue = initialSheetValue,
            confirmValueChange = {
                it == SheetValue.Expanded || it == SheetValue.PartiallyExpanded
            }
        )
    )

    LaunchedEffect(initialToiletID) {
        if (initialToiletID != null) {
            bottomSheetNavController.navigate("toilet_detail/$initialToiletID")
        }
    }

    LaunchedEffect(currentRoute) {
        if (currentRoute == "toilet_detail/{toiletId}") {
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
                NavHost(
                    navController = bottomSheetNavController,
                    startDestination = "toilet_list"
                ) {
                    composable("toilet_list") {
                        ToiletList(toilets = viewModel.toilets) { selectedToilet ->
                            bottomSheetNavController.navigate("toilet_detail/${selectedToilet.id}") {
                                popUpTo(bottomSheetNavController.graph.startDestinationId) {
                                    inclusive = false
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    }
                    composable("toilet_detail/{toiletId}") { backStackEntry ->
                        val toiletId =
                            backStackEntry.arguments?.getString("toiletId")?.toIntOrNull()
                        val toilet = toiletId?.let { viewModel.getToiletById(it) }
                        if (toilet != null) {
                            ToiletDetail(toilet)
                        }
                    }
                }
            }
        },
    ) {}
}

@Composable
fun ToiletDetail(toilet: Toilet) {
    LazyColumn {
        item {
            ToiletPage(toilet = toilet)
        }
    }
}

@Composable
fun ToiletList(toilets: List<Toilet>, onToiletSelected: (Toilet) -> Unit) {
    LazyColumn {
        items(toilets) { toilet ->
            LocationCard(
                toilet = toilet,
                onClick = onToiletSelected
            )
        }
    }
}

@Composable
fun CustomDragHandle(
    verticalPadding: Dp = 14.dp,
    color: Color = MaterialTheme.colorScheme.outline,
    shape: CornerBasedShape = MaterialTheme.shapes.extraLarge,
    width: Dp = 40.dp,
    height: Dp = 4.dp,
    onClick: () -> Unit = {}
) {
    Surface(
        modifier = Modifier
            .padding(vertical = verticalPadding)
            .clickable { onClick() },
        color = color,
        shape = shape
    ) {
        Box(
            Modifier.size(
                width = width,
                height = height
            )
        )
    }
}