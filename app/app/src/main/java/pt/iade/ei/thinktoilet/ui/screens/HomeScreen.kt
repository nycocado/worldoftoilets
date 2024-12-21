package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.material3.BottomSheetScaffold
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SheetValue
import androidx.compose.material3.rememberBottomSheetScaffoldState
import androidx.compose.material3.rememberStandardBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.ui.components.CustomDragHandle
import pt.iade.ei.thinktoilet.ui.components.OpenStreetMapsView
import pt.iade.ei.thinktoilet.ui.navegation.AppGraph
import pt.iade.ei.thinktoilet.ui.navegation.BottomSheetNavigationGraph
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

    LaunchedEffect(Unit) {
        scope.launch { localViewModel.loadLocation() }
    }

    LaunchedEffect(selectedToiletId) {
        if (selectedToiletId != null) {
            navController.navigate(AppGraph.bottomSheet.toiletDetail(selectedToiletId)){
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
                BottomSheetNavigationGraph(navController, rootNavController, localViewModel, userViewModel)
            }
        },
    ) {
        val locationStateFlow = localViewModel.location
        OpenStreetMapsView(locationStateFlow)
    }
}
