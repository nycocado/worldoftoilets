package pt.iade.ei.thinktoilet.ui.screens

import android.util.Patterns
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.CircularProgressIndicator
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.models.enums.ChangeSettingType
import pt.iade.ei.thinktoilet.ui.components.GoTextField
import pt.iade.ei.thinktoilet.ui.components.NextTextField
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChangeSettingsScreen(
    editUserStateFlow: StateFlow<Result<User>?>,
    changeSettingType: ChangeSettingType,
    navigateToBack: () -> Unit = {},
    onChangeName: (String, String) -> Unit = { _, _ -> },
    onChangeEmail: (String, String) -> Unit = { _, _ -> },
    onChangePassword: (String, String) -> Unit = { _, _ -> },
    onChangeSuccess: (User) -> Unit = { }
) {
    val editUser = editUserStateFlow.collectAsState().value
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var newPassword by remember { mutableStateOf("") }
    var confirmNewPassword by remember { mutableStateOf("") }
    var nameSupportText by remember { mutableStateOf("") }
    var emailSupportText by remember { mutableStateOf("") }
    var passwordSupportText by remember { mutableStateOf("") }
    var newPasswordSupportText by remember { mutableStateOf("") }
    var confirmNewPasswordSupportText by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    val isAllowedToChangeName = nameSupportText.isEmpty() && passwordSupportText.isEmpty()
    val isAllowedToChangeEmail = emailSupportText.isEmpty() && passwordSupportText.isEmpty()
    val isAllowedToChangePassword =
        passwordSupportText.isEmpty() && newPasswordSupportText.isEmpty() && confirmNewPasswordSupportText.isEmpty()

    LaunchedEffect(name, email, password, newPassword, confirmNewPassword) {
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
            else -> ""
        }

        newPasswordSupportText = when {
            password.isEmpty() -> context.getString(R.string.error_required_password)
            password.length < 6 -> context.getString(R.string.error_too_short_password)
            else -> ""
        }

        confirmNewPasswordSupportText = when {
            confirmNewPassword.isEmpty() -> context.getString(R.string.error_required_password)
            confirmNewPassword != newPassword -> context.getString(R.string.error_passwords_do_not_match)
            else -> ""
        }
    }

    LaunchedEffect(editUser) {
        editUser?.onSuccess {
            nameSupportText = ""
            emailSupportText = ""
            passwordSupportText = ""
            newPasswordSupportText = ""
            confirmNewPasswordSupportText = ""
            isLoading = false

            scope.launch {
                onChangeSuccess(it)
            }
        }

        editUser?.onFailure {
            when {
                it.message?.contains("Email") == true -> {
                    emailSupportText = context.getString(R.string.error_in_use_email)
                    nameSupportText = ""
                    passwordSupportText = ""
                    newPasswordSupportText = ""
                    confirmNewPasswordSupportText = ""
                    isLoading = false
                }

                it.message?.contains("password") == true -> {
                    passwordSupportText = context.getString(R.string.error_invalid_password)
                    nameSupportText = ""
                    emailSupportText = ""
                    newPasswordSupportText = ""
                    confirmNewPasswordSupportText = ""
                    isLoading = false
                }

                else -> {
                    nameSupportText = ""
                    emailSupportText = ""
                    passwordSupportText = ""
                    newPasswordSupportText = ""
                    confirmNewPasswordSupportText = ""
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
                        text = context.getString(R.string.settings),
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(
                        onClick = { navigateToBack() }
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back"
                        )
                    }
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            item {
                Column(
                    modifier = Modifier.padding(horizontal = 42.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    when (changeSettingType) {
                        ChangeSettingType.NAME -> {
                            NextTextField(
                                label = context.getString(R.string.name),
                                value = name,
                                supportText = nameSupportText,
                                onValueChange = { name = it }
                            )
                            GoTextField(
                                label = context.getString(R.string.password),
                                value = password,
                                supportText = passwordSupportText,
                                onValueChange = { password = it },
                                onGo = {
                                    if (isAllowedToChangeName) {
                                        scope.launch {
                                            onChangeName(name, password)
                                            isLoading = true
                                        }
                                    }
                                },
                                keyboardType = KeyboardType.Password,
                                visualTransformation = PasswordVisualTransformation()
                            )
                        }

                        ChangeSettingType.EMAIL -> {
                            NextTextField(
                                label = context.getString(R.string.email),
                                value = email,
                                supportText = emailSupportText,
                                onValueChange = { email = it }
                            )
                            GoTextField(
                                label = context.getString(R.string.password),
                                value = password,
                                supportText = passwordSupportText,
                                onValueChange = { password = it },
                                onGo = {
                                    if (isAllowedToChangeEmail) {
                                        scope.launch {
                                            onChangeEmail(email, password)
                                            isLoading = true
                                        }
                                    }
                                },
                                keyboardType = KeyboardType.Password,
                                visualTransformation = PasswordVisualTransformation()
                            )
                        }

                        ChangeSettingType.PASSWORD -> {
                            NextTextField(
                                label = context.getString(R.string.password),
                                value = password,
                                supportText = passwordSupportText,
                                onValueChange = { password = it }
                            )
                            NextTextField(
                                label = context.getString(R.string.new_password),
                                value = newPassword,
                                supportText = newPasswordSupportText,
                                onValueChange = { newPassword = it }
                            )
                            GoTextField(
                                label = context.getString(R.string.confirm_new_password),
                                value = confirmNewPassword,
                                supportText = confirmNewPasswordSupportText,
                                onValueChange = { confirmNewPassword = it },
                                onGo = {
                                    if (isAllowedToChangePassword) {
                                        scope.launch {
                                            onChangePassword(password, newPassword)
                                            isLoading = true
                                        }
                                    }
                                },
                                keyboardType = KeyboardType.Password,
                                visualTransformation = PasswordVisualTransformation()
                            )
                        }
                    }
                }
            }

            item {
                Button(
                    onClick = {
                        when (changeSettingType) {
                            ChangeSettingType.NAME -> {
                                if (isAllowedToChangeName) {
                                    scope.launch {
                                        onChangeName(name, password)
                                        isLoading = true
                                    }
                                }
                            }

                            ChangeSettingType.EMAIL -> {
                                if (isAllowedToChangeEmail) {
                                    scope.launch {
                                        onChangeEmail(email, password)
                                        isLoading = true
                                    }
                                }
                            }

                            ChangeSettingType.PASSWORD -> {
                                if (isAllowedToChangePassword) {
                                    scope.launch {
                                        onChangePassword(password, newPassword)
                                        isLoading = true
                                    }
                                }
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 20.dp)
                        .padding(horizontal = 100.dp),
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
                            text = context.getString(R.string.edit_profile),
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.SemiBold,
                            maxLines = 1,
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
fun ChangeSettingsScreenPreview() {
    AppTheme {
        ChangeSettingsScreen(
            editUserStateFlow = MutableStateFlow(null),
            changeSettingType = ChangeSettingType.NAME
        )
    }
}