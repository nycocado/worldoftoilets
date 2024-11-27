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
import androidx.compose.ui.unit.dp

@Composable
fun RatingComment(
    commentInput: String = "",
    onCommentChange: (String) -> Unit = {}
) {
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