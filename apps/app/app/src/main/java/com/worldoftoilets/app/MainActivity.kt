package com.worldoftoilets.app

import android.content.pm.ActivityInfo
import android.content.res.Configuration
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.runtime.collectAsState
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.navigation.compose.rememberNavController
import com.worldoftoilets.app.ui.navegation.RootNavigationGraph
import com.worldoftoilets.app.ui.theme.AppTheme
import com.worldoftoilets.app.viewmodel.AuthViewModel
import com.worldoftoilets.app.viewmodel.LocalViewModel
import com.worldoftoilets.app.viewmodel.UserViewModel
import dagger.hilt.android.AndroidEntryPoint

import androidx.compose.runtime.LaunchedEffect
import com.worldoftoilets.app.security.AuthEvent
import com.worldoftoilets.app.security.AuthEventBus
import com.worldoftoilets.app.ui.navegation.AppDestinations
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    @Inject
    lateinit var authEventBus: AuthEventBus
    private val userViewModel: UserViewModel by viewModels()
    private val localViewModel: LocalViewModel by viewModels()
    private val authViewModel: AuthViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)

        val isTablet = (resources.configuration.screenLayout
                and Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE

        requestedOrientation = if (isTablet) {
            ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
        } else {
            ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        }

        enableEdgeToEdge()

        splashScreen.setKeepOnScreenCondition {
            userViewModel.isLoggedIn.value == null
        }

        setContent {
            val navController = rememberNavController()
            val isLoggedIn = userViewModel.isLoggedIn.collectAsState().value

            LaunchedEffect(Unit) {
                authEventBus.events.collect { event ->
                    if (event == AuthEvent.SESSION_EXPIRED) {
                        userViewModel.logout()
                        navController.navigate(AppDestinations.Login) {
                            popUpTo(0) { inclusive = true }
                            launchSingleTop = true
                        }
                    }
                }
            }

            if (isLoggedIn != null) {
                val startDestination: Any =
                    if (isLoggedIn) AppDestinations.MainGraph else AppDestinations.AuthGraph
                AppTheme {
                    RootNavigationGraph(
                        navController = navController,
                        localViewModel,
                        userViewModel,
                        authViewModel,
                        startDestination
                    )
                }
            }
        }
    }
}