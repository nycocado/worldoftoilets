package com.worldoftoilets.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.worldoftoilets.app.ui.theme.AppTheme
import com.worldoftoilets.app.ui.util.NoRippleInteractionSource
import com.worldoftoilets.app.models.TypeExtra as TypeExtraData
import com.worldoftoilets.app.models.enums.TypeExtra as TypeExtraEnum

@Composable
fun ChipsToilet(
    extras: List<TypeExtraData>
) {
    val context = LocalContext.current

    LazyRow(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        items(extras) { extra ->
            val enumExtra = getTypeExtraEnum(extra.apiName)
            if (enumExtra != null) {
                AssistChip(
                    label = {
                        Text(
                            text = context.getString(enumExtra.value),
                            style = MaterialTheme.typography.labelSmall
                        )
                    },
                    leadingIcon = {
                        Icon(
                            imageVector = enumExtra.icon,
                            contentDescription = null
                        )
                    },
                    onClick = {},
                    colors = AssistChipDefaults.assistChipColors(
                        containerColor = Color.Transparent,
                        labelColor = MaterialTheme.colorScheme.primary,
                        leadingIconContentColor = MaterialTheme.colorScheme.primary
                    ),
                    shape = MaterialTheme.shapes.extraLarge,
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary),
                    interactionSource = NoRippleInteractionSource()
                )
            }
        }
    }
}

private fun getTypeExtraEnum(apiName: String): TypeExtraEnum? {
    return TypeExtraEnum.entries.find { it.technicalValue == apiName }
}

@Preview(showBackground = true)
@Composable
fun ChipsToiletPreview() {
    AppTheme {
        ChipsToilet(
            extras = listOf(
                TypeExtraData("Wheelchair Accessible", "wheelchair_accessible"),
                TypeExtraData("Baby Changing Station", "baby_changing_station"),
                TypeExtraData("Disabled Parking", "disabled_parking"),
                TypeExtraData(
                    "Accessible for Visual Impairment",
                    "accessible-for-visually-impaired"
                )
            )
        )
    }
}