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
         * Função que representa um complemento de uma reclamação com sistema de avaliação em estrelas.
         *
         * @param title Título exibido ao lado das estrelas, descrevendo o critério de avaliação.
         * @param rating Valor inicial da avaliação representado como um número decimal (ex.: 3.5).
         * @param onClick Um `mutableStateOf()` que retornará o valor da estrela selecionada, permitindo capturar a interação do usuário.
         *
         * Esta função permite ao usuário interagir com as estrelas, atribuindo um valor à variável associada.
         *
         * Exemplo de uso:
         * ```kotlin
         * RatingItem(
         *     title = "Qualidade",
         *     rating = 3.5f,
         *     onClick = { selectedRating -> println("Avaliação selecionada: $selectedRating") }
         * )
         * ```
         */
@Composable
fun RatingItem(
    title: String, rating: Int,
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
        Stars(rating = rating.toFloat(), size = 40.dp, horizontalPadding = 3.dp) {
            if (onClick != null) {
                onClick(it)
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun RatingItemPreview() {
    RatingItem(title = "Limpeza", rating = 4)
}