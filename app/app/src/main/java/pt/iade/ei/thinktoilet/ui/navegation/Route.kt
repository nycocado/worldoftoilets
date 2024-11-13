package pt.iade.ei.thinktoilet.ui.navegation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.Person
import androidx.compose.ui.graphics.vector.ImageVector

object Routes{
    const val HOME = "home"
    const val HISTORY = "history"
    const val PROFILE = "profile"
    const val RATING = "rating"
    const val HOME_TOILET_DETAIL = "home/{toiletId}"

    fun homeToiletDetail(toiletId: Int) = "home/$toiletId"
}

sealed class NavRoute(
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val hasNews: Boolean,
    val badgeCount: Int? = null,
    val route: String
) {
    data object Home : NavRoute(
        title = "Home",
        selectedIcon = Icons.Filled.LocationOn,
        unselectedIcon = Icons.Outlined.LocationOn,
        hasNews = false,
        route = Routes.HOME
    )

    data object History : NavRoute(
        title = "History",
        selectedIcon = Icons.Filled.Info,
        unselectedIcon = Icons.Outlined.Info,
        hasNews = false,
        route = Routes.HISTORY
    )

    data object Profile : NavRoute(
        title = "Profile",
        selectedIcon = Icons.Filled.Person,
        unselectedIcon = Icons.Outlined.Person,
        hasNews = false,
        route = Routes.PROFILE
    )
}

val BottomRoutes = listOf(
    NavRoute.Home,
    NavRoute.History,
    NavRoute.Profile
)
