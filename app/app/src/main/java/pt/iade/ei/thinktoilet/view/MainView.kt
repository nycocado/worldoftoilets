package pt.iade.ei.thinktoilet.view

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.launch
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
    val scope = rememberCoroutineScope()
    CheckAndRequestLocationPermission(
        onPermissionGranted = {
            scope.launch { localViewModel.loadLocation(true) }
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