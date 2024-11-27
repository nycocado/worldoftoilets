package pt.iade.ei.thinktoilet.ui.navegation

import androidx.compose.runtime.Composable
import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
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
                navController.navigate(Routes.homeToiletDetail(selectedToiletId!!)){
                    popUpTo(navController.graph.startDestinationRoute!!){
                        inclusive = true
                    }
                    launchSingleTop = true
                }
            }
        )
        profileNavScreen(navController, localViewModel)
        ratingNavScreen(navController, localViewModel){
            navController.navigateUp()
        }
        homeToiletDetailNavScreen(navController, localViewModel)
    }
}

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
    navController: NavHostController,
    localViewModel: LocalViewModel,
    onRatingToBack: () -> Unit
) {
    composable(Routes.RATING) {
        val toiletId = it.arguments?.getString("toiletId")!!.toInt()
        RatingScreen(navController, localViewModel, toiletId, onRatingToBack)
    }
}

private fun NavGraphBuilder.homeToiletDetailNavScreen(
    navController: NavHostController,
    localViewModel: LocalViewModel
) {
    composable(Routes.HOME_TOILET_DETAIL) {
        val toiletId = it.arguments?.getString("toiletId")!!.toInt()
        HomeScreen(navController, localViewModel, toiletId)
    }
}