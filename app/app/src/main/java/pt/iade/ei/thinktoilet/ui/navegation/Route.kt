package pt.iade.ei.thinktoilet.ui.navegation

import android.content.Context
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.Person
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector
import pt.iade.ei.thinktoilet.R

object Routes{
    const val HOME = "home"
    const val HISTORY = "history"
    const val PROFILE = "profile"
    const val RATING = "rating/{toiletId}"
    const val HOME_TOILET_DETAIL = "home/{toiletId}"

    fun homeToiletDetail(toiletId: Int) = "home/$toiletId"
    fun rating(toiletId: Int) = "rating/$toiletId"
}

sealed class NavRoute(
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val hasNews: Boolean,
    val badgeCount: Int? = null,
    val route: String
) {
    abstract fun getTitle(): String

    data class Home(private val context: Context) : NavRoute(
        selectedIcon = Icons.Filled.LocationOn,
        unselectedIcon = Icons.Outlined.LocationOn,
        hasNews = false,
        route = Routes.HOME
    ) {
        override fun getTitle(): String {
            return context.getString(R.string.home)
        }
    }

    data class History(private val context: Context) : NavRoute(
        selectedIcon = Icons.Filled.Info,
        unselectedIcon = Icons.Outlined.Info,
        hasNews = false,
        route = Routes.HISTORY
    ){
        override fun getTitle(): String {
            return context.getString(R.string.history)
        }
    }

    data class Profile(private val context: Context) : NavRoute(
        selectedIcon = Icons.Filled.Person,
        unselectedIcon = Icons.Outlined.Person,
        hasNews = false,
        route = Routes.PROFILE
    ){
        override fun getTitle(): String {
            return context.getString(R.string.profile)
        }
    }
}

@Composable
fun getBottomRoutes(context: Context): List<NavRoute> {
    return listOf(
        NavRoute.Home(context),
        NavRoute.History(context),
        NavRoute.Profile(context)
    )
}