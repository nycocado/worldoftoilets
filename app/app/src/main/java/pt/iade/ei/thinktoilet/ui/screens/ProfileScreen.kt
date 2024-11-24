package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import pt.iade.ei.thinktoilet.ui.components.ToiletReview
import pt.iade.ei.thinktoilet.ui.pages.ProfilePage
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel

@Composable
fun ProfileScreen(
    navController: NavController = rememberNavController(),
    localViewModel: LocalViewModel = viewModel()
) {
    val userMain = localViewModel.userMain.value!!
    val comments = localViewModel.commentsUser.observeAsState().value?.filter { it.userId == userMain.user.id }.orEmpty()

    if (comments.isEmpty()) {
        localViewModel.getUserComments(userMain.user.id!!)
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
    ) {
        LazyColumn {
            item {
                ProfilePage(
                    userMain = localViewModel.userMain.value!!,
                )
            }
            if (comments.isEmpty()) {
                item {
                    CircularProgressIndicator(modifier = Modifier.padding(16.dp))
                }
            } else {
                items(comments) { comment ->
                    val toilet = localViewModel.toilets.value?.find { it.id == comment.toiletId }
                    if(toilet != null){
                        ToiletReview(
                            comment = comment,
                            toilet = toilet
                        )
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ProfileScreenPreview() {
    ProfileScreen()
}
