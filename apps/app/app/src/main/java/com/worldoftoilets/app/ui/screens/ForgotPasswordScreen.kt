package com.worldoftoilets.app.ui.screens

import android.util.Patterns
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.worldoftoilets.app.R
import com.worldoftoilets.app.ui.components.NextTextField
import com.worldoftoilets.app.ui.components.SanitaryButton
import com.worldoftoilets.app.ui.theme.AppTheme
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ForgotPasswordScreen(
    forgotPasswordStateFlow: StateFlow<Result<Unit>?>,
    onForgotPassword: (email: String) -> Unit = {},
    onForgotPasswordSuccess: () -> Unit = {},
    navigateToBack: () -> Unit = {}
) {
    val forgotPasswordState by forgotPasswordStateFlow.collectAsStateWithLifecycle()
    var email by remember { mutableStateOf("") }
    var emailSupportText by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    val isAllowedToReset = emailSupportText.isEmpty() && email.isNotEmpty()

    LaunchedEffect(email) {
        emailSupportText = when {
            email.isEmpty() -> ""
            !Patterns.EMAIL_ADDRESS.matcher(email)
                .matches() -> context.getString(R.string.error_invalid_email)

            else -> ""
        }
    }

    LaunchedEffect(forgotPasswordState) {
        forgotPasswordState?.onSuccess {
            isLoading = false
            onForgotPasswordSuccess()
        }
        forgotPasswordState?.onFailure { error ->
            isLoading = false
            scope.launch {
                snackbarHostState.showSnackbar(
                    error.message ?: context.getString(R.string.error_unexpected)
                )
            }
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = context.getString(R.string.forgot_password),
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(onClick = { navigateToBack() }) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Rounded.ArrowBack,
                            contentDescription = context.getString(R.string.content_description_back_button)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
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
            Text(
                text = context.getString(R.string.forgot_password_instructions),
                style = MaterialTheme.typography.bodyMedium,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(vertical = 24.dp)
            )

            NextTextField(
                label = context.getString(R.string.email),
                value = email,
                supportText = emailSupportText,
                onValueChange = { email = it },
                keyboardType = KeyboardType.Email
            )

            Spacer(modifier = Modifier.height(32.dp))

            SanitaryButton(
                text = context.getString(R.string.send_email),
                onClick = {
                    if (isAllowedToReset) {
                        isLoading = true
                        onForgotPassword(email)
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                isLoading = isLoading,
                enabled = isAllowedToReset
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ForgotPasswordPreview() {
    AppTheme {
        ForgotPasswordScreen(
            forgotPasswordStateFlow = MutableStateFlow(null)
        )
    }
}