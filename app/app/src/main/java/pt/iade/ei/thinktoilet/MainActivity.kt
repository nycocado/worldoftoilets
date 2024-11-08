package pt.iade.ei.thinktoilet

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import pt.iade.ei.thinktoilet.ui.components.BottomNavigationBar
import pt.iade.ei.thinktoilet.ui.screens.HistoryScreen
import pt.iade.ei.thinktoilet.ui.screens.HomeScreen
import pt.iade.ei.thinktoilet.ui.screens.ProfileScreen
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            AppTheme(
                dynamicColor = false
            ) {
                MainView()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainView() {
    val navController = rememberNavController()

    Scaffold(
        bottomBar = {
            BottomNavigationBar(navController)
        }
    ) { innerPadding ->
        Box(
            Modifier
                .padding(innerPadding)
        ) {
            NavHost(
                navController = navController,
                startDestination = "home"
            ) {
                composable("home") { HomeScreen(navController) }
                composable("history") { HistoryScreen(navController) }
                composable("profile") { ProfileScreen(navController) }
                composable("toilet_detail/{toiletID}") { backStackEntry ->
                    HomeScreen(
                        navController = navController,
                        initialToiletID = backStackEntry.arguments?.getString("toiletID")?.toInt()
                    )
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun MainViewPreview() {
    MainView()
}
