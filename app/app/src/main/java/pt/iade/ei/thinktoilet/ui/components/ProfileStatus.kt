package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.ui.theme.AppTheme


@Composable
fun ProfileStatus(userMain: UserMain) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()
    ) {
        var nivel = Int // Altera Processode Nivel

            Text(
                text = if (userMain.points > 9000) {
                    "Immortal"
                } else if (userMain.points > 8000) {
                    "Legendary"
                } else if (userMain.points > 6000) {
                    "Grandmaster"
                } else if (userMain.points > 4000) {
                    "Master"
                } else if (userMain.points > 2000) {
                    "Expert"
                } else if (userMain.points > 1000) {
                    "Advanced"
                } else if (userMain.points > 500) {
                    "Intermediate"
                } else if (userMain.points > 250) {
                    "Apprentice"
                } else {
                    "Beginning"
                },
                modifier = Modifier.padding(bottom = 5.dp),
                fontWeight = FontWeight.SemiBold,
                color = Color.Gray,
                style = MaterialTheme.typography.headlineSmall
            )
            Text(
                "Progresso",
                modifier = Modifier.padding(
                    top = 4.dp,
                    bottom = 8.dp
                ),
                fontWeight = FontWeight.SemiBold,
                style = MaterialTheme.typography.titleMedium
            )
        Row(
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                    Text(
                        modifier = Modifier.padding(
                            end = 8.dp
                        ),
                        text = "Nível 1", // Altera Processode Nivel
                        fontWeight = FontWeight.SemiBold,
                        style = MaterialTheme.typography.titleSmall
                    )
            }
            Column(
                modifier = Modifier
                    .height(25.dp)
            ) {
                val progress = (0..100).random().toFloat()

                LinearProgressIndicator(
                    modifier = Modifier
                        .weight(1f)
                        .height(1.dp)
                        .border(
                            width = 4.dp, color = Color.Black, shape = MaterialTheme.shapes.extraLarge
                        ), progress = {
                        progress / 100f // Altera Processode Nivel
                    },
                    strokeCap = StrokeCap.Round,
                    color = MaterialTheme.colorScheme.primaryContainer
                )
            }
            Column {

                    Text(
                        modifier = Modifier.padding(start = 8.dp),
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
fun PreviewProfileStatus() {
    AppTheme {
    ProfileStatus(generateUserMain())
    }
}