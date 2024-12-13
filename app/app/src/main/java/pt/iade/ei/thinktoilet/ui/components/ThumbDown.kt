package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.ui.theme.AppTheme
import pt.iade.ei.thinktoilet.ui.util.NoRippleInteractionSource


         /**
         * Exibe um ícone de DisLike com um contador.
         *
         * @param count Valor do contador que indica o número de interações (curtidas ou descurtidas).
         * @param size Tamanho do ícone, especificado como um valor de dimensões (ex.: dp).
         * @param isPressed Estado do ícone, indicando se ele foi pressionado pelo usuário.
         * @param onThumbDown Callback acionado quando o ícone de Like é pressionado.
         *
         *
         * Esta função tem como objetivo:
         * - Exibir botões de interação visual (Like e Dislike) com um contador associado.
         * - Permitir personalização do tamanho e estado do ícone.
         *
         * Exemplo de uso:
         * ```kotlin
         * ThumbUp(
         *     count = 10,
         *     size = 28.dp,
         *     isPressed = false,
         *     onThumbUp = { /* Lógica para registrar a interação */ }
         * )
         *```
         */
@Composable
fun ThumbDown(
    count: Int = 0,
    size: Dp = 28.dp,
    isPressed: Boolean = false,
    onThumbDown: (Boolean) -> Unit = {},
) {
    Surface(
        onClick = {
            onThumbDown(isPressed)
        },
        interactionSource = NoRippleInteractionSource(),
        color = Color.Transparent
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Image(
                painter = painterResource(
                    if (!isPressed) R.drawable.thumb_down_24px
                    else R.drawable.thumb_down_filled_24px
                ),
                contentDescription = "Like Icon",
                modifier = Modifier
                    .size(size)
                    .padding(end = 4.dp)
            )
            Text(
                text = count.toString(),
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ThumbDownPreview() {
    AppTheme {
        ThumbDown()
    }
}