package pt.iade.ei.thinktoilet.ui.navegation

import androidx.compose.animation.EnterTransition
import androidx.compose.animation.ExitTransition
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
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
import pt.iade.ei.thinktoilet.ui.screens.SettingsScreen
import pt.iade.ei.thinktoilet.ui.screens.ToiletDetailScreen
import pt.iade.ei.thinktoilet.ui.screens.ToiletListScreen
import pt.iade.ei.thinktoilet.view.MainView
import pt.iade.ei.thinktoilet.viewmodel.AuthViewModel
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel
import pt.iade.ei.thinktoilet.viewmodel.UserViewModel

/**
* Navegação raiz da aplicação.
*
* @param navController [NavHostController] que será utilizado para navegar entre os destinos.
* @param localViewModel [LocalViewModel] é um [ViewModel] que contém os dados locais da aplicação.
* @param userViewModel [UserViewModel] é um [ViewModel] que contém os dados do usuário.
* @param authViewModel [AuthViewModel] é um [ViewModel] que contém os dados de autenticação.
*/
@Composable
fun RootNavigationGraph(
    navController: NavHostController,
    localViewModel: LocalViewModel,
    userViewModel: UserViewModel,
    authViewModel: AuthViewModel
) {
    NavHost(
        navController = navController,
        route = AppGraph.initial.ROOT,
        startDestination = AppGraph.main.ROOT
    ) {
        composable(AppGraph.main.ROOT) {
            MainView(navController, localViewModel, userViewModel)
        }
        composable(
            route = AppGraph.rating.RATING,
            arguments = AppGraph.rating.RATING_ARGUMENTS
        ) { backStackEntry ->
            val toiletIdArg = backStackEntry.arguments?.getInt("toiletId")!!
            val toilet = localViewModel.toiletsCache.collectAsState().value[toiletIdArg]
            val user = userViewModel.user.collectAsState().value
            val rating = localViewModel.ratingState
            RatingScreen(
                toilet = toilet!!,
                user = user!!,
                ratingStateFlow = rating,
                onRating = { toiletId, userId, text, ratingClean, ratingPaper, ratingStructure, ratingAccessibility ->
                    localViewModel.requestComment(
                        toiletId,
                        userId,
                        text,
                        ratingClean,
                        ratingPaper,
                        ratingStructure,
                        ratingAccessibility
                    )
                },
                onRatingSuccess = {
                    localViewModel.clearRatingState()
                    navController.popBackStack()
                },
                navigateToBack = {
                    navController.popBackStack()
                }
            )
        }
        composable(AppGraph.settings.SETTINGS) {
            val user = userViewModel.user.collectAsState().value!!
            SettingsScreen(
                user = user,
                navigateToBack = {
                    navController.popBackStack()
                }
            )
        }
        authNavGraph(navController, userViewModel, authViewModel)
    }
}

/**
 * Navegação principal da aplicação.
 *
 * @param navController [NavHostController] que será utilizado para navegar entre os destinos da navegação principal.
 * @param rootNavController [NavController] que será utilizado para navegar entre os destinos da navegação raiz.
 * @param localViewModel [LocalViewModel] é um [ViewModel] que contém os dados locais da aplicação.
 * @param userViewModel [UserViewModel] é um [ViewModel] que contém os dados do usuário.
 */
