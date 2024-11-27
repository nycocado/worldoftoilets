package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.models.User

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
                        progress / 100f // Altera Processo de Nivel
                    },
                    strokeCap = StrokeCap.Round,
                    color = MaterialTheme.colorScheme.primaryContainer
                )
            }
            Column {
                Text(
                    text = "Nível 2",  // Altera Processo de Nivel
                    fontWeight = FontWeight.SemiBold,
                    style = MaterialTheme.typography.titleSmall
                )
            }
        }
    }
}