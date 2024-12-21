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
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.NavType
import androidx.navigation.navArgument
import pt.iade.ei.thinktoilet.R

/**
* Define os grafos de navegação da aplicação.
*
* @property initial [RootGraph] grafo de navegação raiz.
* @property main [MainGraph] grafo de navegação principal.
* @property bottomSheet [BottomSheetGraph] grafo de navegação do BottomSheet.
* @property auth [AuthGraph] grafo de navegação da autenticação.
* @property rating [RatingGraph] grafo de navegação da avaliação.
* @property settings [SettingsGraph] grafo de navegação das definições.
* @property report [ReportGraph] grafo de navegação do relatório.
* @property suggest [SuggestGraph] grafo de navegação da sugestão.
*/
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

/**
* Define o grafo de navegação raiz.
* @property ROOT [String] que representa o grafo de navegação raiz.
*/
object RootGraph {
    const val ROOT = "root_graph"
}

/**
* Define o grafo de navegação principal.
 * @property ROOT [String] que representa o grafo de navegação principal.
 * @property HOME [String] que representa o destino da página inicial.
 * @property HOME_WITH_ARGUMENTS [String] que representa o destino da página inicial com argumentos.
 * @property HOME_ARGUMENTS [List] que contém os argumentos do destino da página inicial.
 * @property HISTORY [String] que representa o destino do histórico.
 * @property PROFILE [String] que representa o destino do perfil.
 * @property homeToiletDetail função que retorna um [String] com o destino da página inicial com argumentos.
*/
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

    /**
     * Retorna o destino da página inicial com argumentos.
     *
     * @param toiletId [Int] que representa o identificador da casa de banho.
     * @return [String] que representa o destino da página inicial com argumentos.
     */
    fun homeToiletDetail(toiletId: Int) = "home?toiletId=$toiletId"
}

/**
 * Define o grafo de navegação do BottomSheet.
 *
 * @property ROOT [String] que representa o grafo de navegação do BottomSheet.
 * @property TOILET_LIST [String] que representa o destino da lista de casas de banho.
 * @property TOILET_DETAILS [String] que representa o destino dos detalhes de uma casa de banho.
 * @property TOILET_DETAILS_ARGUMENTS [List] que contém os argumentos do destino dos detalhes de uma casa de banho.
 * @property toiletDetail função que retorna um [String] com o destino dos detalhes de uma casa de banho.
 */
object BottomSheetGraph {
    const val ROOT = "bottom_sheet_graph"
    const val TOILET_LIST = "toilet_list"
    const val TOILET_DETAILS = "toilet_details/{toiletId}"
    val TOILET_DETAILS_ARGUMENTS = listOf (
        navArgument("toiletId") {
            type = NavType.IntType
        }
    )

    /**
     * Retorna o destino dos detalhes de uma casa de banho.
     *
     * @param toiletId [Int] que representa o identificador da casa de banho.
     * @return [String] que representa o destino dos detalhes de uma casa de banho.
     */
    fun toiletDetail(toiletId: Int) = "toilet_details/$toiletId"
}

/**
 * Define o grafo de navegação da autenticação.
 *
 * @property ROOT [String] que representa o grafo de navegação da autenticação.
 * @property LOGIN [String] que representa o destino do login.
 * @property REGISTER [String] que representa o destino do registo.
 */
object AuthGraph {
    const val ROOT = "auth_graph"
    const val LOGIN = "login"
    const val REGISTER = "register"
}

/**
 * Define o grafo de navegação da avaliação.
 *
 * @property ROOT [String] que representa o grafo de navegação da avaliação.
 * @property RATING [String] que representa o destino da avaliação.
 * @property RATING_ARGUMENTS [List] que contém os argumentos do destino da avaliação.
 * @property rating função que retorna um [String] com o destino da avaliação.
 */
object RatingGraph {
    const val ROOT = "rating_graph"
    const val RATING = "rating/{toiletId}"
    val RATING_ARGUMENTS = listOf (
        navArgument("toiletId") {
            type = NavType.IntType
        }
    )

