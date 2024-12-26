package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Row
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
 * Exibe cinco ícones de estrelas, representando uma avaliação.
 *
 * @param rating [Float] que representa a avaliação.
 * @param size [Dp] que representa o tamanho do ícone.
 * @param horizontalPadding [Dp] que representa o espaçamento horizontal entre os ícones.
 * @param onClick Callback que é chamado quando um ícone é clicado. (Optional)
 */
@Composable
fun Stars(
    rating: Float,
    size: Dp = 24.dp,
    horizontalPadding: Dp = 0.dp,
    onClick: ((Int) -> Unit)? = null
) {
    Row {
        for (i in 1..5) {
            if (onClick != null) {
                Surface(
                    modifier = Modifier
                        .size(size)
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
                    ), contentDescription = "{i} star",
                    modifier = Modifier.size(size)
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun StarsPreview() {
    AppTheme {
        Stars(rating = 3.5f)
    }
}