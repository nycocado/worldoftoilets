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
import pt.iade.ei.thinktoilet.viewmodels.LocalViewModel

@Composable
fun MainNavigation(
    navController: NavHostController,
    viewModel: LocalViewModel
) {
    NavHost(
        navController = navController,
        startDestination = Routes.HOME
    ) {
        homeNavScreen(navController, viewModel)
        historyNavScreen(
            viewModel.toilets.value!!,
            onNavigateToHomeScreen = { selectedToiletId ->
                navController.navigate(Routes.homeToiletDetail(selectedToiletId!!)) {
                    popUpTo(navController.graph.startDestinationId) {
                        inclusive = false
                    }
                    launchSingleTop = true
                }
            }
        )
        profileNavScreen(navController, viewModel)
        ratingNavScreen(navController, viewModel)
        homeToiletDetailNavScreen(navController, viewModel)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
private fun NavGraphBuilder.homeNavScreen(
    navController: NavHostController,
    viewModel: LocalViewModel
) {
    composable(Routes.HOME) {
        HomeScreen(mainNavController = navController, viewModel = viewModel)
    }
}

private fun NavGraphBuilder.historyNavScreen(
    toilets: List<Toilet> = emptyList(),
    onNavigateToHomeScreen: (Int?) -> Unit,
) {
    composable(Routes.HISTORY) {
        HistoryScreen(onNavigateToHomeScreen, toilets)
    }
}

private fun NavGraphBuilder.profileNavScreen(
    navController: NavHostController,
    viewModel: LocalViewModel
) {
    composable(Routes.PROFILE) {
        ProfileScreen(navController = navController, viewModel = viewModel)
    }
}

private fun NavGraphBuilder.ratingNavScreen(
    navController: NavHostController,
    viewModel: LocalViewModel
) {
    composable(Routes.RATING) {
        RatingScreen(navController = navController, viewModel = viewModel)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
private fun NavGraphBuilder.homeToiletDetailNavScreen(
    navController: NavHostController,
    viewModel: LocalViewModel
) {
    composable(Routes.HOME_TOILET_DETAIL) {
        val toiletId = it.arguments?.getString("toiletId")!!.toInt()
        HomeScreen(
            mainNavController = navController,
            viewModel = viewModel,
            selectedToiletId = toiletId
        )
    }
}