package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CornerBasedShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
* Exibe um controle deslizante personalizado.
*
* @param verticalPadding [Dp] de preenchimento vertical.
* @param color [Color] do controle deslizante.
* @param shape [CornerBasedShape] do controle deslizante.
* @param width [Dp] de largura do controle deslizante.
* @param height [Dp] de altura do controle deslizante.
* @param onClick Callback para quando o controle deslizante for clicado.
*/
@Composable
fun CustomDragHandle(
    verticalPadding: Dp = 14.dp,
    color: Color = MaterialTheme.colorScheme.outline,
    shape: CornerBasedShape = MaterialTheme.shapes.extraLarge,
    width: Dp = 40.dp,
    height: Dp = 4.dp,
    onClick: () -> Unit = {}
) {
    Surface(
        modifier = Modifier
            .padding(vertical = verticalPadding)
            .clickable { onClick() },
        color = color,
        shape = shape
    ) {
        Box(
            Modifier.size(
                width = width,
                height = height
            )
        )
    }
}

@Preview(showBackground = true)
@Composable
private fun CustomDragHandlePreview() {
    CustomDragHandle()
}