@Composable
fun MainNavigationGraph(
    navController: NavHostController,
    rootNavController: NavController,
    localViewModel: LocalViewModel,
    userViewModel: UserViewModel
) {
    NavHost(
        navController = navController,
        route = AppGraph.main.ROOT,
        startDestination = AppGraph.main.HOME
    ) {
        composable(
            route = AppGraph.main.HOME_WITH_ARGUMENTS,
            arguments = AppGraph.main.HOME_ARGUMENTS
        ) { backStackEntry ->
            val toiletId = backStackEntry.arguments?.getString("toiletId")?.toInt()
            HomeScreen(rootNavController, localViewModel, userViewModel, toiletId)
        }
        composable(AppGraph.main.HISTORY) {
            val toilets = localViewModel.toiletsCache
            val toiletIds = localViewModel.toiletsHistoryIds
            val userId = userViewModel.user.collectAsState().value?.id
            LaunchedEffect(Unit) {
                localViewModel.loadToiletsHistory(userId!!)
            }
            HistoryScreen(toilets, toiletIds,
                navigateToHomeScreen = { selectedToiletId ->
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
            val user = userViewModel.user
            val userId = user.collectAsState().value?.id
            val comments = localViewModel.commentsUser
            LaunchedEffect(Unit) {
                if (userId != null) {
                    localViewModel.loadUserComments(userId)
                }
            }
            ProfileScreen(toilets, user, comments,
                onClickLogout = {
                    userViewModel.clearUser().also {
                        navController.navigate(AppGraph.main.HOME) {
                            popUpTo(rootNavController.graph.startDestinationRoute!!) {
                                inclusive = true
                            }
                            launchSingleTop = true
                        }
                        rootNavController.navigate(AppGraph.auth.LOGIN) {
                            launchSingleTop = true
                        }
                    }
                },
                onClickEditProfile = {
                    rootNavController.navigate(AppGraph.settings.SETTINGS) {
                        launchSingleTop = true
                    }
                }
            )
        }
    }
}

/**
 * Navegação da barra inferior da aplicação.
 *
 * @param navController [NavHostController] que será utilizado para navegar entre os destinos da bottom sheet, presente na tela principal.
 * @param rootNavController [NavController] que será utilizado para navegar entre os destinos da navegação raiz.
 * @param localViewModel [LocalViewModel] é um [ViewModel] que contém os dados locais da aplicação.
 * @param userViewModel [UserViewModel] é um [ViewModel] que contém os dados do usuário.
 */
@Composable
fun BottomSheetNavigationGraph(
    navController: NavHostController,
    rootNavController: NavController,
    localViewModel: LocalViewModel,
    userViewModel: UserViewModel
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
                    val isUserLoggedIn = userViewModel.isUserLoggedIn.value
                    if (!isUserLoggedIn) {
                        rootNavController.navigate(AppGraph.auth.LOGIN) {
                            launchSingleTop = true
                        }
                    } else {
                        navController.navigate(AppGraph.bottomSheet.toiletDetail(toiletId))
                    }
                }
            )
        }
        composable(
            route = AppGraph.bottomSheet.TOILET_DETAILS,
            arguments = AppGraph.bottomSheet.TOILET_DETAILS_ARGUMENTS
        ) { backStackEntry ->
            val toiletId = backStackEntry.arguments?.getInt("toiletId")!!
            val userId = userViewModel.user.collectAsState().value?.id
            val toilets = localViewModel.toiletsCache
            val comments = localViewModel.commentsToilet
            val reactions = localViewModel.reactions
            val users = localViewModel.users
            LaunchedEffect(Unit) {
                localViewModel.loadToiletComments(toiletId, userId!!)
            }
            ToiletDetailScreen(toiletId, toilets, comments, reactions, users,
                navigateToRating = {
                    rootNavController.navigate(AppGraph.rating.rating(it)) {
                        launchSingleTop = true
                    }
                },
                navigateToBack = {
                    navController.popBackStack()
                },
                onReaction = { commentId, typeReaction ->
                    localViewModel.updateReaction(commentId, typeReaction, userId!!)
                }
            )
        }
    }
}

/**
 * Navegação de autenticação da aplicação.
 *
 * @param navController [NavHostController] que será utilizado para navegar entre os destinos da navegação de autenticação.
 * @param userViewModel [UserViewModel] é um [ViewModel] que contém os dados do usuário.
 * @param authViewModel [AuthViewModel] é um [ViewModel] que contém os dados de autenticação.
 */
fun NavGraphBuilder.authNavGraph(
    navController: NavHostController,
    userViewModel: UserViewModel,
    authViewModel: AuthViewModel
) {
    navigation(
        route = AppGraph.auth.ROOT,
        startDestination = AppGraph.auth.LOGIN,
    ) {
        composable(AppGraph.auth.LOGIN) {
            val login = authViewModel.loginState
            LoginScreen(
                loginStateFlow = login,
                onLogin = { email, password ->
                    authViewModel.requestLogin(email, password)
                },
                onLoginSuccess = { user ->
                    userViewModel.saveUser(user)
                    authViewModel.clearLoginState()
                    navController.navigate(AppGraph.main.ROOT) {
                        popUpTo(navController.graph.startDestinationRoute!!) {
                            inclusive = true
                        }
                        launchSingleTop = true
                    }
                },
                navigateToRegister = {
                    navController.navigate(AppGraph.auth.REGISTER)
                }
            )
        }
        composable(AppGraph.auth.REGISTER) {
            val register = authViewModel.registerState
            RegisterScreen(
                registerStateFlow = register,
                onRegister = { name, email, password, iconId, birthDate ->
                    authViewModel.requestRegister(name, email, password, iconId, birthDate)
                },
                onRegisterSuccess = {
                    authViewModel.clearRegisterState()
                    navController.popBackStack()
                },
                navigateToBack = {
                    navController.popBackStack()
                }
            )
        }
    }
}