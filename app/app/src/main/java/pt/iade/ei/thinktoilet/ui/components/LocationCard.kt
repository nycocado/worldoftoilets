package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.distanceToString
import pt.iade.ei.thinktoilet.test.generateRandomToilet

@Composable
fun LocationCard(
    toilet: Toilet,
    distance: Double,
    onClick: (Toilet) -> Unit
) {
    val scope = rememberCoroutineScope()

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(
                horizontal = 20.dp,
                vertical = 8.dp
            )
            .clickable {
                scope.launch {
                    onClick(toilet)
                }
            }
            .border(
                width = 2.dp,
                color = Color.LightGray,
                shape = MaterialTheme.shapes.medium
            ),
        shape = MaterialTheme.shapes.medium,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface,
            contentColor = MaterialTheme.colorScheme.onSurface,
            disabledContainerColor = MaterialTheme.colorScheme.surface.copy(alpha = 0.5f),
            disabledContentColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
        ),
        elevation = CardDefaults.cardElevation(2.dp)
    ) { // Container (Serve para aplicar o border radius)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 15.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) { // Todos os elementos são colocados em linha
            Column(
                modifier = Modifier.weight(1f)
            ) { // Informações do local
                Row { // Nome
                    Text(
                        modifier = Modifier.fillMaxWidth(),
                        text = toilet.name,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 18.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) { // Estrelas
                    Stars(toilet.getAverageRating(), size = 14.dp)
                    Text(
                        modifier = Modifier.padding(horizontal = 2.dp),
                        text = "(${toilet.numComments})",
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 10.sp,
                        lineHeight = 1.sp
                    )
                }
                Row { // Endereço
                    Text(
                        modifier = Modifier.fillMaxWidth(),
                        text = toilet.address,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 12.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
            Column { // Distância
                Text(
                    modifier = Modifier.padding(horizontal = 10.dp),
                    text = distanceToString(distance),
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 18.sp,
                    maxLines = 1
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun LocationCardPreview() {
    LocationCard(
        toilet = generateRandomToilet(),
        distance = 1000.0,
        onClick = {}
    )
}