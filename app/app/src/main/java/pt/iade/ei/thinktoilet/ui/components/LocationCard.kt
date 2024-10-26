package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.layout.Row
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import pt.iade.ei.thinktoilet.ui.theme.montserratFontFamily

@Composable
fun LocationCard() {
    Row {
        Text(
            text = "Location Card",
            fontFamily = montserratFontFamily,
        )
    }
}

@Preview(showBackground = true)
@Composable
fun LocationCardPreview() {
    LocationCard()
}