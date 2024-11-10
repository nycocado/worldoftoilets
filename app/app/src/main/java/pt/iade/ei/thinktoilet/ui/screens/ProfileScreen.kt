package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.ui.components.ProfilePage
import pt.iade.ei.thinktoilet.viewmodels.LocalViewModel

@Composable
fun ProfileScreen(navController: NavController = rememberNavController()) {
    val viewModel: LocalViewModel = viewModel()

    Box(
        modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp)
    ) {
        LazyColumn {
            item {
                ProfilePage(
                    user = viewModel.user,
                    viewModel = viewModel,
                    navController = navController
                )
            }
        }
    }
}


@Preview(showBackground = true)
@Composable
fun ProfileScreenPreview() {
    ProfileScreen()
}
