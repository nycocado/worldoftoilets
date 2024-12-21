package pt.iade.ei.thinktoilet.ui.navegation

import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemColors
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

/**
 * Exibe a barra de navegação inferior da aplicação.
 *
 * @param navController [NavController] que será utilizado para navegar entre os destinos.
 * @param rootController [NavController] que será utilizado para navegar para a tela de login.
 * @param isUserLoggedInStateFlow [StateFlow] que contém um [Boolean] que indica se o usuário está logado.
 */
@Composable
fun BottomNavigationBar(
    navController: NavController = rememberNavController(),
    rootController: NavController = rememberNavController(),
    isUserLoggedInStateFlow: StateFlow<Boolean>
) {
    val currentRoute = navController.currentBackStackEntryAsState().value?.destination?.route
    val bottomRoutes = getBottomRoutes()
    var selectedItemIndex = bottomRoutes.indexOfFirst {
        currentRoute?.startsWith(it.route) == true
    }
    val isUserLoggedIn = isUserLoggedInStateFlow.collectAsState().value

    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surfaceContainerLow,
    ) {
        bottomRoutes.forEachIndexed { index, item ->
            NavigationBarItem(
                colors = NavigationBarItemColors(
                    selectedIconColor = MaterialTheme.colorScheme.onTertiaryContainer,
                    selectedTextColor = MaterialTheme.colorScheme.onSurface,
                    selectedIndicatorColor = MaterialTheme.colorScheme.tertiaryContainer,
                    unselectedIconColor = MaterialTheme.colorScheme.onSurface,
                    unselectedTextColor = MaterialTheme.colorScheme.onSurface,
                    disabledIconColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                    disabledTextColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                ),
                selected = currentRoute?.startsWith(item.route) == true,
                onClick = {
                    selectedItemIndex = index
                    if (item.route != AppGraph.main.HOME && !isUserLoggedIn) {
                        rootController.navigate(AppGraph.auth.LOGIN)
                        return@NavigationBarItem
                    }
                    navController.navigate(item.route) {
                        popUpTo(navController.graph.startDestinationRoute!!) {
                            if (item.route == AppGraph.main.HOME) {
                                inclusive = true
                            }
                        }
                        launchSingleTop = true
                    }
                },
                label = {
                    Text(
                        text = item.getTitle(),
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = if (index == selectedItemIndex) FontWeight.Bold else FontWeight.Normal,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                },
                icon = {
                    BadgedBox(
                        badge = {
                            when {
                                item.badgeCount != null -> {
                                    Badge {
                                        Text(text = item.badgeCount.toString())
                                    }
                                }

                                item.hasNews -> {
                                    Badge()
                                }
                            }
                        }
                    ) {
                        Icon(
                            imageVector = if (index == selectedItemIndex) item.selectedIcon else item.unselectedIcon,
                            contentDescription = item.getTitle()
                        )
                    }
                }
            )
        }

    }
}

@Preview(showBackground = true)
@Composable
fun BottomNavigationBarPreview() {
    BottomNavigationBar(isUserLoggedInStateFlow = MutableStateFlow(true))
}