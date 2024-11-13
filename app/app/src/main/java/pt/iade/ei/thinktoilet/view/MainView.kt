package pt.iade.ei.thinktoilet.view

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import pt.iade.ei.thinktoilet.ui.navegation.BottomNavigationBar
import pt.iade.ei.thinktoilet.ui.navegation.MainNavigation
import pt.iade.ei.thinktoilet.viewmodels.LocalViewModel

val LocalMainNavController = compositionLocalOf<NavHostController> { error("NavHostController ERRO") }

@Composable
fun MainView() {
    val navController = rememberNavController()
    val viewModel: LocalViewModel = viewModel()

    CompositionLocalProvider (
        LocalMainNavController provides navController
    ){
        Scaffold(
            bottomBar = {
                BottomNavigationBar(navController)
            }
        ) { innerPadding ->
            Box(
                Modifier
                    .padding(innerPadding)
            ) {
                MainNavigation(navController, viewModel)
            }
        }
    }
}