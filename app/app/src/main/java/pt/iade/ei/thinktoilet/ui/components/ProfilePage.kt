package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.ui.theme.AppTheme
import pt.iade.ei.thinktoilet.viewmodels.LocalViewModel


@Composable

fun ProfilePage(
    user: UserMain,
    viewModel: LocalViewModel = viewModel(),
    navController: NavController = rememberNavController(),
) {
    Column {
        Row {
            Text(
                text = "Perfil",
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.headlineLarge
            )
        }
        Row {Profile(generateUserMain())
        }
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(
                    vertical = 15.dp
                ), horizontalArrangement = Arrangement.Center
        ) {
            Button(
                onClick = {
                    println("Botão de editar perfil pressionado")
                }, colors = ButtonColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
                    disabledContainerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f),
                    disabledContentColor = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.5f)
                )
            ) {
                Text(
                    text = "Editar Perfil",
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Bold
                )
            }
        }
        Row {
            ProfileStatus(generateUserMain())
        }
        HorizontalDivider(
            modifier = Modifier
                .padding(top = 24.dp)
                .fillMaxWidth(1f),
            thickness = 2.dp,
            color = Color.LightGray
        )
        Row {
            Column {
                Row {
                    Text(
                        text = "Suas Críticas",
                        modifier = Modifier.padding(vertical = 12.dp),
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.headlineSmall,
                        textDecoration = TextDecoration.Underline
                    )
                }

                    //generateToiletReviewsList()
                    for(comment in user.historyComment) {
                        ProfileToiletReviews(comment, viewModel.getToiletById(comment.toiletId!!)!!)
                    }
            }

        }
    }
}

@Preview(showBackground = true)
@Composable
fun ProfilePagePreview() {
    AppTheme {
        ProfilePage(
            user = generateUserMain()
        )
    }
}