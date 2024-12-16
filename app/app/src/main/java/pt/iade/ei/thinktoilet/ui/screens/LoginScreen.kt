package pt.iade.ei.thinktoilet.ui.screens


import android.util.Patterns
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.User

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    loginStateFlow: StateFlow<Result<User>?>,
    onLogin: (email: String, password: String) -> Unit = { _, _ -> },
    onLoginSuccess: (user: User) -> Unit = { },
    navigateToRegister: () -> Unit = { }
) {
    val loginState = loginStateFlow.collectAsState().value
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var emailSupportText by remember { mutableStateOf("") }
    var passwordSupportText by remember { mutableStateOf("") }
    val context = LocalContext.current

    LaunchedEffect(email) {
        emailSupportText = if (email.isEmpty()) {
            "O e-mail é obrigatório"
        } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            "O e-mail é inválido"
        } else {
            ""
        }
    }

    LaunchedEffect(password) {
        passwordSupportText = if (password.isEmpty()) {
            "A palavra-passe é obrigatória"
        } else {
            ""
        }
    }

    LaunchedEffect(loginState) {
        loginState?.onSuccess { user ->
            emailSupportText = ""
            passwordSupportText = ""

            onLoginSuccess(user)
        }

        loginState?.onFailure { error ->
            when {
                error.message?.contains("email") == true -> {
                    emailSupportText = "Email inválido"
                    passwordSupportText = ""
                }

                error.message?.contains("password") == true -> {
                    passwordSupportText = "Palavra-passe inválida"
                    emailSupportText = ""
                }

                else -> {
                    emailSupportText = "Erro ao iniciar sessão"
                }
            }
        }
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = context.getString(R.string.login),
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 68.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Image(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 40.dp)
                        .padding(bottom = 30.dp),
                    painter = painterResource(R.drawable.logo),
                    contentDescription = "Logo Icon"
                )
            }

            item {
                OutlinedTextField(
                    modifier = Modifier.fillMaxWidth(),
                    value = email,
                    onValueChange = {
                        email = it
                    },
                    label = { Text("Email") },
                    isError = emailSupportText.isNotEmpty(),
                    supportingText = { Text(emailSupportText) },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Email,
                        imeAction = ImeAction.Next
                    )
                )
                OutlinedTextField(
                    modifier = Modifier.fillMaxWidth(),
                    value = password,
                    onValueChange = {
                        password = it
                    },
                    label = { Text("Palavra-passe") },
                    isError = passwordSupportText.isNotEmpty(),
                    supportingText = { Text(passwordSupportText) },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Password,
                        imeAction = ImeAction.Done
                    ),
                    keyboardActions = KeyboardActions(
                        onDone = {
                            onLogin(email, password)
                        }
                    ),
                    visualTransformation = PasswordVisualTransformation()
                )
            }

            item {
                Button(
                    onClick = {
                        if (emailSupportText.isEmpty() && passwordSupportText.isEmpty())
                            onLogin(email, password)
                    },
                    modifier = Modifier.padding(top = 10.dp),
                    colors = ButtonColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer,
                        contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
                        disabledContainerColor = MaterialTheme.colorScheme.primaryContainer.copy(
                            alpha = 0.5f
                        ),
                        disabledContentColor = MaterialTheme.colorScheme.onPrimaryContainer.copy(
                            alpha = 0.5f
                        )
                    )
                ) {
                    Text(
                        text = "Iniciar Sessão",
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.SemiBold
                    )
                }
                Button(
                    onClick = { navigateToRegister() },
                    modifier = Modifier.padding(top = 40.dp),
                    colors = ButtonColors(
                        containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                        contentColor = MaterialTheme.colorScheme.onTertiaryContainer,
                        disabledContainerColor = MaterialTheme.colorScheme.primaryContainer.copy(
                            alpha = 0.5f
                        ),
                        disabledContentColor = MaterialTheme.colorScheme.onPrimaryContainer.copy(
                            alpha = 0.5f
                        )
                    )
                ) {
                    Text(
                        text = "Criar Conta",
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}


@Preview(showBackground = true)
@Composable
fun LoginScreenPreview() {
    LoginScreen(
        loginStateFlow = MutableStateFlow(null)
    )
}
