package com.worldoftoilets.app.ui.navegation

import android.content.Context
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AccountCircle
import androidx.compose.material.icons.outlined.AddLocation
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.rounded.AccountCircle
import androidx.compose.material.icons.rounded.AddLocation
import androidx.compose.material.icons.rounded.LocationOn
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import com.worldoftoilets.app.R
import kotlin.reflect.KClass

sealed class NavRoute<T : Any>(
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val hasNews: Boolean,
    val badgeCount: Int? = null,
    val destination: T,
    val routeClass: KClass<T>
) {
    abstract fun getTitle(): String

    data class Home(private val context: Context) : NavRoute<AppDestinations.Home>(
        selectedIcon = Icons.Rounded.LocationOn,
        unselectedIcon = Icons.Outlined.LocationOn,
        hasNews = false,
        destination = AppDestinations.Home(),
        routeClass = AppDestinations.Home::class
    ) {
        override fun getTitle(): String {
            return context.getString(R.string.home)
        }
    }

    data class Suggestion(private val context: Context) : NavRoute<AppDestinations.SuggestionStart>(
        selectedIcon = Icons.Rounded.AddLocation,
        unselectedIcon = Icons.Outlined.AddLocation,
        hasNews = false,
        destination = AppDestinations.SuggestionStart,
        routeClass = AppDestinations.SuggestionStart::class
    ) {
        override fun getTitle(): String {
            return context.getString(R.string.suggest)
        }
    }

    data class Profile(private val context: Context) : NavRoute<AppDestinations.Profile>(
        selectedIcon = Icons.Rounded.AccountCircle,
        unselectedIcon = Icons.Outlined.AccountCircle,
        hasNews = false,
        destination = AppDestinations.Profile,
        routeClass = AppDestinations.Profile::class
    ) {
        override fun getTitle(): String {
            return context.getString(R.string.profile)
        }
    }
}

@Composable
fun getBottomRoutes(): List<NavRoute<*>> {
    val context: Context = LocalContext.current
    return listOf(
        NavRoute.Home(context),
        NavRoute.Suggestion(context),
        NavRoute.Profile(context)
    )
}