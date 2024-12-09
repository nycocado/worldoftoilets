package pt.iade.ei.thinktoilet.ui.navegation

import androidx.compose.animation.EnterTransition
import androidx.compose.animation.ExitTransition
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.navigation
import pt.iade.ei.thinktoilet.ui.screens.HistoryScreen
import pt.iade.ei.thinktoilet.ui.screens.HomeScreen
import pt.iade.ei.thinktoilet.ui.screens.LoginScreen
import pt.iade.ei.thinktoilet.ui.screens.ProfileScreen
import pt.iade.ei.thinktoilet.ui.screens.RatingScreen
import pt.iade.ei.thinktoilet.ui.screens.RegisterScreen
import pt.iade.ei.thinktoilet.ui.screens.ToiletDetailScreen
import pt.iade.ei.thinktoilet.ui.screens.ToiletListScreen
import pt.iade.ei.thinktoilet.view.MainView
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel

@Composable
fun RootNavigationGraph(
    navController: NavHostController,
    localViewModel: LocalViewModel
) {
    NavHost(
        navController = navController,
        route = AppGraph.initial.ROOT,
        startDestination = AppGraph.main.ROOT
    ) {
        composable(AppGraph.main.ROOT) {
            MainView(navController, localViewModel)
        }
        composable(AppGraph.rating.RATING) { backStackEntry ->
            val toiletId = backStackEntry.arguments?.getString("toiletId")!!.toInt()
            RatingScreen(
                onClickRating = {
                    navController.popBackStack()
                }
            )
        }
        authNavGraph(navController, localViewModel)
    }
}

@Composable
fun MainNavigationGraph(
    navController: NavHostController,
    rootNavController: NavController,
    localViewModel: LocalViewModel
) {
    NavHost(
        navController = navController,
        route = AppGraph.main.ROOT,
        startDestination = AppGraph.main.HOME
    ) {
        composable(AppGraph.main.HOME) {
            HomeScreen(rootNavController, localViewModel)
        }
        composable(AppGraph.main.HOME_TOILET_DETAIL) { backStackEntry ->
            val toiletId = backStackEntry.arguments?.getString("toiletId")!!.toInt()
            HomeScreen(rootNavController, localViewModel, toiletId)
        }
        composable(AppGraph.main.HISTORY) {
            val toilets = localViewModel.toiletsCache
            val toiletIds = localViewModel.toiletsHistoryIds
            LaunchedEffect(Unit) {
                localViewModel.loadToiletsHistory()
            }
            HistoryScreen(toilets, toiletIds,
                onNavigateToHomeScreen = { selectedToiletId ->
                    navController.navigate(AppGraph.main.homeToiletDetail(selectedToiletId!!)) {
                        popUpTo(navController.graph.startDestinationRoute!!) {
                            inclusive = true
                        }
                        launchSingleTop = true
                    }
                }
            )
        }
        composable(AppGraph.main.PROFILE) {
            val toilets = localViewModel.toiletsCache
            val user = localViewModel.userMain
            val userId = user.collectAsState().value?.id
            val comments = localViewModel.commentsUser
            LaunchedEffect(Unit) {
                if (userId != null) {
                    localViewModel.loadUserComments(userId)
                }
            }
            ProfileScreen(toilets, user, comments)
        }
    }
}

@Composable
fun BottomSheetNavigationGraph(
    navController: NavHostController,
    rootNavController: NavController,
    localViewModel: LocalViewModel
) {
    NavHost(
        navController = navController,
        startDestination = AppGraph.bottomSheet.TOILET_LIST,
        enterTransition = { EnterTransition.None },
        exitTransition = { ExitTransition.None },
    ) {
        composable(AppGraph.bottomSheet.TOILET_LIST) {
            val toilets = localViewModel.toiletsCache
            val toiletIds = localViewModel.toiletsNearbyIds
            val location = localViewModel.location
            ToiletListScreen(toilets, toiletIds, location,
                navigateToToiletDetail = { toiletId ->
                    val isUserLoggedIn = localViewModel.isUserLoggedIn.value
                    if (!isUserLoggedIn) {
                        rootNavController.navigate(AppGraph.auth.LOGIN) {
                            launchSingleTop = true
                        }
                        return@ToiletListScreen
                    }
                    navController.navigate(AppGraph.bottomSheet.toiletDetail(toiletId))
                }
            )
        }
        composable(AppGraph.bottomSheet.TOILET_DETAILS) { backStackEntry ->
            val toiletId = backStackEntry.arguments?.getString("toiletId")!!.toInt()
            val toilets = localViewModel.toiletsCache
            val comments = localViewModel.commentsToilet
            val users = localViewModel.users
            LaunchedEffect(Unit) {
                localViewModel.loadToiletComments(toiletId)
            }
            ToiletDetailScreen(toiletId, toilets, comments, users, navigateToRating = {
                rootNavController.navigate(AppGraph.rating.rating(it))
            })
        }
    }
}

fun NavGraphBuilder.authNavGraph(
    navController: NavHostController,
    localViewModel: LocalViewModel
) {
    navigation(
        route = AppGraph.auth.ROOT,
        startDestination = AppGraph.auth.LOGIN,
    ) {
        composable(AppGraph.auth.LOGIN) {
            val login = localViewModel.loginState
            LoginScreen(
                loginStateFlow = login,
                onLogin = { email, password ->
                    localViewModel.login(email, password)
                },
                onLoginSuccess = { user ->
                    localViewModel.saveUser(user)
                    LaunchedEffect(Unit) {
                        navController.navigate(AppGraph.main.ROOT) {
                            popUpTo(navController.graph.startDestinationRoute!!) {
                                inclusive = true
                            }
                            launchSingleTop = true
                        }
                    }

                },
                navigateToRegister = {
                    navController.navigate(AppGraph.auth.REGISTER)
                }
            )
        }
        composable(AppGraph.auth.REGISTER) {
            RegisterScreen()
        }
    }
}