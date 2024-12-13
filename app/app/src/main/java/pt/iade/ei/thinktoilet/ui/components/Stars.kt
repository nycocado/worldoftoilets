package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.ui.theme.AppTheme
import pt.iade.ei.thinktoilet.ui.util.NoRippleInteractionSource
import kotlin.math.round

        /**
         * Exibe um ícone de estrela com base em uma nota fornecida.
         *
         * @param rating Valor da nota a ser exibida, representando a quantidade de estrelas preenchidas (ex.: 3.5).
         * @param size Tamanho do ícone, especificado como um valor de dimensões (ex.: dp).
         * @param horizontalPadding Espaçamento horizontal ao redor do ícone.
         * @param onClick Callback opcional acionado quando o ícone é pressionado, que retorna o índice da estrela clicada.
         *
         * Esta função tem como objetivo:
         * - Exibir uma representação visual da avaliação em estrelas.
         * - Permitir interação ao clicar nas estrelas, caso um callback seja fornecido.
         *
         * Exemplo de uso:
         * ```kotlin
         * Stars(
         *     rating = 3.5f,
         *     size = 24.dp,
         *     horizontalPadding = 8.dp,
         *     onClick = { index -> println("Estrela clicada: $index") }
         * )
         * ```
         */
@Composable
fun Stars(
    rating: Float,
    size: Dp = 24.dp,
    horizontalPadding: Dp = 0.dp,
    onClick: ((Int) -> Unit)? = null, // int retorna o valor do índice
) {
    Row {
        for (i in 1..5) {
            if (onClick != null) {
                Surface(
                    modifier = Modifier.size(size)
                        .padding(horizontal = horizontalPadding),
                    onClick = { onClick(i) },
                    interactionSource = NoRippleInteractionSource()
                ) {
                    Image(
                        painter = painterResource(
                            if (i <= rating) R.drawable.star_filled_24px
                            else R.drawable.star_24px
                        ), contentDescription = "{i} star",
                        modifier = Modifier
                            .size(size)

                    )
                }
            } else {
                Image(

                    painter = painterResource(
                        if (i <= round(rating)) R.drawable.star_filled_24px
                        else R.drawable.star_24px
                    ),  contentDescription = "{i} star",
                        modifier = Modifier.size(size)

                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun StarsPreview() {
    AppTheme {
        Stars(rating = 3.5f)
    }
}