package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.PressInteraction
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

/**
 * Exibe um campo de texto para alterar o nome do usuário. (É clicável e somente leitura)
 *
 * @param name [String] que representa o nome do usuário.
 * @param onNameChange Callback que é chamado quando o nome é alterado.
 * @param onClick Callback que é chamado quando o campo de texto é clicado.
 */
@Composable
fun ChangeNameTextField(
    name: String = "",
    onNameChange: (String) -> Unit = {},
    onClick: () -> Unit = {}
) {
    val context = LocalContext.current

    OutlinedTextField(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp),
        value = name,
        onValueChange = {
            onNameChange(it)
        },
        label = {
            Text(context.getString(R.string.change_name))
        },
        placeholder = {
            Text(context.getString(R.string.change_name))
        },
        singleLine = true,
        readOnly = true,
        trailingIcon = {
            Icon(
                imageVector = Icons.Default.Person,
                contentDescription = context.getString(R.string.content_description_change_name_button)
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

/**
 * Exibe um campo de texto para alterar o email do usuário. (É clicável e somente leitura)
 *
 * @param email [String] que representa o email do usuário.
 * @param onEmailChange Callback que é chamado quando o email é alterado.
 * @param onClick Callback que é chamado quando o campo de texto é clicado.
 */
@Composable
fun ChangeEmailTextField(
    email: String = "",
    onEmailChange: (String) -> Unit = {},
    onClick: () -> Unit = {}
) {
    val context = LocalContext.current

    OutlinedTextField(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp),
        value = email,
        onValueChange = {
            onEmailChange(it)
        },
        label = {
            Text(context.getString(R.string.change_email))
        },
        placeholder = {
            Text(context.getString(R.string.change_email))
        },
        singleLine = true,
        readOnly = true,
        trailingIcon = {
            Icon(
                imageVector = Icons.Default.Email,
                contentDescription = context.getString(R.string.content_description_change_email_button)
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

/**
 * Exibe um campo de texto para alterar a senha do usuário. (É clicável e somente leitura)
 *
 * @param password [String] que representa a senha do usuário.
 * @param onPasswordChange Callback que é chamado quando a senha é alterada.
 * @param onClick Callback que é chamado quando o campo de texto é clicado.
 */
@Composable
fun ChangePasswordTextField(
    password: String = "",
    onPasswordChange: (String) -> Unit = {},
    onClick: () -> Unit = {}
) {
    val context = LocalContext.current

    OutlinedTextField(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp),
        value = password,
        onValueChange = {
            onPasswordChange(it)
        },
        placeholder = {
            Text(context.getString(R.string.change_password))
        },
        singleLine = true,
        readOnly = true,
        trailingIcon = {
            Icon(
                imageVector = Icons.Default.Lock,
                contentDescription = context.getString(R.string.content_description_change_password_button)
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
private fun ChangeNameTextFieldPreview() {
    AppTheme {
        ChangeNameTextField()
    }
}

@Preview(showBackground = true)
@Composable
private fun ChangeEmailTextFieldPreview() {
    AppTheme {
        ChangeEmailTextField()
    }
}

@Preview(showBackground = true)
@Composable
private fun ChangePasswordTextFieldPreview() {
    AppTheme {
        ChangePasswordTextField()
    }
}