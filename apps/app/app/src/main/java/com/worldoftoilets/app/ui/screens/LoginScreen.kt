package com.worldoftoilets.app.ui.screens

import android.util.Patterns
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
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
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.ui.components.GoTextField
import com.worldoftoilets.app.ui.components.NextTextField
import com.worldoftoilets.app.ui.components.SanitaryButton
import com.worldoftoilets.app.ui.theme.AppTheme
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    loginStateFlow: StateFlow<Result<User>?>,
    onLogin: (email: String, password: String) -> Unit = { _, _ -> },
    onLoginSuccess: () -> Unit = { },
    navigateToRegister: () -> Unit = { },
    navigateToForgotPassword: () -> Unit = { }
) {
    val loginState by loginStateFlow.collectAsStateWithLifecycle()
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var emailSupportText by remember { mutableStateOf("") }
    var passwordSupportText by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    val isAllowedToLogin =
        emailSupportText.isEmpty() && passwordSupportText.isEmpty() && email.isNotEmpty() && password.isNotEmpty()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    LaunchedEffect(email, password) {
        emailSupportText = when {
            email.isEmpty() -> ""
            email.length > 100 -> context.getString(R.string.error_too_long_email)
            !Patterns.EMAIL_ADDRESS.matcher(email)
                .matches() -> context.getString(R.string.error_invalid_email)

            else -> ""
        }

        passwordSupportText = when {
            password.isEmpty() -> ""
            password.length < 8 -> context.getString(R.string.error_too_short_password)
            password.length > 64 -> context.getString(R.string.error_too_long_password)
            else -> ""
        }
    }

    LaunchedEffect(loginState) {
        loginState?.onSuccess {
            isLoading = false
            scope.launch { onLoginSuccess() }
        }
        loginState?.onFailure { error ->
            isLoading = false
            scope.launch {
                snackbarHostState.showSnackbar(
                    error.message ?: context.getString(R.string.error_login)
                )
            }
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 32.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Logo Section
            Image(
                modifier = Modifier.size(150.dp),
                painter = painterResource(R.drawable.logo),
                contentDescription = context.getString(R.string.image_description_null),
            )
            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = context.getString(R.string.app_name),
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )

            Text(
                text = context.getString(R.string.login_subtitle_welcome),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 48.dp)
            )

            // Inputs
            NextTextField(
                label = context.getString(R.string.email),
                value = email,
                supportText = emailSupportText,
                onValueChange = { email = it },
                keyboardType = KeyboardType.Email
            )
            Spacer(modifier = Modifier.height(12.dp))
            GoTextField(
                label = context.getString(R.string.password),
                value = password,
                supportText = passwordSupportText,
                onValueChange = { password = it },
                onGo = {
                    if (isAllowedToLogin) {
                        isLoading = true
                        onLogin(email, password)
                    }
                },
                keyboardType = KeyboardType.Password,
                visualTransformation = PasswordVisualTransformation()
            )

            Spacer(modifier = Modifier.height(32.dp))

            SanitaryButton(
                text = context.getString(R.string.login_action),
                onClick = {
                    if (isAllowedToLogin) {
                        isLoading = true
                        onLogin(email, password)
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                isLoading = isLoading,
                enabled = isAllowedToLogin
            )

            Spacer(modifier = Modifier.height(24.dp))

            Box(
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = context.getString(R.string.forgot_password),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .clickable { navigateToForgotPassword() }
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Secondary Action (Register)
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = context.getString(R.string.no_account),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = " " + context.getString(R.string.register_action),
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.clickable { navigateToRegister() }
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun LoginScreenPreview() {
    AppTheme {
        LoginScreen(
            loginStateFlow = MutableStateFlow(null)
        )
    }
}