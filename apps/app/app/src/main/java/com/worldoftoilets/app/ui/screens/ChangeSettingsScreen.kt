package com.worldoftoilets.app.ui.screens

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
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.models.enums.ChangeSettingType
import com.worldoftoilets.app.ui.components.ClickableTextField
import com.worldoftoilets.app.ui.components.GoTextField
import com.worldoftoilets.app.ui.components.NextTextField
import com.worldoftoilets.app.ui.theme.AppTheme
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import com.worldoftoilets.app.R

import androidx.compose.material3.TopAppBarDefaults

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChangeSettingsScreen(
    updateUserStateFlow: StateFlow<Result<User>?>,
    changeSettingType: ChangeSettingType,
    navigateToBack: () -> Unit = {},
    onChangeName: (String) -> Unit = {},
    onChangeSuccess: () -> Unit = {}
) {
    val updateUserState by updateUserStateFlow.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var name by remember { mutableStateOf("") }
    var nameSupportText by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    val isAllowedToChangeName = nameSupportText.isEmpty() && name.isNotEmpty()

    LaunchedEffect(name) {
        nameSupportText = when {
            name.isEmpty() -> context.getString(R.string.error_required_name)
            name.length > 50 -> context.getString(R.string.error_too_long_name)
            name.length < 6 -> context.getString(R.string.error_too_short_name)
            else -> ""
        }
    }

    LaunchedEffect(updateUserState) {
        updateUserState?.onSuccess {
            nameSupportText = ""
            isLoading = false

            scope.launch {
                onChangeSuccess()
            }
        }

        updateUserState?.onFailure {
            nameSupportText = ""
            isLoading = false
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
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            item {
                Column(
                    modifier = Modifier.padding(horizontal = 42.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    if (changeSettingType == ChangeSettingType.NAME) {
                        NextTextField(
                            label = context.getString(R.string.name),
                            value = name,
                            supportText = nameSupportText,
                            onValueChange = { name = it }
                        )
                    }
                }
            }

            item {
                Button(
                    onClick = {
                        if (changeSettingType == ChangeSettingType.NAME) {
                            if (isAllowedToChangeName) {
                                scope.launch {
                                    onChangeName(name)
                                    isLoading = true
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
fun ChangeSettingsPreview() {
    AppTheme {
        ChangeSettingsScreen(
            updateUserStateFlow = MutableStateFlow(null),
            changeSettingType = ChangeSettingType.NAME
        )
    }
}