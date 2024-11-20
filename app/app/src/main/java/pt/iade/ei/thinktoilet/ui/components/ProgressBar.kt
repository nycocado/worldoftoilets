package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
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
    maxValue : Float = 5f
) {
    Row(
        modifier = Modifier.padding(vertical = 2.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        LinearProgressIndicator(
            modifier = Modifier
                .weight(1f)
                .height(10.dp)
                .border(
                    width = 3.dp,
                    color = Color.Black,
                    shape = MaterialTheme.shapes.small
                ),
            progress = {
                progress / maxValue
            },
            strokeCap = StrokeCap.Round,
            color = MaterialTheme.colorScheme.secondary
        )
        Text(
            modifier = Modifier
                .padding(start = 8.dp)
                .width(120.dp),
            text = text,
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.Medium,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}


@Preview
@Composable
fun PreviewProgressBarCategories() {
    AppTheme {
        ProgressBar(4.5f, "Teste")
    }
}