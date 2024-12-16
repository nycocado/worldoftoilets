package pt.iade.ei.thinktoilet.view

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import pt.iade.ei.thinktoilet.ui.navegation.BottomNavigationBar
import pt.iade.ei.thinktoilet.ui.navegation.MainNavigationGraph
import pt.iade.ei.thinktoilet.ui.permission.CheckAndRequestLocationPermission
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel

@Composable
fun MainView(
    rootController: NavController,
    localViewModel: LocalViewModel,
    navController: NavHostController = rememberNavController()
) {
    CheckAndRequestLocationPermission(
        onPermissionGranted = {
            localViewModel.loadLocation(true)
        },
        onPermissionDenied = {
            // Não vai carregar os banheiros próximos
        }
    )

    Scaffold(
        bottomBar = {
            BottomNavigationBar(navController, rootController, localViewModel.isUserLoggedIn)
        }
    ) { innerPadding ->
        Box(
            Modifier
                .padding(innerPadding)
        ) {
            MainNavigationGraph(navController, rootController, localViewModel)
        }

    }
}