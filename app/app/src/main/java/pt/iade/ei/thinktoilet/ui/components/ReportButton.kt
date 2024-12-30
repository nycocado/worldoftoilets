package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.ui.theme.AppTheme
import pt.iade.ei.thinktoilet.ui.util.NoRippleInteractionSource

/**
 * Exibe um botão para selecionar uma denúncia.
 *
 * @param title [String] que representa o título da denúncia.
 * @param id [Int] que representa o id da denúncia.
 * @param onClick Callback que será chamado quando o botão for clicado.
 */
@Composable
fun ReportButton(
    title: String,
    onClick: () -> Unit = {}
) {

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .height(70.dp)
            .padding(vertical = 5.dp),
        onClick = { onClick() },
        interactionSource = NoRippleInteractionSource()
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
@Preview(showBackground = true)
fun ReportComplementPreview() {
    AppTheme {
        ReportButton(
            title = "Title"
        )
    }
}