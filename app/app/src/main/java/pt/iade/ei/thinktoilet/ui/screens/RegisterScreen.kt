package pt.iade.ei.thinktoilet.ui.screens

import android.annotation.SuppressLint
import android.util.Patterns
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarColors
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
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.ApiResponse
import pt.iade.ei.thinktoilet.ui.components.CustomDatePickerDialog
import java.text.ParseException
import java.text.SimpleDateFormat

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(
    registerStateFlow: StateFlow<Result<ApiResponse>?> = MutableStateFlow(null),
    onRegister: (name: String, email: String, password: String, iconId: String?, birthDate: String?) -> Unit = { _, _, _, _, _ -> },
    onRegisterSuccess: () -> Unit = {},
    onClickBack: () -> Unit = {}
) {
    val registerState = registerStateFlow.collectAsState().value
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var birthDate by remember { mutableStateOf("") }
    var nameSupportText by remember { mutableStateOf("") }
    var emailSupportText by remember { mutableStateOf("") }
    var passwordSupportText by remember { mutableStateOf("") }
    var confirmPasswordSupportText by remember { mutableStateOf("") }

    val context = LocalContext.current

    var showDatePicker by remember { mutableStateOf(false) }

    LaunchedEffect(name) {
        nameSupportText = if (name.isEmpty()) {
            "O nome é obrigatório"
        } else if (name.length < 6) {
            "O nome deve ter pelo menos 6 caracteres"
        } else {
            ""
        }
    }

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
        } else if (password.length < 6) {
            "A palavra-passe deve ter pelo menos 6 caracteres"
        } else {
            ""
        }
    }

    LaunchedEffect(confirmPassword, password) {
        confirmPasswordSupportText = if (confirmPassword.isEmpty()) {
            "A confirmação da palavra-passe é obrigatória"
        } else if (confirmPassword != password) {
            "As palavras-passe não coincidem"
        } else {
            ""
        }
    }

    LaunchedEffect(registerState) {
        registerState?.onSuccess {
            nameSupportText = ""
            emailSupportText = ""
            passwordSupportText = ""
            confirmPasswordSupportText = ""

            onRegisterSuccess()
        }

        registerState?.onFailure { error ->
            when {
                error.message?.contains("Email") == true -> {
                    emailSupportText = "Email em uso"
                    nameSupportText = ""
                    passwordSupportText = ""
                    confirmPasswordSupportText = ""
                }

                else -> {
                    nameSupportText = "Erro ao registar"
                    emailSupportText = ""
                    passwordSupportText = ""
                    confirmPasswordSupportText = ""
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
                        onClickBack()
                    }) {
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
                .padding(innerPadding)
                .padding(horizontal = 68.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                OutlinedTextField(
                    modifier = Modifier.fillMaxWidth(),
                    value = name,
                    onValueChange = {
                        name = it
                    },
                    label = { Text("Nome") },
                    isError = nameSupportText.isNotEmpty(),
                    supportingText = { Text(nameSupportText) },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Text,
                        imeAction = ImeAction.Next
                    )
                )
                OutlinedTextField(
                    modifier = Modifier.fillMaxWidth(),
                    value = email,
                    onValueChange = {
                        email = it
                    },
                    label = { Text("E-mail") },
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
                        imeAction = ImeAction.Next
                    ),
                    visualTransformation = PasswordVisualTransformation()
                )
                OutlinedTextField(
                    modifier = Modifier.fillMaxWidth(),
                    value = confirmPassword,
                    onValueChange = {
                        confirmPassword = it
                    },
                    label = { Text("Confirmar palavra-passe") },
                    isError = confirmPasswordSupportText.isNotEmpty(),
                    supportingText = { Text(confirmPasswordSupportText) },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Password,
                        imeAction = ImeAction.Next
                    ),
                    keyboardActions = KeyboardActions(
                        onNext = { showDatePicker = true }
                    ),
                    visualTransformation = PasswordVisualTransformation()
                )
                OutlinedTextField(
                    modifier = Modifier.fillMaxWidth(),
                    value = birthDate,
                    onValueChange = {
                        birthDate = it
                    },
                    label = { Text("Data de Nascimento") },
                    singleLine = true,
                    readOnly = true,
                    trailingIcon = {
                        IconButton(
                            onClick = { showDatePicker = true }
                        ) {
                            Icon(
                                imageVector = Icons.Default.DateRange,
                                contentDescription = "Select Date"
                            )
                        }
                    }
                )
            }

            item {
                Button(
                    onClick = {
                        if (nameSupportText.isEmpty() && emailSupportText.isEmpty() && passwordSupportText.isEmpty() && confirmPasswordSupportText.isEmpty())
                            onRegister(name, email, password, null, formatBirthDate(birthDate))
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
                        text = "Registar",
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }

        if (showDatePicker) {
            CustomDatePickerDialog(
                onDateSelected = { birthDate = it },
                onDismiss = { showDatePicker = false }
            )
        }
    }
}

@SuppressLint("SimpleDateFormat")
private fun formatBirthDate(birthDate: String): String? {
    if(birthDate.isEmpty()) return null

    val inputFormat = SimpleDateFormat("dd/MM/yyyy")
    val outputFormat = SimpleDateFormat("yyyy-MM-dd")
    return try {
        val date = inputFormat.parse(birthDate)
        date?.let { outputFormat.format(it) }
    } catch (e: ParseException) {
        null
    }
}

@Preview(showBackground = true)
@Composable
fun RegisterScreenPreview() {
    RegisterScreen()
}