package pt.iade.ei.thinktoilet.ui.components

import android.annotation.SuppressLint
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.models.Toilet

@SuppressLint("DefaultLocale")
@Composable
fun ToiletRating(toilet: Toilet) {
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
                text = String.format("%.1f", toilet.rating.clean) + " Limpeza"
            )

            ProgressBar(
                progress = toilet.rating.structure,
                text = String.format("%.1f", toilet.rating.structure) + " Estrutura"
            )
            ProgressBar(
                progress = toilet.rating.accessibility,
                text = String.format("%.1f", toilet.rating.accessibility) + " Acessibilidade"
            )
            ProgressBar(
                progress = toilet.rating.paper,
                text = String.format("%.0f", toilet.rating.paper) + "% Papel",
                maxValue = 100f
            )
        }
    }
}