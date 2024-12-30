package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@Composable
fun NextTextField(
    label: String,
    value: String,
    supportText: String,
    onValueChange: (String) -> Unit = {},
    keyboardType: KeyboardType = KeyboardType.Text,
    visualTransformation: VisualTransformation = VisualTransformation.None
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
        isError = supportText.isNotEmpty(),
        supportingText = {
            Text(supportText)
        },
        singleLine = true,
        keyboardOptions = KeyboardOptions(
            keyboardType = keyboardType,
            imeAction = ImeAction.Next
        ),
        visualTransformation = visualTransformation
    )
}

@Preview(showBackground = true)
@Composable
fun NextTextFieldPreview() {
    AppTheme {
        NextTextField(
            label = "Label",
            value = "Value",
            supportText = "Support Text",
            onValueChange = {}
        )
    }
}