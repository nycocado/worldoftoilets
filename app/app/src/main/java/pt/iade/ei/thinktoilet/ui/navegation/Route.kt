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
import androidx.navigation.NavType
import androidx.navigation.navArgument
import pt.iade.ei.thinktoilet.R

object AppGraph {
    val initial = RootGraph
    val auth = AuthGraph
    val main = MainGraph
    val bottomSheet = BottomSheetGraph
    val suggest = SuggestGraph
    val report = ReportGraph
    val rating = RatingGraph
    val profileEdit = ProfileEditGraph
}

object RootGraph {
    const val ROOT = "root_graph"
}

object AuthGraph {
    const val ROOT = "auth_graph"
    const val LOGIN = "login"
    const val REGISTER = "register"
}

object MainGraph {
    const val ROOT = "main_graph"
    const val HOME = "home"
    const val HOME_WITH_ARGUMENTS = "home?toiletId={toiletId}"
    val HOME_ARGUMENTS = listOf(
        navArgument("toiletId") {
            type = NavType.StringType
            defaultValue = null
            nullable = true
        }
    )
    const val HISTORY = "history"
    const val PROFILE = "profile"

    fun homeToiletDetail(toiletId: Int) = "home?toiletId=$toiletId"
}

object BottomSheetGraph {
    const val ROOT = "bottom_sheet_graph"
    const val TOILET_LIST = "toilet_list"
    const val TOILET_DETAILS = "toilet_details/{toiletId}"
    val TOILET_DETAILS_ARGUMENTS = listOf (
        navArgument("toiletId") {
            type = NavType.IntType
        }
    )

    fun toiletDetail(toiletId: Int) = "toilet_details/$toiletId"
}

object SuggestGraph {
    const val ROOT = "suggest_graph"
    const val SUGGEST_START = "suggest_start"
    const val SUGGEST_LOCATION = "suggest_location"
    const val SUGGEST_DETAILS = "suggest_details"
    const val SUGGEST_CONFIRMATION = "suggest_confirmation"
}

object ReportGraph {
    const val ROOT = "report_graph"
    const val REPORT_TOILET = "report_start/toilet/{typeId}"
    const val REPORT_COMMENT = "report_start/comment/{typeId}"
    const val REPORT_CONFIRMATION = "report_confirmation"
}

object RatingGraph {
    const val ROOT = "rating_graph"
    const val RATING = "rating/{toiletId}"

    fun rating(toiletId: Int) = "rating/$toiletId"
}

object ProfileEditGraph {
    const val ROOT = "profile_edit_graph"
    const val PROFILE_EDIT = "profile_edit"
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
        route = AppGraph.main.HOME
    ) {
        override fun getTitle(): String {
            return context.getString(R.string.home)
        }
    }

    data class History(private val context: Context) : NavRoute(
        selectedIcon = Icons.Filled.Info,
        unselectedIcon = Icons.Outlined.Info,
        hasNews = false,
        route = AppGraph.main.HISTORY
    ) {
        override fun getTitle(): String {
            return context.getString(R.string.history)
        }
    }

    data class Profile(private val context: Context) : NavRoute(
        selectedIcon = Icons.Filled.Person,
        unselectedIcon = Icons.Outlined.Person,
        hasNews = false,
        route = AppGraph.main.PROFILE
    ) {
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