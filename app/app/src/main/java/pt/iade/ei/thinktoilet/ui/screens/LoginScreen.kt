package pt.iade.ei.thinktoilet.ui.screens


import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
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
    onLoginSuccess: @Composable (user: User) -> Unit = { },
    navigateToRegister: () -> Unit = { }
) {
    val loginState = loginStateFlow.collectAsState().value
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var emailSupportText by remember { mutableStateOf("") }
    var passwordSupportText by remember { mutableStateOf("") }

    val context = LocalContext.current

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = context.getString(R.string.app_name),
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                }
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            LazyColumn {
                item {
                    Row(
                        modifier = Modifier
                            .padding(50.dp)
                            .fillMaxWidth(),
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Image(
                            modifier = Modifier
                                .size(200.dp),
                            painter = painterResource(R.drawable.logo),
                            contentDescription = "Logo Icon"
                        )
                    }
                }

                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.Center
                    ) {
                        OutlinedTextField(
                            value = email,
                            onValueChange = {
                                email = it
                            },
                            label = { Text("Email") },
                            isError = emailSupportText.isNotEmpty(),
                            supportingText = { Text(emailSupportText) }
                        )
                    }
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 10.dp),
                        horizontalArrangement = Arrangement.Center

                    ) {
                        OutlinedTextField(
                            value = password,
                            onValueChange = {
                                password = it
                            },
                            label = { Text("Palavra-passe") },
                            isError = passwordSupportText.isNotEmpty(),
                            supportingText = { Text(passwordSupportText) }
                        )
                    }
                }

                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 10.dp),
                        horizontalArrangement = Arrangement.Center

                    ) {
                        Button(
                            onClick = { onLogin(email, password) },
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
                    }
                    Row(
                        modifier = Modifier
                            .padding(top = 60.dp)
                            .fillMaxWidth()
                            .padding(top = 10.dp),
                        horizontalArrangement = Arrangement.Center

                    ) {
                        Button(
                            onClick = { navigateToRegister() },
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
    }

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


@Preview(showBackground = true)
@Composable
fun LoginScreenPreview() {
    LoginScreen(
        loginStateFlow = MutableStateFlow(Result.success(User(1, "name", "email", "iconId", 3, 2)))
    )
}
