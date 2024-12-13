package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

        /**
         * Função que mostra uma caixa de texto para o usuário inserir um comentário.
         *
         * @param commentInput O texto atualmente inserido na caixa de texto.
         * @param onCommentChange Callback que retorna o texto inserido na caixa de texto, permitindo acompanhar e atualizar seu conteúdo.
         *
         * Esta função permite ao usuário inserir um comentário em uma caixa de texto, fornecendo uma maneira simples de capturar entradas de texto.
         *
         * Exemplo de uso:
         * ```kotlin
         * RatingComment(
         *     commentInput = "",
         *     onCommentChange = { newText -> println("Comentário atualizado: $newText") }
         * )
         * ```
         */
@Composable
fun RatingComment(
    commentInput: String = "",
    onCommentChange: (String) -> Unit = {}
)
 {
    Row(
        modifier = Modifier
            .padding(
                top = 40.dp,
                bottom = 10.dp
            )
    ) {
        Text(
            text = "Comentar",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Normal,
        )

    }
    TextField(
        value = commentInput,
        singleLine = false,
        modifier = Modifier
            .fillMaxWidth()
            .height(125.dp),
        shape = RoundedCornerShape(topEnd = 10.dp, topStart = 10.dp),
        onValueChange = { newText ->
            onCommentChange(newText)
        },
        label = {
            Text(
                text = "Escreva seu Comentário...",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Normal,
            )
        },
    )
}
@Composable
@Preview(showBackground = true)
fun RatingCommentPreview() {
    RatingComment(
        commentInput = ""
    )
}