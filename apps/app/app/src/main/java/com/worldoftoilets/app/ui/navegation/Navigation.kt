package com.worldoftoilets.app.ui.navegation

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
import com.worldoftoilets.app.models.enums.ChangeSettingType
import com.worldoftoilets.app.models.enums.ConfirmationType
import com.worldoftoilets.app.ui.screens.ChangeSettingsScreen
import com.worldoftoilets.app.ui.screens.ConfirmationScreen
import com.worldoftoilets.app.ui.screens.HistoryScreen
import com.worldoftoilets.app.ui.screens.HomeScreen
import com.worldoftoilets.app.ui.screens.LoginScreen
import com.worldoftoilets.app.ui.screens.ProfileScreen
import com.worldoftoilets.app.ui.screens.RatingScreen
import com.worldoftoilets.app.ui.screens.RegisterScreen
import com.worldoftoilets.app.ui.screens.ReportScreen
import com.worldoftoilets.app.ui.screens.SettingsScreen
import com.worldoftoilets.app.ui.screens.ToiletDetailScreen
import com.worldoftoilets.app.ui.screens.ToiletListScreen
import com.worldoftoilets.app.view.MainView
import com.worldoftoilets.app.viewmodel.AuthViewModel
import com.worldoftoilets.app.viewmodel.LocalViewModel
import com.worldoftoilets.app.viewmodel.UserViewModel

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
        ratingNavGraph(localViewModel, userViewModel, navController)
        authNavGraph(navController, userViewModel, authViewModel)
        reportNavGraph(navController, userViewModel, localViewModel)
        settingsNavGraph(navController, userViewModel)
    }
}

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
            val userId = userViewModel.user.collectAsState().value?.id!!
            LaunchedEffect(Unit) {
                localViewModel.loadToiletsHistory(userId)
            }
            HistoryScreen(
                toilets, toiletIds,
                navigateToHomeScreen = { selectedToiletId ->
                    navController.navigate(AppGraph.main.homeToiletDetail(selectedToiletId!!)) {
                        popUpTo(navController.graph.startDestinationRoute!!) {
                            inclusive = true
                        }
                        launchSingleTop = true
                    }
                },
                onClickLoadMore = { pageResponse ->
                    localViewModel.loadMoreToiletsHistory(userId, pageResponse)
                }
            )
        }
        composable(AppGraph.main.PROFILE) {
            val toilets = localViewModel.toiletsCache
            val user = userViewModel.user
            val userId = user.collectAsState().value?.id
            val comments = localViewModel.commentsUser
            val isLoadingCommentsUser = localViewModel.isLoadingCommentsUser
            LaunchedEffect(Unit) {
                if (userId != null) {
                    localViewModel.loadUserComments(userId)
                }
            }
            ProfileScreen(
                toilets, user, comments, isLoadingCommentsUser,
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
                navigateToSettings = {
                    rootNavController.navigate(AppGraph.settings.SETTINGS_START) {
                        launchSingleTop = true
                    }
                }
            )
        }
    }
}

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
            val user = userViewModel.user.collectAsState().value
            ToiletListScreen(
                toilets, toiletIds, location,
                navigateToToiletDetail = { toiletId ->
                    val isUserLoggedIn = userViewModel.isUserLoggedIn.value
                    if (!isUserLoggedIn) {
                        rootNavController.navigate(AppGraph.auth.LOGIN) {
                            launchSingleTop = true
                        }
                    } else {
                        navController.navigate(AppGraph.bottomSheet.toiletDetail(toiletId))
                    }
                },
                onClickLoadMore = { pageResponse ->
                    localViewModel.loadMoreToiletsNearby(
                        location.value.latitude,
                        location.value.longitude,
                        user?.id,
                        pageResponse
                    )
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
            val isLoadingCommentsToilet = localViewModel.isLoadingCommentsToilet
            val reactions = localViewModel.reactions
            val users = localViewModel.users
            val user = userViewModel.user
            LaunchedEffect(Unit) {
                localViewModel.loadToiletComments(toiletId, userId!!)
            }
            ToiletDetailScreen(
                toiletId, toilets, comments, isLoadingCommentsToilet, reactions, users, user,
                navigateToRating = {
                    rootNavController.navigate(AppGraph.rating.rating(it)) {
                        launchSingleTop = true
                    }
                },
                navigateToToiletReport = { id ->
                    rootNavController.navigate(AppGraph.report.reportToilet(id)) {
                        launchSingleTop = true
                    }
                },
                navigateToCommentReport = { id ->
                    rootNavController.navigate(AppGraph.report.reportComment(id)) {
                        launchSingleTop = true
                    }
                },
                navigateToBack = {
                    navController.popBackStack()
                },
                onReaction = { commentId, typeReaction ->
                    localViewModel.updateReaction(commentId, userId!!, typeReaction)
                }
            )
        }
    }
}

