package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.BottomSheetScaffold
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SheetValue
import androidx.compose.material3.rememberBottomSheetScaffoldState
import androidx.compose.material3.rememberStandardBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.ui.components.CustomDragHandle
import pt.iade.ei.thinktoilet.ui.navegation.BottomSheetNavigation
import pt.iade.ei.thinktoilet.ui.navegation.Routes
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel

val LocalNavHostController = compositionLocalOf<NavController> { error("NavHostController ERRO") }

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    mainNavController: NavController = rememberNavController(),
    localViewModel: LocalViewModel,
    selectedToiletId: Int? = null,
) {
    val navController = rememberNavController()
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
        localViewModel.loadLocation()
    }

    LaunchedEffect(selectedToiletId) {
        if (selectedToiletId != null) {
            navController.navigate(Routes.homeToiletDetail(selectedToiletId))
        }
    }

    LaunchedEffect(bottomSheetCurrentRoute) {
        if (bottomSheetCurrentRoute == "home/{toiletId}") {
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

    CompositionLocalProvider(
        LocalNavHostController provides navController
    ) {
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
                    BottomSheetNavigation(navController, mainNavController, localViewModel)
                }
            },
        ) {
            Image(
                painter = painterResource(id = R.drawable.map_placeholder),
                contentDescription = "Mapa",
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        }
    }
}