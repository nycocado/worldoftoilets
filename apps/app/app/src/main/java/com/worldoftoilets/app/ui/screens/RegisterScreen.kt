package com.worldoftoilets.app.ui.screens

import android.util.Patterns
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.rounded.DateRange
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.enums.UserIcon
import com.worldoftoilets.app.ui.components.ClickableTextField
import com.worldoftoilets.app.ui.components.CustomDatePickerDialog
import com.worldoftoilets.app.ui.components.IconCarousel
import com.worldoftoilets.app.ui.components.NextTextField
import com.worldoftoilets.app.ui.components.SanitaryButton
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

import androidx.compose.material3.TopAppBarDefaults

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(
    registerStateFlow: StateFlow<Result<Unit>?> = MutableStateFlow(null),
    onRegister: (name: String, email: String, password: String, icon: String?, birthDate: String) -> Unit = { _, _, _, _, _ -> },
    onRegisterSuccess: () -> Unit = {},
    navigateToBack: () -> Unit = {}
) {
    val registerState by registerStateFlow.collectAsStateWithLifecycle()
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var birthDate by remember { mutableStateOf("") }
    var nameSupportText by remember { mutableStateOf("") }
    var emailSupportText by remember { mutableStateOf("") }
    var passwordSupportText by remember { mutableStateOf("") }
    var confirmPasswordSupportText by remember { mutableStateOf("") }
    var birthDateSupportText by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var showDatePicker by remember { mutableStateOf(false) }
    val isAllowedToRegister =
        nameSupportText.isEmpty() && emailSupportText.isEmpty() && passwordSupportText.isEmpty() && confirmPasswordSupportText.isEmpty() && birthDateSupportText.isEmpty() && birthDate.isNotEmpty()

    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    val imageList = UserIcon.entries.map { it.icon }
    val pagerState = rememberPagerState(initialPage = 0) {
        imageList.size
    }
    val currentPage = pagerState.currentPage
    val currentIcon = UserIcon.entries[currentPage].id

    LaunchedEffect(name, email, password, confirmPassword, birthDate) {
        nameSupportText = when {
            name.isEmpty() -> context.getString(R.string.error_required_name)
            name.length > 50 -> context.getString(R.string.error_too_long_name)
            name.length < 6 -> context.getString(R.string.error_too_short_name)
            else -> ""
        }

        emailSupportText = when {
            email.isEmpty() -> context.getString(R.string.error_required_email)
            email.length > 100 -> context.getString(R.string.error_too_long_email)
            !Patterns.EMAIL_ADDRESS.matcher(email)
                .matches() -> context.getString(R.string.error_invalid_email)

            else -> ""
        }

        passwordSupportText = when {
            password.isEmpty() -> context.getString(R.string.error_required_password)
            password.length < 6 -> context.getString(R.string.error_too_short_password)
            else -> ""
        }

        confirmPasswordSupportText = when {
            confirmPassword.isEmpty() -> context.getString(R.string.error_required_confirm_password)
            confirmPassword != password -> context.getString(R.string.error_passwords_do_not_match)
            else -> ""
        }

        birthDateSupportText = when {
            birthDate.isEmpty() -> context.getString(R.string.error_required_date)
            else -> ""
        }
    }

    LaunchedEffect(registerState) {
        registerState?.onSuccess {
            nameSupportText = ""
            emailSupportText = ""
            passwordSupportText = ""
            confirmPasswordSupportText = ""
            birthDateSupportText = ""
            isLoading = false

            scope.launch {
                onRegisterSuccess()
            }
        }

        registerState?.onFailure { error ->
            when {
                error.message?.contains("Email") == true -> {
                    emailSupportText = context.getString(R.string.error_in_use_email)
                    nameSupportText = ""
                    passwordSupportText = ""
                    confirmPasswordSupportText = ""
                    birthDateSupportText = ""
                    isLoading = false
                }

                else -> {
                    nameSupportText = ""
                    emailSupportText = ""
                    passwordSupportText = ""
                    confirmPasswordSupportText = ""
                    birthDateSupportText = ""
                    isLoading = false
                }
            }
        }
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = context.getString(R.string.register),
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(onClick = {
                        navigateToBack()
                    }) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Rounded.ArrowBack,
                            contentDescription = "Back"
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Column(
                    modifier = Modifier.padding(bottom = 10.dp)
                ) {
                    IconCarousel(
                        imageList = imageList,
                        pagerState = pagerState
                    )
                }
            }

            item {
                Column(
                    modifier = Modifier.padding(horizontal = 68.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    NextTextField(
                        label = context.getString(R.string.name),
                        value = name,
                        supportText = nameSupportText,
                        onValueChange = { name = it }
                    )
                    NextTextField(
                        label = context.getString(R.string.email),
                        value = email,
                        supportText = emailSupportText,
                        onValueChange = { email = it },
                        keyboardType = KeyboardType.Email
                    )
                    NextTextField(
                        label = context.getString(R.string.password),
                        value = password,
                        supportText = passwordSupportText,
                        onValueChange = { password = it },
                        keyboardType = KeyboardType.Password,
                        visualTransformation = PasswordVisualTransformation()
                    )
                    NextTextField(
                        label = context.getString(R.string.confirm_password),
                        value = confirmPassword,
                        supportText = confirmPasswordSupportText,
                        onValueChange = { confirmPassword = it },
                        keyboardType = KeyboardType.Password,
                        visualTransformation = PasswordVisualTransformation()
                    )
                    ClickableTextField(
                        label = context.getString(R.string.birthdate),
                        value = birthDate,
                        supportText = birthDateSupportText,
                        trailingIcon = {
                            Icon(
                                imageVector = Icons.Rounded.DateRange,
                                contentDescription = "Calendar"
                            )
                        },
                        onClick = { showDatePicker = true }
                    )
                }
            }

            item {
                SanitaryButton(
                    text = context.getString(R.string.register_action),
                    onClick = {
                        if (isAllowedToRegister) {
                            scope.launch {
                                onRegister(
                                    name,
                                    email,
                                    password,
                                    currentIcon,
                                    birthDate
                                )
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 20.dp)
                        .padding(horizontal = 100.dp),
                    isLoading = isLoading,
                    enabled = isAllowedToRegister
                )
            }
        }

        if (showDatePicker) {
            CustomDatePickerDialog(
                onDateSelected = { birthDate = it },
                onDismiss = { }
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun RegisterScreenPreview() {
    RegisterScreen()
}