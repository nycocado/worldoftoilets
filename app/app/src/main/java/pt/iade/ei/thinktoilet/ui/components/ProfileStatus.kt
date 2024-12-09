package pt.iade.ei.thinktoilet.ui.components

import android.content.Context
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ProgressIndicatorDefaults.drawStopIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.tests.generateUserMain

         /**
         * Exibe o status do perfil do usuário.
         *
         * @param user Objeto que contém as informações do usuário a serem exibidas.
         * @param context Contexto da aplicação.
         *
         * Esta função exibe o status do perfil do usuário, incluindo
         * nível e progresso.
         *
         * Exemplo de uso:
         * ```
         * ProfileStatus(
         *     user = user,
         *     context = context
         * )
         * ```
         */
@Composable
fun ProfileStatus(
    user: User,
    context: Context = LocalContext.current
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()
    ) {
        var nivel = Int

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
            text = context.getString(R.string.progress),
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
                    text = context.getString(R.string.level) + " 1",
                    fontWeight = FontWeight.SemiBold,
                    style = MaterialTheme.typography.titleSmall
                )
            }
            Column(
                modifier = Modifier
                    .height(20.dp)
                    .padding(horizontal = 10.dp)
            ) {
                val progress = (0..100).random().toFloat()

                LinearProgressIndicator(
                    modifier = Modifier
                        .weight(1f),
                    progress = {
                        progress / 100f
                    },
                    strokeCap = StrokeCap.Round,
                    color = MaterialTheme.colorScheme.secondary,
                    trackColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.2f),
                    drawStopIndicator = {
                        drawStopIndicator(
                            drawScope = this,
                            stopSize = 0.dp,
                            color = Color.Transparent,
                            strokeCap = StrokeCap.Round
                        )
                    }
                )
            }
            Column {
                Text(
                    text = context.getString(R.string.level) + " 2",
                    fontWeight = FontWeight.SemiBold,
                    style = MaterialTheme.typography.titleSmall
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ProfileStatusPreview() {
    ProfileStatus(
        user = generateUserMain()
    )
}