package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.R
import kotlin.math.round

@Composable
fun Stars(
    rating: Float,
    size: Dp = 24.dp
) {
    Row {
        for (i in 1..5) {
            Image(
                painter = painterResource(
                    if (i <= round(rating))
                        R.drawable.star_filled
                    else
                        R.drawable.star
                ),
                contentDescription = "{i} star",
                modifier = Modifier.size(size)
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun StarsPreview() {
    Stars(3.5f)
}