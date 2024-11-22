package pt.iade.ei.thinktoilet.ui.pages

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.ui.components.ProfileToiletReviews
import pt.iade.ei.thinktoilet.ui.theme.AppTheme
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel

@Composable
fun ProfilePage(
    userMain: UserMain,
) {
    Column {
        Text(
            modifier = Modifier.padding(vertical = 20.dp),
            text = "Perfil",
            fontWeight = FontWeight.Bold,
            style = MaterialTheme.typography.headlineLarge
        )
        ProfileUser(userMain)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(
                    vertical = 15.dp
                ),
            horizontalArrangement = Arrangement.Center
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
        ProfileStatus(userMain.user)
        HorizontalDivider(
            modifier = Modifier
                .padding(
                    top = 30.dp,
                    bottom = 20.dp
                )
                .fillMaxWidth(1f),
            thickness = 2.dp,
            color = Color.LightGray
        )
        Text(
            text = "Suas Críticas",
            fontWeight = FontWeight.Bold,
            style = MaterialTheme.typography.headlineSmall,
            textDecoration = TextDecoration.Underline
        )
        Column {
            val localViewModel: LocalViewModel = viewModel()
            for (comment in userMain.historyComment) {
                ProfileToiletReviews(comment, localViewModel.toilets.value?.get(comment.toiletId)!!)
            }
        }
    }
}

@Composable
fun ProfileUser(userMain: UserMain) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .fillMaxWidth()
    ) {
        Image(
            modifier = Modifier
                .size(150.dp)
                .clip(CircleShape)
                .border(
                    width = 5.dp, color = Color.Gray, shape = CircleShape
                ),
            painter = painterResource(R.drawable.image_test),
            contentDescription = "Profile Icon"
        )
        Text(
            text = userMain.user.name,
            modifier = Modifier.padding(top = 10.dp),
            fontWeight = FontWeight.SemiBold,
            style = MaterialTheme.typography.titleLarge,
            maxLines = 1,
        )
        Text(
            text = userMain.email,
            modifier = Modifier.padding(5.dp),
            fontWeight = FontWeight.Normal,
            style = MaterialTheme.typography.titleMedium,
            maxLines = 1,
        )
        Text(
            modifier = Modifier.padding(top = 8.dp),
            text = userMain.user.points.toString() + " points",
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.secondary,
            style = MaterialTheme.typography.titleLarge,
            maxLines = 1,
        )
    }
}

@Composable
fun ProfileStatus(user: User) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()
    ) {
        var nivel = Int // Altera Processo de Nivel

        Text(
            text = if (user.points > 9000) {
                "Immortal"
            } else if (user.points > 8000) {
                "Legendary"
            } else if (user.points > 6000) {
                "Grandmaster"
            } else if (user.points > 4000) {
                "Master"
            } else if (user.points > 2000) {
                "Expert"
            } else if (user.points > 1000) {
                "Advanced"
            } else if (user.points > 500) {
                "Intermediate"
            } else if (user.points > 250) {
                "Apprentice"
            } else {
                "Beginning"
            },
            fontWeight = FontWeight.SemiBold,
            color = Color.Gray,
            style = MaterialTheme.typography.titleLarge
        )
        Text(
            "Progresso",
            modifier = Modifier.padding(vertical = 8.dp),
            fontWeight = FontWeight.SemiBold,
            style = MaterialTheme.typography.titleMedium
        )
        Row(
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Nível 1", // Altera Processode Nivel
                    fontWeight = FontWeight.SemiBold,
                    style = MaterialTheme.typography.titleSmall
                )
            }
            Column(
                modifier = Modifier
                    .height(25.dp)
                    .padding(horizontal = 10.dp)
            ) {
                val progress = (0..100).random().toFloat()

                LinearProgressIndicator(
                    modifier = Modifier
                        .weight(1f)
                        .height(1.dp)
                        .border(
                            width = 4.dp,
                            color = Color.Black,
                            shape = MaterialTheme.shapes.extraLarge
                        ), progress = {
                        progress / 100f // Altera Processode Nivel
                    },
                    strokeCap = StrokeCap.Round,
                    color = MaterialTheme.colorScheme.primaryContainer
                )
            }
            Column {
                Text(
                    text = "Nível 2",  // Altera Processode Nivel
                    fontWeight = FontWeight.SemiBold,
                    style = MaterialTheme.typography.titleSmall
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ProfilePagePreview() {
    AppTheme {
        ProfilePage(
            userMain = generateUserMain()
        )
    }
}