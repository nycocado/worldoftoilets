package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

/**
 * Exibe um campo de texto para inserção de email.
 *
 * @param email [String] a ser exibido no campo de texto.
 * @param emailSupportText [String] de suporte exibido abaixo do campo de texto.
 * @param onEmailChange Callback que é chamado quando o email é alterado.
 */
@Composable
fun EmailTextField(
    email: String = "",
    emailSupportText: String = "",
    onEmailChange: (String) -> Unit = {}
) {
    val context = LocalContext.current

    OutlinedTextField(
        modifier = Modifier.fillMaxWidth(),
        value = email,
        onValueChange = {
            onEmailChange(it)
        },
        label = {
            Text(context.getString(R.string.email))
        },
        isError = emailSupportText.isNotEmpty(),
        supportingText = {
            Text(emailSupportText)
        },
        singleLine = true,
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Email,
            imeAction = ImeAction.Next
        )
    )
}

/**
 * Exibe um campo de texto para inserção de senha.
 *
 * @param password [String] a ser exibido no campo de texto.
 * @param passwordSupportText [String] de suporte exibido abaixo do campo de texto.
 * @param onPasswordChange Callback que é chamado quando a senha é alterada.
 */
@Composable
fun PasswordTextField(
    password: String = "",
    passwordSupportText: String = "",
    onPasswordChange: (String) -> Unit = {}
) {
    val context = LocalContext.current

    OutlinedTextField(
        modifier = Modifier.fillMaxWidth(),
        value = password,
        onValueChange = {
            onPasswordChange(it)
        },
        label = {
            Text(context.getString(R.string.password))
        },
        isError = passwordSupportText.isNotEmpty(),
        supportingText = {
            Text(passwordSupportText)
        },
        singleLine = true,
        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Password,
            imeAction = ImeAction.Next
        ),
        visualTransformation = PasswordVisualTransformation()
    )
}

@Preview(showBackground = true)
@Composable
private fun EmailTextFieldPreview() {
    AppTheme {
        EmailTextField()
    }
}

@Preview(showBackground = true)
@Composable
private fun PasswordTextFieldPreview() {
    AppTheme {
        PasswordTextField()
    }
}