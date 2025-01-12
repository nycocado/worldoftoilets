package pt.iade.ei.thinktoilet.ui.screens


import android.util.Patterns
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.ui.components.GoTextField
import pt.iade.ei.thinktoilet.ui.components.NextTextField

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
    var isLoading by remember { mutableStateOf(false) }
    val isAllowedToLogin = emailSupportText.isEmpty() && passwordSupportText.isEmpty()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    LaunchedEffect(email, password) {
        emailSupportText = when {
            email.isEmpty() -> context.getString(R.string.error_required_email)
            email.length > 100 -> context.getString(R.string.error_too_long_email)
            !Patterns.EMAIL_ADDRESS.matcher(email)
                .matches() -> context.getString(R.string.error_invalid_email)

            else -> ""
        }

        passwordSupportText = when {
            password.isEmpty() -> context.getString(R.string.error_required_password)
            else -> ""
        }
    }

    LaunchedEffect(loginState) {
        loginState?.onSuccess { user ->
            emailSupportText = ""
            passwordSupportText = ""
            isLoading = false

            scope.launch {
                onLoginSuccess(user)
            }
        }

        loginState?.onFailure { error ->
            when {
                error.message?.contains("email") == true -> {
                    emailSupportText = context.getString(R.string.error_invalid_email)
                    passwordSupportText = ""
                    isLoading = false
                }

                error.message?.contains("password") == true -> {
                    passwordSupportText = context.getString(R.string.error_invalid_password)
                    emailSupportText = ""
                    isLoading = false
                }

                else -> {
                    emailSupportText = ""
                    passwordSupportText = ""
                    isLoading = false

                    scope.launch {
                        snackbarHostState.showSnackbar(context.getString(R.string.error_login))
                    }
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
        },
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Image(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 100.dp)
                        .padding(bottom = 20.dp),
                    painter = painterResource(R.drawable.logo),
                    contentDescription = context.getString(R.string.logo),
                )
            }

            item {
                Column(
                    modifier = Modifier.padding(horizontal = 68.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ){
                    NextTextField(
                        label = context.getString(R.string.email),
                        value = email,
                        supportText = emailSupportText,
                        onValueChange = { email = it },
                        keyboardType = KeyboardType.Email
                    )
                    GoTextField(
                        label = context.getString(R.string.password),
                        value = password,
                        supportText = passwordSupportText,
                        onValueChange = { password = it },
                        onGo = {
                            if (isAllowedToLogin)
                                scope.launch {
                                    onLogin(email, password)
                                    isLoading = true
                                }
                        },
                        keyboardType = KeyboardType.Password,
                        visualTransformation = PasswordVisualTransformation()
                    )
                }
            }

            item {
                Column(
                    modifier = Modifier
                        .padding(top = 20.dp)
                        .padding(horizontal = 100.dp),
                    verticalArrangement = Arrangement.spacedBy(30.dp)
                ){
                    Button(
                        onClick = {
                            if (isAllowedToLogin)
                                scope.launch {
                                    onLogin(email, password)
                                    isLoading = true
                                }
                        },
                        modifier = Modifier
                            .fillMaxWidth(),
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
                        when (isLoading) {
                            true -> CircularProgressIndicator(
                                modifier = Modifier.size(24.dp)
                            )

                            false -> Text(
                                text = context.getString(R.string.login_action),
                                style = MaterialTheme.typography.bodyLarge,
                                fontWeight = FontWeight.SemiBold,
                                maxLines = 1,
                                minLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }
                    Button(
                        onClick = { navigateToRegister() },
                        modifier = Modifier
                            .fillMaxWidth(),
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
                            text = context.getString(R.string.register_action),
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.SemiBold,
                            maxLines = 1,
                            minLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
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
