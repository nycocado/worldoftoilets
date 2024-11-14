package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.interaction.Interaction
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.emptyFlow
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.ui.theme.AppTheme
import kotlin.math.round

@Composable
fun Stars(
    rating: Float,
    size: Dp = 24.dp,
    onClick: ((Int) -> Unit)? = null, // int retorna o valor do índice
) {
    Row {
        for (i in 1..5) {
            if (onClick != null) {
                Surface(
                    modifier = Modifier.size(size),
                    onClick = { onClick(i) },
                    interactionSource = NoRippleInteractionSource()
                ) {
                    Image(
                        painter = painterResource(
                            if (i <= rating) R.drawable.star_filled
                            else R.drawable.star
                        ), contentDescription = "{i} star",
                        modifier = Modifier.size(size)
                    )
                }
            } else {
                Image(
                    painter = painterResource(
                        if (i <= round(rating)) R.drawable.star_filled
                        else R.drawable.star
                    ), contentDescription = "{i} star", modifier = Modifier.size(size)
                )
            }
        }
    }
}

class NoRippleInteractionSource : MutableInteractionSource{
    override val interactions : Flow<Interaction> = emptyFlow()
    override suspend fun emit(interaction: Interaction) {}
    override fun tryEmit(interaction: Interaction) = true
}

@Preview(showBackground = true)
@Composable
fun StarsPreview() {
    AppTheme {
        Stars(3.5f)
    }
}