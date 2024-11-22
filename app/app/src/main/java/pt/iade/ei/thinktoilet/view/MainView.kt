package pt.iade.ei.thinktoilet.view

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import pt.iade.ei.thinktoilet.ui.navegation.BottomNavigationBar
import pt.iade.ei.thinktoilet.ui.navegation.MainNavigation
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel

val LocalMainNavController =
    compositionLocalOf<NavHostController> { error("NavHostController ERRO") }

@Composable
fun MainView() {
    val navController = rememberNavController()
    val localViewModel: LocalViewModel = hiltViewModel<LocalViewModel>()

    CompositionLocalProvider(
        LocalMainNavController provides navController
    ) {
        Scaffold(
            bottomBar = {
                Column{
                    BottomNavigationBar(navController)
                }
            }
        ) { innerPadding ->
            Box(
                Modifier
                    .padding(innerPadding)
            ) {
                MainNavigation(navController, localViewModel)
            }
        }
    }
}