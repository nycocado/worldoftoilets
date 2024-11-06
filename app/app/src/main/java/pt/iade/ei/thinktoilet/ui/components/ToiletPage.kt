package pt.iade.ei.thinktoilet.ui.components

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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.test.generateRandomToiletWithComments
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@Composable
fun ToiletPage(toilet: Toilet) {
    Column(
        modifier = Modifier.padding(16.dp)
    ) {
        Text(
            text = toilet.name,
            fontWeight = FontWeight.SemiBold,
            fontSize = 28.sp
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
                fontWeight = FontWeight.SemiBold,
                fontSize = 16.sp
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
                    fontWeight = FontWeight.Medium,
                    fontSize = 16.sp
                )
            }
            Column {
                Button(
                    onClick = { /* TODO */ },
                    colors = ButtonColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer,
                        contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
                        disabledContainerColor = MaterialTheme.colorScheme.primaryContainer,
                        disabledContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                ) {
                    Text(
                        text = "Ir para o Maps",
                        fontWeight = FontWeight.Medium,
                        fontSize = 16.sp
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
            onClick = { /* TODO */ },
            colors = ButtonColors(
                containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                contentColor = MaterialTheme.colorScheme.onTertiaryContainer,
                disabledContainerColor = MaterialTheme.colorScheme.tertiaryContainer.copy(alpha = 0.5f),
                disabledContentColor = MaterialTheme.colorScheme.onTertiaryContainer.copy(alpha = 0.5f)
            )
        ) {
            Text(
                text = "Avaliar",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp
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
                    end = 6.dp,
                ),
                text = "Avaliações",
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp
            )
            Text(
                text = toilet.comments.size.toString(),
                fontWeight = FontWeight.Medium,
                fontSize = 14.sp,
                color = Color.Gray
            )
        }
        for (comment in toilet.comments) {
            Comment(comment = comment)
        }
    }
}


@Preview(showBackground = true)
@Composable
fun ToiletPagePreview() {
    AppTheme (
        dynamicColor = false
    ){
        ToiletPage(
            toilet = generateRandomToiletWithComments(5)
        )
    }
}
