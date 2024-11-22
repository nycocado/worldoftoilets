package pt.iade.ei.thinktoilet.ui.pages

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.tests.generateRandomToilet
import pt.iade.ei.thinktoilet.ui.components.Comment
import pt.iade.ei.thinktoilet.ui.components.ProgressBar
import pt.iade.ei.thinktoilet.ui.components.Stars
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@Composable
fun ToiletPage(
    toilet: Toilet,
    onClick: () -> Unit = {}
) {
    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier.padding(16.dp)
    ) {
        Text(
            text = toilet.name,
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold
        )
        Row(
            modifier = Modifier.padding(
                top = 4.dp,
                bottom = 14.dp
            ),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Stars(
                rating = toilet.getAverageRating(), size = 22.dp
            )
            Text(
                modifier = Modifier.padding(horizontal = 4.dp),
                text = "%.1f".format(toilet.getAverageRating()),
                fontStyle = MaterialTheme.typography.bodyMedium.fontStyle,
                fontWeight = FontWeight.SemiBold
            )
        }
        Card(
            shape = MaterialTheme.shapes.large
        ) {
            Image(
                painter = painterResource(R.drawable.toilet_placeholder),
                contentDescription = "Imagem da casa de banho",
            )
        }
        Row(
            modifier = Modifier.padding(vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = toilet.address,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium
                )
            }
            Column {
                Button(
                    onClick = { },
                    colors = ButtonColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer,
                        contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
                        disabledContainerColor = MaterialTheme.colorScheme.primaryContainer.copy(
                            alpha = 0.5f
                        ),
                        disabledContentColor = MaterialTheme.colorScheme.onPrimaryContainer.copy(
                            alpha = 0.5f
                        )
                    )
                ) {
                    Text(
                        text = "Ir para o Maps",
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
        ToiletRating(toilet = toilet)
        Button(
            modifier = Modifier
                .fillMaxWidth()
                .padding(
                    top = 16.dp,
                    bottom = 8.dp
                ),
            onClick = { scope.launch { onClick() } },
            colors = ButtonColors(
                containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                contentColor = MaterialTheme.colorScheme.onTertiaryContainer,
                disabledContainerColor = MaterialTheme.colorScheme.tertiaryContainer.copy(alpha = 0.5f),
                disabledContentColor = MaterialTheme.colorScheme.onTertiaryContainer.copy(alpha = 0.5f)
            )
        ) {
            Text(
                text = "Avaliar",
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Bold,
            )
        }
        Row(
            modifier = Modifier.padding(
                bottom = 8.dp
            ),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                modifier = Modifier.padding(
                    end = 10.dp,
                ),
                text = "Avaliações",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
            )
            Text(
                text = toilet.numComments.toString(),
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Medium,
                color = Color.Gray
            )
        }
        for (comment in toilet.comments) {
            Comment(comment = comment)
        }
    }
}

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
                text = "Limpeza"
            )
            ProgressBar(
                progress = toilet.rating.paper,
                text = "Papel"
            )
            ProgressBar(
                progress = toilet.rating.structure,
                text = "Estrutura"
            )
            ProgressBar(
                progress = toilet.rating.accessibility,
                text = "Acessibilidade"
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ToiletPagePreview() {
    AppTheme {
        ToiletPage(
            toilet = generateRandomToilet(numComments = 10)
        )
    }
}
