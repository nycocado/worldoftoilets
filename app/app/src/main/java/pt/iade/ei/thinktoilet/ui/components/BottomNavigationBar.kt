package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import pt.iade.ei.thinktoilet.models.BottomNavigationItem

@Composable
fun BottomNavigationBar(navController: NavController) {
    val currentRoute = navController.currentBackStackEntryAsState().value?.destination?.route
    val bottomNavigationItems = bottomNavigationItems()
    var selectedItemIndex by rememberSaveable {
        mutableIntStateOf(0)
    }

    NavigationBar {
        bottomNavigationItems.forEachIndexed { index, item ->
            NavigationBarItem(
                selected = currentRoute == item.router,
                onClick = {
                    selectedItemIndex = index
                    navController.navigate(item.router) {
                        popUpTo(navController.graph.startDestinationId) { saveState = true }
                        launchSingleTop = true
                        restoreState = true
                    }
                },
                label = { Text(text = item.title) },
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
                            contentDescription = item.title
                        )
                    }
                }
            )
        }
    }
}

@Composable
fun bottomNavigationItems(): List<BottomNavigationItem> {
    val items = listOf(
        BottomNavigationItem(
            title = "Home",
            selectedIcon = Icons.Filled.LocationOn,
            unselectedIcon = Icons.Outlined.LocationOn,
            hasNews = false,
            router = "home"
        ), BottomNavigationItem(
            title = "Histórico",
            selectedIcon = Icons.Filled.Info,
            unselectedIcon = Icons.Outlined.Info,
            hasNews = false,
            router = "history"
        ), BottomNavigationItem(
            title = "Perfil",
            selectedIcon = Icons.Filled.Person,
            unselectedIcon = Icons.Outlined.Person,
            hasNews = true,
            router = "profile"
        )
    )
    return items
}