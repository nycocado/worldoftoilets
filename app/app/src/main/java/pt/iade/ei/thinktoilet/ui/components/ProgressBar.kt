package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ProgressIndicatorDefaults.drawStopIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@Composable
fun ProgressBar(
    progress: Float,
    text: String,
    maxValue: Float = 5f
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        LinearProgressIndicator(
            modifier = Modifier
                .weight(1f)
                .height(5.dp),
            progress = {
                progress / maxValue
            },
            strokeCap = StrokeCap.Round,
            color = MaterialTheme.colorScheme.secondary,
            trackColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.2f),
            drawStopIndicator = {
                drawStopIndicator(
                    drawScope = this,
                    stopSize = 0.dp,
                    color = Color.Transparent,
                    strokeCap = StrokeCap.Round
                )
            }
        )
        Text(
            modifier = Modifier
                .width(120.dp),
            text = text,
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.Medium,
            maxLines = 1,
            minLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}


@Preview(showBackground = true)
@Composable
private fun PreviewProgressBarCategories() {
    AppTheme {
        ProgressBar(4.5f, "Teste")
    }
}