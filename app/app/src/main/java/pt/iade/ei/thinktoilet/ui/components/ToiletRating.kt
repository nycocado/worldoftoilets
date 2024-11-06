package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.test.generateRandomToilet

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
                    fontWeight = FontWeight.Bold,
                    fontSize = 50.sp
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
                rating = toilet.ratingCategory.clean,
                text = "Limpeza"
            )
            ProgressBar(
                rating = toilet.ratingCategory.paper,
                text = "Papel"
            )
            ProgressBar(
                rating = toilet.ratingCategory.structure,
                text = "Estrutura"
            )
            ProgressBar(
                rating = toilet.ratingCategory.accessibility,
                text = "Acessibilidade"
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ToiletRatingPreview() {
    ToiletRating(
        toilet = generateRandomToilet()
    )
}