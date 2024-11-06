package pt.iade.ei.thinktoilet

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import pt.iade.ei.thinktoilet.ui.components.BottomNavigationBar
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
                composable("home") { HomeScreen() }
                composable("history") { HistoryScreen() }
                composable("profile") { ProfileScreen() }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun MainViewPreview() {
    MainView()
}
