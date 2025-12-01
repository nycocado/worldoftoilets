package com.worldoftoilets.app.ui.navegation

import androidx.compose.animation.EnterTransition
import androidx.compose.animation.ExitTransition
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.navigation
import androidx.navigation.toRoute
import com.worldoftoilets.app.models.enums.ChangeSettingType
import com.worldoftoilets.app.models.enums.ConfirmationType
import com.worldoftoilets.app.ui.screens.ChangeSettingsScreen
import com.worldoftoilets.app.ui.screens.ConfirmationScreen
import com.worldoftoilets.app.ui.screens.ForgotPasswordScreen
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
    authViewModel: AuthViewModel,
    startDestination: Any
) {
    NavHost(
        navController = navController,
        startDestination = startDestination,
        route = AppDestinations.RootGraph::class
    ) {
        composable<AppDestinations.MainGraph> {
            MainView(navController, localViewModel, userViewModel)
        }
        ratingNavGraph(localViewModel, navController)
        authNavGraph(navController, authViewModel)
        reportNavGraph(navController, localViewModel, authViewModel)
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
        startDestination = AppDestinations.Home(),
        route = AppDestinations.MainGraph::class
    ) {
        composable<AppDestinations.Home> { backStackEntry ->
            val args = backStackEntry.toRoute<AppDestinations.Home>()
            HomeScreen(rootNavController, localViewModel, userViewModel, args.toiletId)
        }
        composable<AppDestinations.Profile> {
            val user = userViewModel.user
            val comments = localViewModel.myComments
            val isLoadingCommentsUser = localViewModel.isLoadingCommentsUser
            LaunchedEffect(Unit) {
                localViewModel.loadMyComments()
            }
            ProfileScreen(
                user, comments, isLoadingCommentsUser,
                onClickLogout = {
                    userViewModel.logout().also {
                        navController.navigate(AppDestinations.Home()) {
                            popUpTo(rootNavController.graph.startDestinationId) {
                                inclusive = true
                            }
                            launchSingleTop = true
                        }
                        rootNavController.navigate(AppDestinations.Login) {
                            launchSingleTop = true
                        }
                    }
                },
                navigateToSettings = {
                    rootNavController.navigate(AppDestinations.SettingsStart) {
                        launchSingleTop = true
                    }
                },
                onLoadMoreComments = {
                    localViewModel.loadMoreMyComments()
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
    userViewModel: UserViewModel,
    lazyListState: LazyListState
) {
    NavHost(
        navController = navController,
        startDestination = AppDestinations.ToiletList,
        route = AppDestinations.BottomSheetGraph::class,
        enterTransition = { EnterTransition.None },
        exitTransition = { ExitTransition.None },
    ) {
        composable<AppDestinations.ToiletList> {
            val toilets = localViewModel.toiletsCache
            val toiletIds = localViewModel.toiletsNearbyIds
            val location = localViewModel.location
            val isLoggedIn = userViewModel.isLoggedIn.collectAsState().value
            ToiletListScreen(
                toiletsStateFlow = toilets,
                toiletsNearbyIdsStateFlow = toiletIds,
                locationStateFlow = location,
                lazyListState = lazyListState,
                navigateToToiletDetail = { toiletId ->
                    isLoggedIn?.let { logged ->
                        if (!logged) {
                            rootNavController.navigate(AppDestinations.Login) {
                                launchSingleTop = true
                            }
                        } else {
                            navController.navigate(AppDestinations.ToiletDetails(toiletId))
                        }
                    }
                },
                onClickLoadMore = {
                    location.value?.let { loc ->
                        localViewModel.loadMoreToiletsNearby(
                            loc.latitude,
                            loc.longitude
                        )
                    }
                }
            )
        }
        composable<AppDestinations.ToiletDetails> { backStackEntry ->
            val args = backStackEntry.toRoute<AppDestinations.ToiletDetails>()
            val toiletId = args.toiletId
            val toilets = localViewModel.toiletsCache
            val commentsCache = localViewModel.commentsCache
            val isLoadingCommentsToilet = localViewModel.isLoadingCommentsToilet
            val user = userViewModel.user
            val error = localViewModel.error
            val repliesCache = localViewModel.repliesCache
            val loadingReplies = localViewModel.loadingReplies
            LaunchedEffect(Unit) {
                localViewModel.loadToiletComments(toiletId)
            }
            ToiletDetailScreen(
                toiletId = toiletId,
                toiletsStateFlow = toilets,
                commentsCacheStateFlow = commentsCache,
                isLoadingCommentsToiletStateFlow = isLoadingCommentsToilet,
                userMainStateFlow = user,
                errorStateFlow = error,
                repliesCacheStateFlow = repliesCache,
                loadingRepliesStateFlow = loadingReplies,
                lazyListState = lazyListState,
                navigateToRating = {
                    rootNavController.navigate(AppDestinations.Rating(it)) {
                        launchSingleTop = true
                    }
                },
                navigateToToiletReport = { id ->
                    rootNavController.navigate(AppDestinations.Report(typeId = "toilet", id = id)) {
                        launchSingleTop = true
                    }
                },
                navigateToCommentReport = { id ->
                    rootNavController.navigate(
                        AppDestinations.Report(
                            typeId = "comment",
                            id = id
                        )
                    ) {
                        launchSingleTop = true
                    }
                },
                navigateToReplyReport = { id ->
                    rootNavController.navigate(AppDestinations.Report(typeId = "reply", id = id)) {
                        launchSingleTop = true
                    }
                },
                navigateToBack = {
                    navController.popBackStack()
                },
                onReaction = { tId, commentId, react ->
                    localViewModel.reactToComment(tId, commentId, react)
                },
                onLoadMoreComments = {
                    localViewModel.loadMoreToiletComments(toiletId)
                },
                onLoadReplies = { commentId ->
                    localViewModel.loadReplies(commentId)
                },
                onReply = { commentId, text ->
                    localViewModel.createReply(commentId, text)
                },
                onEditComment = { commentId ->
                    rootNavController.navigate(AppDestinations.Rating(toiletId, commentId)) {
                        launchSingleTop = true
                    }
                },
                onDeleteComment = { commentId ->
                    localViewModel.deleteComment(commentId, toiletId)
                },
                onEditReply = { replyId, commentId, text ->
                    localViewModel.updateReply(replyId, commentId, text)
                },
                onDeleteReply = { replyId, commentId ->
                    localViewModel.deleteReply(replyId, commentId)
                }
            )
        }
    }
}

private fun NavGraphBuilder.authNavGraph(
    navController: NavHostController,
    authViewModel: AuthViewModel
) {
    navigation<AppDestinations.AuthGraph>(
        startDestination = AppDestinations.Login
    ) {
        composable<AppDestinations.Login> {
            val login = authViewModel.loginState
            LoginScreen(
                loginStateFlow = login,
                onLogin = { email, password ->
                    authViewModel.login(email, password)
                },
                onLoginSuccess = {
                    authViewModel.clearLoginState()
                    navController.navigate(AppDestinations.MainGraph) {
                        popUpTo(navController.graph.startDestinationId) {
                            inclusive = true
                        }
                        launchSingleTop = true
                    }
                },
                navigateToRegister = {
                    navController.navigate(AppDestinations.Register)
                },
                navigateToForgotPassword = {
                    navController.navigate(AppDestinations.ForgotPassword)
                }
            )
        }
        composable<AppDestinations.Register> {
            val register = authViewModel.registerState
            RegisterScreen(
                registerStateFlow = register,
                onRegister = { name, email, password, icon, birthDate ->
                    authViewModel.register(name, email, password, icon, birthDate)
                },
                onRegisterSuccess = { email ->
                    authViewModel.clearRegisterState()
                    navController.navigate(
                        AppDestinations.Confirmation(
                            type = "register",
                            confirmation = true,
                            email = email
                        )
                    ) {
                        popUpTo(AppDestinations.Register) { inclusive = true }
                    }
                },
                navigateToBack = {
                    navController.popBackStack()
                }
            )
        }
        composable<AppDestinations.ForgotPassword> {
            val forgotPasswordState = authViewModel.forgotPasswordState
            ForgotPasswordScreen(
                forgotPasswordStateFlow = forgotPasswordState,
                onForgotPassword = { email ->
                    authViewModel.forgotPassword(email)
                },
                onForgotPasswordSuccess = {
                    authViewModel.clearForgotPasswordState()
                    navController.navigate(
                        AppDestinations.Confirmation(
                            type = "forgot-password",
                            confirmation = true
                        )
                    ) {
                        popUpTo(AppDestinations.ForgotPassword) { inclusive = true }
                    }
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
    navController: NavHostController
) {
    composable<AppDestinations.Rating> { backStackEntry ->
        val args = backStackEntry.toRoute<AppDestinations.Rating>()
        val toiletId = args.toiletId
        val commentId = args.commentId
        val toilet = localViewModel.toiletsCache.collectAsState().value[toiletId]
        val rating = localViewModel.ratingState

        val comment = commentId?.let { localViewModel.getCommentById(it) }

        if (toilet != null) {
            RatingScreen(
                toilet = toilet,
                comment = comment,
                ratingStateFlow = rating,
                onRating = { pubId, text, ratingClean, ratingPaper, ratingStructure, ratingAccessibility ->
                    localViewModel.submitRating(
                        pubId,
                        text,
                        ratingClean,
                        ratingPaper,
                        ratingStructure,
                        ratingAccessibility
                    )
                },
                onUpdate = { commentIdParam, toiletPublicId, text, ratingClean, ratingPaper, ratingStructure, ratingAccessibility ->
                    localViewModel.updateComment(
                        commentIdParam,
                        toiletPublicId,
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
        } else {
            // Handle error: Toilet not found
            navController.popBackStack()
        }
    }
}

private fun NavGraphBuilder.reportNavGraph(
    navController: NavHostController,
    localViewModel: LocalViewModel,
    authViewModel: AuthViewModel
) {
    // We are not using 'navigation' wrapper here because startDestination with args is tricky.
    // Just exposing the composables directly to the root graph.

    composable<AppDestinations.Report> { backStackEntry ->
        val args = backStackEntry.toRoute<AppDestinations.Report>()
        val reportState = localViewModel.reportState
        ReportScreen(
            type = args.typeId,
            id = args.id,
            reportStateFlow = reportState,
            navigateToBack = {
                navController.popBackStack()
            },
            onToiletReport = { toiletPublicId, typeReport ->
                localViewModel.reportToilet(toiletPublicId, typeReport)
            },
            onCommentReport = { commentPublicId, typeReport ->
                localViewModel.reportComment(commentPublicId, typeReport)
            },
            onReplyReport = { replyPublicId, typeReport ->
                localViewModel.reportReply(replyPublicId, typeReport)
            },
            onReportConfirmation = { confirmationType ->
                localViewModel.clearReportState()
                navController.navigate(
                    AppDestinations.Confirmation(
                        type = confirmationType.type,
                        confirmation = confirmationType.confirmation
                    )
                ) {
                    launchSingleTop = true
                }
            }
        )
    }
    composable<AppDestinations.Confirmation> { backStackEntry ->
        val args = backStackEntry.toRoute<AppDestinations.Confirmation>()
        val confirmationType =
            ConfirmationType.entries.find { it.type == args.type && it.confirmation == args.confirmation }!!
        ConfirmationScreen(
            confirmation = confirmationType,
            onClickConfirm = {
                when (it) {
                    ConfirmationType.REGISTER_SUCCESS, ConfirmationType.FORGOT_PASSWORD_SUCCESS -> {
                        navController.popBackStack()
                    }

                    ConfirmationType.REPORT_COMMENT_SUCCESS, ConfirmationType.REPORT_COMMENT_FAILURE, ConfirmationType.REPORT_REPLY_SUCCESS, ConfirmationType.REPORT_REPLY_FAILURE
                        -> {
                        navController.popBackStack()
                        navController.popBackStack()
                    }

                    else -> {
                        navController.navigate(AppDestinations.MainGraph) {
                            popUpTo(navController.graph.startDestinationId) {
                                inclusive = true
                            }
                            launchSingleTop = true
                        }
                    }
                }
            },
            onClickResend = if (args.email != null) {
                if (args.type == "forgot-password") {
                    { authViewModel.forgotPassword(args.email) }
                } else {
                    { authViewModel.resendVerification(args.email) }
                }
            } else null,
            navigateToBack = {
                navController.popBackStack()
            }
        )
    }
}

private fun NavGraphBuilder.settingsNavGraph(
    navController: NavHostController,
    userViewModel: UserViewModel
) {
    navigation<AppDestinations.SettingsGraph>(
        startDestination = AppDestinations.SettingsStart
    ) {
        composable<AppDestinations.SettingsStart> {
            val updateUserState = userViewModel.updateUserState
            val user = userViewModel.user.collectAsState().value!!
            SettingsScreen(
                updateUserStateFlow = updateUserState,
                user = user,
                navigateToBack = {
                    navController.popBackStack()
                },
                onChange = { type ->
                    navController.navigate(AppDestinations.SettingsChange(type.value)) {
                        launchSingleTop = true
                    }
                },
                onChangeIcon = { icon ->
                    userViewModel.updateUser(name = null, icon = icon, birthDate = null)
                }
            )
        }
        composable<AppDestinations.SettingsChange> { backStackEntry ->
            val args = backStackEntry.toRoute<AppDestinations.SettingsChange>()
            val changeSettingType = ChangeSettingType.entries.find { it.value == args.type }!!
            val updateUserState = userViewModel.updateUserState
            ChangeSettingsScreen(
                updateUserStateFlow = updateUserState,
                changeSettingType = changeSettingType,
                navigateToBack = {
                    navController.popBackStack()
                },
                onChangeName = { name ->
                    userViewModel.updateUser(name = name, icon = null, birthDate = null)
                },
                onChangeSuccess = {
                    navController.popBackStack()
                }
            )
        }
    }
}