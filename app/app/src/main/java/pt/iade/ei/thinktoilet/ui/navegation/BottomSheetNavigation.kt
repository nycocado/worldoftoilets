package pt.iade.ei.thinktoilet.ui.navegation

import androidx.compose.runtime.Composable
import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import pt.iade.ei.thinktoilet.ui.screens.ToiletDetail
import pt.iade.ei.thinktoilet.ui.screens.ToiletList
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel

@Composable
fun BottomSheetNavigation(
    navController: NavHostController,
    mainNavController: NavController,
    localViewModel: LocalViewModel
) {
    NavHost(
        navController = navController,
        startDestination = Routes.HOME
    ) {
        toiletListNavScreen(localViewModel, navController)
        toiletDetailNavScreen(mainNavController, localViewModel)
    }
}

private fun NavGraphBuilder.toiletListNavScreen(
    localViewModel: LocalViewModel,
    navController: NavHostController
) {
    composable(Routes.HOME) {
        ToiletList(localViewModel) { toiletId ->
            navController.navigate(Routes.homeToiletDetail(toiletId))
        }
    }
}

private fun NavGraphBuilder.toiletDetailNavScreen(
    mainNavController: NavController,
    localViewModel: LocalViewModel
) {
    composable(Routes.HOME_TOILET_DETAIL) { backStackEntry ->
        val toiletId = backStackEntry.arguments?.getString("toiletId")!!.toInt()
        ToiletDetail(mainNavController, localViewModel, toiletId)
    }
}
