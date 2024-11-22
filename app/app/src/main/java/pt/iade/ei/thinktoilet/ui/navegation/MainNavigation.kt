package pt.iade.ei.thinktoilet.ui.navegation

import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.runtime.Composable
import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.ui.screens.HistoryScreen
import pt.iade.ei.thinktoilet.ui.screens.HomeScreen
import pt.iade.ei.thinktoilet.ui.screens.ProfileScreen
import pt.iade.ei.thinktoilet.ui.screens.RatingScreen
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel

@Composable
fun MainNavigation(
    navController: NavHostController,
    localViewModel: LocalViewModel,
) {
    NavHost(
        navController = navController,
        startDestination = Routes.HOME
    ) {
        homeNavScreen(navController, localViewModel)
        historyNavScreen(
            localViewModel,
            onNavigateToHomeScreen = { selectedToiletId ->
                navController.navigate(Routes.homeToiletDetail(selectedToiletId!!)) {
                    popUpTo(navController.graph.startDestinationId) {
                        inclusive = false
                    }
                    launchSingleTop = true
                }
            }
        )
        profileNavScreen(navController, localViewModel)
        ratingNavScreen(navController)
        homeToiletDetailNavScreen(navController, localViewModel)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
private fun NavGraphBuilder.homeNavScreen(
    navController: NavHostController,
    localViewModel: LocalViewModel
) {
    composable(Routes.HOME) {
        HomeScreen(navController, localViewModel)
    }
}

private fun NavGraphBuilder.historyNavScreen(
    localViewModel: LocalViewModel,
    onNavigateToHomeScreen: (Int?) -> Unit,
) {
    composable(Routes.HISTORY) {
        HistoryScreen(onNavigateToHomeScreen, localViewModel)
    }
}

private fun NavGraphBuilder.profileNavScreen(
    navController: NavHostController,
    localViewModel: LocalViewModel
) {
    composable(Routes.PROFILE) {
        ProfileScreen(navController, localViewModel)
    }
}

private fun NavGraphBuilder.ratingNavScreen(
    navController: NavHostController
) {
    composable(Routes.RATING) {
        RatingScreen(navController)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
private fun NavGraphBuilder.homeToiletDetailNavScreen(
    navController: NavHostController,
    localViewModel: LocalViewModel
) {
    composable(Routes.HOME_TOILET_DETAIL) {
        val toiletId = it.arguments?.getString("toiletId")!!.toInt()
        HomeScreen(navController, localViewModel, toiletId)
    }
}