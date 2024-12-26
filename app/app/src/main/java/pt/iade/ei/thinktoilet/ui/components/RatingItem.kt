package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

/**
 * Exibe um critério de avaliação interativo com estrelas.
 *
 * @param title [String] que representa o título do critério.
 * @param rating [Int] que representa a quantidade de estrelas selecionadas.
 * @param onClick Callback que será chamado quando uma estrela for clicada.
 */
@Composable
fun RatingItem(
    title: String,
    rating: Int,
    onClick: ((Int) -> Unit)? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            modifier = Modifier.weight(1f),
            text = title,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Normal,
        )
        Stars(
            rating = rating.toFloat(),
            size = 40.dp,
            horizontalPadding = 3.dp,
            onClick = {
                if (onClick != null) {
                    onClick(it)
                }
            }
        )
    }
}

@Preview(showBackground = true)
@Composable
private fun RatingItemPreview() {
    AppTheme {
        RatingItem(title = "Limpeza", rating = 4)
    }
}