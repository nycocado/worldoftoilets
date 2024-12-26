package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.PressInteraction
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

/**
 * Exibe um campo de texto para inserção do nome.
 *
 * @param name [String] que representa o nome do usuário.
 * @param nameSupportText [String] que representa o texto de suporte do campo de texto.
 * @param onNameChange Callback que é chamado quando o nome é alterado.
 */
@Composable
fun NameTextField(
    name: String = "",
    nameSupportText: String = "",
    onNameChange: (String) -> Unit = {}
) {
    val context = LocalContext.current

    OutlinedTextField(
        modifier = Modifier.fillMaxWidth(),
        value = name,
        onValueChange = {
            onNameChange(it)
        },
        label = {
            Text(context.getString(R.string.name))
        },
        isError = nameSupportText.isNotEmpty(),
        supportingText = {
            Text(nameSupportText)
        },
        singleLine = true,
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Text,
            imeAction = ImeAction.Next
        )
    )
}

/**
 * Exibe um campo de texto para inserção da confirmação da senha.
 *
 * @param confirmPassword [String] que representa a confirmação da senha.
 * @param confirmPasswordSupportText [String] que representa o texto de suporte do campo de texto.
 * @param onConfirmPasswordChange Callback que é chamado quando a confirmação da senha é alterada.
 */
@Composable
fun ConfirmPasswordTextField(
    confirmPassword: String = "",
    confirmPasswordSupportText: String = "",
    onConfirmPasswordChange: (String) -> Unit = {}
) {
    val context = LocalContext.current

    OutlinedTextField(
        modifier = Modifier.fillMaxWidth(),
        value = confirmPassword,
        onValueChange = {
            onConfirmPasswordChange(it)
        },
        label = {
            Text(context.getString(R.string.confirm_password))
        },
        isError = confirmPasswordSupportText.isNotEmpty(),
        supportingText = {
            Text(confirmPasswordSupportText)
        },
        singleLine = true,
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Password,
            imeAction = ImeAction.Done
        ),
        visualTransformation = PasswordVisualTransformation()
    )
}

/**
 * Exibe um campo de texto para inserção da data de nascimento. (É clicável e somente leitura)
 *
 * @param birthDate [String] que representa a data de nascimento do usuário.
 * @param onBirthDateChange Callback que é chamado quando a data de nascimento é alterada.
 * @param onClick Callback que é chamado quando o campo de texto é clicado.
 */
@Composable
fun BirthdateTextField(
    birthDate: String = "",
    onBirthDateChange: (String) -> Unit = {},
    onClick: () -> Unit = {}
) {
    val context = LocalContext.current

    OutlinedTextField(
        modifier = Modifier.fillMaxWidth(),
        value = birthDate,
        onValueChange = {
            onBirthDateChange(it)
        },
        placeholder = {
            Text(context.getString(R.string.birthdate))
        },
        singleLine = true,
        readOnly = true,
        trailingIcon = {
            Icon(
                imageVector = Icons.Default.DateRange,
                contentDescription = context.getString(R.string.content_description_date_button)
            )
        },
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
private fun NameTextFieldPreview() {
    AppTheme {
        NameTextField()
    }
}

@Preview(showBackground = true)
@Composable
private fun ConfirmPasswordTextFieldPreview() {
    AppTheme {
        ConfirmPasswordTextField()
    }
}


@Preview(showBackground = true)
@Composable
private fun BirthdateTextFieldPreview() {
    AppTheme {
        BirthdateTextField()
    }
}