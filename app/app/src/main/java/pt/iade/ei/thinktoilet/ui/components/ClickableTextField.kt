package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.PressInteraction
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@Composable
fun ClickableTextField(
    label: String,
    value: String = "",
    trailingIcon: @Composable () -> Unit = {},
    onValueChange: (String) -> Unit = {},
    onClick: () -> Unit = {}
) {
    OutlinedTextField(
        modifier = Modifier.fillMaxWidth(),
        value = value,
        onValueChange = {
            onValueChange(it)
        },
        label = {
            Text(label)
        },
        placeholder = {
            Text(label)
        },
        singleLine = true,
        readOnly = true,
        trailingIcon = trailingIcon,
        interactionSource = remember { MutableInteractionSource() }
            .also { interactionSource ->
                LaunchedEffect(interactionSource) {
                    interactionSource.interactions.collect {
                        if (it is PressInteraction.Release) {
                            onClick()
                        }
                    }
                }
            }
    )
}

@Preview(showBackground = true)
@Composable
fun ClickableTextFieldPreview() {
    AppTheme {
        ClickableTextField(
            label = "Label",
            value = "Value",
            onClick = {}
        )
    }
}