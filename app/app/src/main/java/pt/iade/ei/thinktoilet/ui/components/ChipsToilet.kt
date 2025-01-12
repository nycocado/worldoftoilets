package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.models.enums.TypeExtra
import pt.iade.ei.thinktoilet.ui.theme.AppTheme
import pt.iade.ei.thinktoilet.ui.util.NoRippleInteractionSource

@Composable
fun ChipsToilet(
    extras: List<TypeExtra>
) {
    val context = LocalContext.current

    LazyRow(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        items(extras) { extra ->
            AssistChip(
                label = {
                    Text(
                        text = context.getString(extra.value),
                        style = MaterialTheme.typography.labelSmall
                    )
                },
                leadingIcon = {
                    Icon(
                        painter = painterResource(extra.icon),
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurface
                    )
                },
                onClick = {},
                shape = MaterialTheme.shapes.extraLarge,
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.onSurface),
                interactionSource = NoRippleInteractionSource()
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ChipsToiletPreview() {
    AppTheme {
        ChipsToilet(
            extras = listOf(
                TypeExtra.WHEELCHAIR_ACCESSIBLE,
                TypeExtra.BABY_CHANGING_STATION,
                TypeExtra.DISABLED_PARKING,
                TypeExtra.ACCESSIBLE_FOR_VISUAL_IMPAIRMENT
            )
        )
    }
}