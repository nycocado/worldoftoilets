package pt.iade.ei.thinktoilet.ui.components

import android.annotation.SuppressLint
import android.content.Context
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.tests.generateRandomToilet
import pt.iade.ei.thinktoilet.ui.theme.AppTheme


         /**
         * Exibe as avaliações de um Toilet em um sistema visual.
         *
         * @param context Contexto da aplicação, necessário para carregar recursos e exibir informações.
         * @param toilet Objeto que contém as informações do toilet, incluindo as notas e critérios de avaliação.
         *
         * Esta função tem como objetivo:
         * - Mostrar a média das notas atribuídas ao toilet.
         * - Detalhar os valores correspondentes a cada critério de avaliação, permitindo uma análise detalhada.
         *
         * Exemplo de uso:
         * ```kotlin
         * ToiletRating(
         *     toilet = Toilet,
         *     context = LocalContext.current
         * )
         *  ```
         */
@SuppressLint("DefaultLocale")
@Composable
fun ToiletRating(
    toilet: Toilet,
    context: Context
) {
    Row(
        modifier = Modifier.padding(horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(
            modifier = Modifier.padding(end = 14.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row {
                Text(
                    text = "%.1f".format(toilet.getAverageRating()),
                    style = MaterialTheme.typography.displayLarge,
                    fontWeight = FontWeight.Bold
                )
            }
            Row {
                Stars(
                    rating = toilet.getAverageRating(), size = 20.dp
                )
            }
        }
        Column {
            ProgressBar(
                progress = toilet.rating.clean,
                text = String.format("%.1f", toilet.rating.clean) + " " + context.getString(R.string.clean)
            )
            ProgressBar(
                progress = toilet.rating.structure,
                text = String.format("%.1f", toilet.rating.structure) + " " + context.getString(R.string.structure)
            )
            ProgressBar(
                progress = toilet.rating.accessibility,
                text = String.format("%.1f", toilet.rating.accessibility) + " " + context.getString(R.string.accessibility)
            )
            ProgressBar(
                progress = toilet.rating.paper,
                text = String.format("%.0f", toilet.rating.paper) + "% " + context.getString(R.string.paper),
                maxValue = 100f
            )
        }
    }
}
@Composable
@Preview
fun PreviewToiletRating() {
    AppTheme {
        ToiletRating(
            toilet = generateRandomToilet(),
            context = androidx.compose.ui.platform.LocalContext.current
        )
    }
}