    /**
     * Retorna o destino da avaliação.
     *
     * @param toiletId [Int] que representa o identificador da casa de banho.
     * @return [String] que representa o destino da avaliação.
     */
    fun rating(toiletId: Int) = "rating/$toiletId"
}

/**
 * Define o grafo de navegação das definições.
 *
 * @property ROOT [String] que representa o grafo de navegação das definições.
 * @property SETTINGS [String] que representa o destino das definições.
 */
object SettingsGraph {
    const val ROOT = "settings_graph"
    const val SETTINGS = "settings"
}

/**
 * Define o grafo de navegação da sugestão.
 *
 * @property ROOT [String] que representa o grafo de navegação da sugestão.
 * @property SUGGEST_START [String] que representa o destino do início da sugestão.
 * @property SUGGEST_LOCATION [String] que representa o destino da localização da sugestão.
 * @property SUGGEST_DETAILS [String] que representa o destino dos detalhes da sugestão.
 * @property SUGGEST_CONFIRMATION [String] que representa o destino da confirmação da sugestão.
 */
object SuggestGraph {
    const val ROOT = "suggest_graph"
    const val SUGGEST_START = "suggest_start"
    const val SUGGEST_LOCATION = "suggest_location"
    const val SUGGEST_DETAILS = "suggest_details"
    const val SUGGEST_CONFIRMATION = "suggest_confirmation"
}

/**
 * Define o grafo de navegação do relatório.
 *
 * @property ROOT [String] que representa o grafo de navegação do relatório.
 * @property REPORT_TOILET [String] que representa o destino do início do relatório de uma casa de banho.
 * @property REPORT_COMMENT [String] que representa o destino do início do relatório de um comentário.
 * @property REPORT_CONFIRMATION [String] que representa o destino da confirmação do relatório.
 */
object ReportGraph {
    const val ROOT = "report_graph"
    const val REPORT_TOILET = "report_start/toilet/{typeId}"
    const val REPORT_COMMENT = "report_start/comment/{typeId}"
    const val REPORT_CONFIRMATION = "report_confirmation"
}

/**
 * Define as rotas de navegação da navbar.
 *
 * @property selectedIcon [ImageVector] que representa o ícone selecionado.
 * @property unselectedIcon [ImageVector] que representa o ícone não selecionado.
 * @property hasNews [Boolean] que representa se tem novidades.
 * @property badgeCount [Int] que representa a quantidade de notificações.
 * @property route [String] que representa a rota.
 */
sealed class NavRoute(
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
    val hasNews: Boolean,
    val badgeCount: Int? = null,
    val route: String
) {
    /**
     * Retorna o título da rota.
     *
     * @return [String] que representa o título da rota.
     */
    abstract fun getTitle(): String

    /**
     * Rota da página inicial.
     *
     * @param context [Context] que representa o contexto da aplicação.
     *
     * @property selectedIcon [ImageVector] que representa o ícone selecionado.
     * @property unselectedIcon [ImageVector] que representa o ícone não selecionado.
     * @property hasNews [Boolean] que representa se tem novidades.
     * @property route [String] que representa a rota.
     */
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

    /**
     * Rota do histórico.
     *
     * @param context [Context] que representa o contexto da aplicação.
     *
     * @property selectedIcon [ImageVector] que representa o ícone selecionado.
     * @property unselectedIcon [ImageVector] que representa o ícone não selecionado.
     * @property hasNews [Boolean] que representa se tem novidades.
     * @property route [String] que representa a rota.
     */
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

    /**
     * Rota do perfil.
     *
     * @param context [Context] que representa o contexto da aplicação.
     *
     * @property selectedIcon [ImageVector] que representa o ícone selecionado.
     * @property unselectedIcon [ImageVector] que representa o ícone não selecionado.
     * @property hasNews [Boolean] que representa se tem novidades.
     * @property route [String] que representa a rota.
     */
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

/**
 * Retorna as rotas de navegação da navbar.
 *
 * @return [List] que contém as rotas de navegação da navbar.
 */
@Composable
fun getBottomRoutes(): List<NavRoute> {
    val context: Context = LocalContext.current
    return listOf(
        NavRoute.Home(context),
        NavRoute.History(context),
        NavRoute.Profile(context)
    )
}