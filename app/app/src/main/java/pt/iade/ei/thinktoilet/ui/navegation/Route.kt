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
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.navigation.NavType
import androidx.navigation.navArgument
import pt.iade.ei.thinktoilet.R

object AppGraph {
    val initial = RootGraph
    val main = MainGraph
    val bottomSheet = BottomSheetGraph
    val auth = AuthGraph
    val rating = RatingGraph
    val settings = SettingsGraph
    val report = ReportGraph
    val suggest = SuggestGraph
}

object RootGraph {
    const val ROOT = "root_graph"
}

object MainGraph {
    const val ROOT = "main_graph"
    const val HOME = "main/home"
    const val HOME_WITH_ARGUMENTS = "main/home?toiletId={toiletId}"
    const val HISTORY = "main/history"
    const val PROFILE = "main/profile"
    val HOME_ARGUMENTS = listOf(
        navArgument("toiletId") {
            type = NavType.StringType
            defaultValue = null
            nullable = true
        }
    )

    fun homeToiletDetail(toiletId: Int) = "main/home?toiletId=$toiletId"
}

object BottomSheetGraph {
    const val ROOT = "bottom_sheet_graph"
    const val TOILET_LIST = "bottom_sheet/toilet/list"
    const val TOILET_DETAILS = "bottom_sheet/toilet/details/{toiletId}"
    val TOILET_DETAILS_ARGUMENTS = listOf (
        navArgument("toiletId") {
            type = NavType.IntType
        }
    )

    fun toiletDetail(toiletId: Int) = "bottom_sheet/toilet/details/$toiletId"
}

object AuthGraph {
    const val ROOT = "auth_graph"
    const val LOGIN = "auth_login"
    const val REGISTER = "auth_register"
}

object RatingGraph {
    const val ROOT = "rating_graph"
    const val RATING = "rating/{toiletId}"
    val RATING_ARGUMENTS = listOf (
        navArgument("toiletId") {
            type = NavType.IntType
        }
    )

    fun rating(toiletId: Int) = "rating/$toiletId"
}

object SettingsGraph {
    const val ROOT = "settings_graph"
    const val SETTINGS_START = "settings/start"
    const val SETTINGS_CHANGE = "settings/change/{settingId}"
    const val SETTINGS_CHANGE_EMAIL = "settings/change/email"
    const val SETTINGS_CHANGE_NAME = "settings/change/name"
    const val SETTINGS_CHANGE_PASSWORD = "settings/change/password"
    val SETTINGS_CHANGE_ARGUMENTS = listOf (
        navArgument("settingId") {
            type = NavType.StringType
        }
    )
}

object SuggestGraph {
    const val ROOT = "suggest_graph"
    const val SUGGEST_START = "suggest/start"
    const val SUGGEST_END = "suggest/end"
}

object ReportGraph {
    const val ROOT = "report_graph"
    const val REPORT = "report/{typeId}/{id}"
    const val REPORT_CONFIRMATION = "report/confirmation/{type}/{confirmation}"
    val REPORT_ARGUMENTS = listOf (
        navArgument("typeId") {
            type = NavType.StringType
        },
        navArgument("id") {
            type = NavType.IntType
        }
    )
    val REPORT_CONFIRMATION_ARGUMENTS = listOf (
        navArgument("type") {
            type = NavType.StringType
        }
    )

    fun reportToilet(toiletId: Int) = "report/toilet/$toiletId"
    fun reportComment(commentId: Int) = "report/comment/$commentId"
    fun reportConfirmation(type: String, confirmation: String) = "report/confirmation/$type/$confirmation"
}

sealed class NavRoute(
    val selectedIcon: Int,
    val unselectedIcon: Int,
    val hasNews: Boolean,
    val badgeCount: Int? = null,
    val route: String
) {
    abstract fun getTitle(): String

    data class Home(private val context: Context) : NavRoute(
        selectedIcon = R.drawable.location_on_filled_24px,
        unselectedIcon = R.drawable.location_on_24px,
        hasNews = false,
        route = AppGraph.main.HOME
    ) {
        override fun getTitle(): String {
            return context.getString(R.string.home)
        }
    }

    data class History(private val context: Context) : NavRoute(
        selectedIcon = R.drawable.history_24px,
        unselectedIcon = R.drawable.history_24px,
        hasNews = false,
        route = AppGraph.main.HISTORY
    ) {
        override fun getTitle(): String {
            return context.getString(R.string.history)
        }
    }

    data class Profile(private val context: Context) : NavRoute(
        selectedIcon = R.drawable.account_circle_filled_24px,
        unselectedIcon = R.drawable.account_circle_24px,
        hasNews = false,
        route = AppGraph.main.PROFILE
    ) {
        override fun getTitle(): String {
            return context.getString(R.string.profile)
        }
    }
}

@Composable
fun getBottomRoutes(): List<NavRoute> {
    val context: Context = LocalContext.current
    return listOf(
        NavRoute.Home(context),
        NavRoute.History(context),
        NavRoute.Profile(context)
    )
}