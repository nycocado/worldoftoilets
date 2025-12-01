package com.worldoftoilets.app.ui.navegation

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
import androidx.compose.runtime.getValue
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavController
import androidx.navigation.NavDestination.Companion.hasRoute
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.worldoftoilets.app.ui.theme.AppTheme
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

@Composable
fun BottomNavigationBar(
    navController: NavController = rememberNavController(),
    rootController: NavController = rememberNavController(),
    isLoggedInStateFlow: StateFlow<Boolean?>
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    val bottomRoutes = getBottomRoutes()
    val isLoggedIn = isLoggedInStateFlow.collectAsState().value == true

    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surfaceContainerLow,
    ) {
        bottomRoutes.forEach { item ->
            val isSelected = currentDestination?.hasRoute(item.routeClass) == true

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
                selected = isSelected,
                onClick = {
                    // Check login only for non-Home routes if strict login required, 
                    // but here logical check from original code:
                    // if (item.route != AppGraph.main.HOME && !isLoggedIn)
                    // Translated to class check:
                    val isHome = item.routeClass == AppDestinations.Home::class
                    if (!isHome && !isLoggedIn) {
                        rootController.navigate(AppDestinations.Login)
                        return@NavigationBarItem
                    }

                    navController.navigate(item.destination) {
                        // Pop up to the start destination of the graph to
                        // avoid building up a large stack of destinations
                        // on the back stack as users select items
                        popUpTo(navController.graph.findStartDestination().id) {
                            saveState = true
                        }
                        // Avoid multiple copies of the same destination when
                        // reselecting the same item
                        launchSingleTop = true
                        // Restore state when reselecting a previously selected item
                        restoreState = true
                    }
                },
                label = {
                    Text(
                        text = item.getTitle(),
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
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
                            imageVector = if (isSelected)
                                item.selectedIcon
                            else
                                item.unselectedIcon,
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
    AppTheme {
        BottomNavigationBar(isLoggedInStateFlow = MutableStateFlow(true))
    }
}