private fun NavGraphBuilder.authNavGraph(
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

private fun NavGraphBuilder.ratingNavGraph(
    localViewModel: LocalViewModel,
    userViewModel: UserViewModel,
    navController: NavHostController
) {
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
}

private fun NavGraphBuilder.reportNavGraph(
    navController: NavHostController,
    userViewModel: UserViewModel,
    localViewModel: LocalViewModel
) {
    navigation(
        route = AppGraph.report.ROOT,
        startDestination = AppGraph.report.REPORT
    ) {
        composable(
            route = AppGraph.report.REPORT,
            arguments = AppGraph.report.REPORT_ARGUMENTS
        ) { backStackEntry ->
            val report = localViewModel.reportState
            val typeId = backStackEntry.arguments?.getString("typeId")!!
            val user = userViewModel.user.collectAsState().value!!
            val id = backStackEntry.arguments?.getInt("id")!!
            ReportScreen(
                reportStateFlow = report,
                type = typeId,
                id = id,
                navigateToBack = {
                    navController.popBackStack()
                },
                onToiletReport = { toiletId, typeReport ->
                    localViewModel.updateReport(toiletId, user.id!!, typeReport)
                },
                onCommentReport = { commentId, typeReaction ->
                    localViewModel.updateReaction(commentId, user.id!!, typeReaction)
                },
                onReportConfirmation = { confirmationType ->
                    localViewModel.clearReportState()
                    navController.navigate(
                        AppGraph.report.reportConfirmation(
                            confirmationType.type,
                            confirmationType.confirmation
                        )
                    ) {
                        launchSingleTop = true
                    }
                }
            )
        }
        composable(
            route = AppGraph.report.REPORT_CONFIRMATION,
            arguments = AppGraph.report.REPORT_CONFIRMATION_ARGUMENTS
        ) { backStackEntry ->
            val type = backStackEntry.arguments?.getString("type")!!
            val confirmation = backStackEntry.arguments?.getBoolean("confirmation")!!
            val confirmationType =
                ConfirmationType.entries.find { it.type == type && it.confirmation == confirmation }!!
            ConfirmationScreen(
                confirmation = confirmationType,
                onClickConfirm = {
                    if (it == ConfirmationType.REPORT_COMMENT_SUCCESS || it == ConfirmationType.REPORT_COMMENT_FAILURE) {
                        navController.popBackStack()
                        navController.popBackStack()
                    } else {
                        navController.navigate(AppGraph.main.ROOT) {
                            popUpTo(navController.graph.startDestinationRoute!!) {
                                inclusive = true
                            }
                            launchSingleTop = true
                        }
                    }
                },
                navigateToBack = {
                    navController.popBackStack()
                }
            )
        }
    }
}

private fun NavGraphBuilder.settingsNavGraph(
    navController: NavHostController,
    userViewModel: UserViewModel
) {
    navigation(
        route = AppGraph.settings.ROOT,
        startDestination = AppGraph.settings.SETTINGS_START
    ) {
        composable(AppGraph.settings.SETTINGS_START) {
            val editUser = userViewModel.editUser
            val user = userViewModel.user.collectAsState().value!!
            val userId = user.id!!
            SettingsScreen(
                editUserStateFlow = editUser,
                user = user,
                navigateToBack = {
                    navController.popBackStack()
                },
                onChange = { type ->
                    navController.navigate(AppGraph.settings.changeSetting(type.value)) {
                        launchSingleTop = true
                    }
                },
                onChangeIcon = { iconId ->
                    userViewModel.editIcon(userId, iconId)
                },
                onChangeIconSuccess = { newUser ->
                    userViewModel.saveUser(newUser)
                }
            )
        }
        composable(
            route = AppGraph.settings.SETTINGS_CHANGE,
            arguments = AppGraph.settings.SETTINGS_CHANGE_ARGUMENTS
        ) { backStackEntry ->
            val type = backStackEntry.arguments?.getString("type")!!
            val changeSettingType = ChangeSettingType.entries.find { it.value == type }!!
            val userId = userViewModel.user.collectAsState().value?.id!!
            val editUser = userViewModel.editUser
            ChangeSettingsScreen(
                editUserStateFlow = editUser,
                changeSettingType = changeSettingType,
                navigateToBack = {
                    navController.popBackStack()
                },
                onChangeName = { name, password ->
                    userViewModel.editName(userId, name, password)
                },
                onChangeEmail = { email, password ->
                    userViewModel.editEmail(userId, email, password)
                },
                onChangePassword = { password, newPassword ->
                    userViewModel.editPassword(userId, password, newPassword)
                },
                onChangeSuccess = { user ->
                    userViewModel.clearEditUser()
                    userViewModel.saveUser(user)
                    navController.popBackStack()
                }
            )
        }
    }
}