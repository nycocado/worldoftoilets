package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.models.enums.ChangeSettingType
import pt.iade.ei.thinktoilet.models.enums.UserIcon
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.ui.components.ClickableTextField
import pt.iade.ei.thinktoilet.ui.components.IconCarousel
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    editUserStateFlow: StateFlow<Result<User>?>,
    user: User,
    navigateToBack: () -> Unit = {},
    onChange: (ChangeSettingType) -> Unit = {},
    onChangeIcon: (String) -> Unit = {},
    onChangeIconSuccess: (User) -> Unit = {}
) {
    val scope = rememberCoroutineScope()
    val editUser = editUserStateFlow.collectAsState().value
    var isLoading by remember { mutableStateOf(false) }

    val imageList = UserIcon.entries.map { it.icon }
    val initialPage = UserIcon.entries.indexOfFirst { it.id == user.iconId }

    val pagerState = rememberPagerState(initialPage = initialPage) {
        imageList.size
    }

    val currentPage = pagerState.currentPage
    val currentIcon = UserIcon.entries[currentPage].id

    val context = LocalContext.current

    LaunchedEffect(editUser) {
        editUser?.onSuccess {
            isLoading = false
            onChangeIconSuccess(it)
        }

        editUser?.onFailure {
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
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                IconCarousel(
                    imageList = imageList,
                    pagerState = pagerState
                )
                Button(
                    onClick = {
                        scope.launch {
                            onChangeIcon(currentIcon!!)
                            isLoading = true
                        }
                    },
                    modifier = Modifier
                        .padding(bottom = 20.dp),
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
                    when (isLoading) {
                        true -> {
                            CircularProgressIndicator(
                                modifier = Modifier.size(24.dp)
                            )
                        }

                        false -> {
                            Text(
                                text = context.getString(R.string.save),
                                style = MaterialTheme.typography.bodyLarge,
                                fontWeight = FontWeight.SemiBold,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    }
                }
                Text(
                    text = user.name,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.SemiBold,
                )
                Text(
                    modifier = Modifier.padding(top = 3.dp, bottom = 20.dp),
                    text = user.email!!,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.primaryContainer
                )
            }

            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 42.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(20.dp)
                ) {
                    ClickableTextField(
                        label = context.getString(R.string.change_name),
                        value = user.name,
                        trailingIcon = {
                            Icon(
                                imageVector = Icons.Filled.Person,
                                contentDescription = "Change Name"
                            )
                        },
                        onClick = {
                            onChange(ChangeSettingType.NAME)
                        }
                    )
                    ClickableTextField(
                        label = context.getString(R.string.change_email),
                        value = user.email!!,
                        trailingIcon = {
                            Icon(
                                imageVector = Icons.Filled.Email,
                                contentDescription = "Change Email"
                            )
                        },
                        onClick = {
                            onChange(ChangeSettingType.EMAIL)
                        }
                    )
                    ClickableTextField(
                        label = context.getString(R.string.change_password),
                        trailingIcon = {
                            Icon(
                                imageVector = Icons.Filled.Lock,
                                contentDescription = "Change Password"
                            )
                        },
                        onClick = {
                            onChange(ChangeSettingType.PASSWORD)
                        }
                    )
                }
            }
        }
    }
}

@Composable
@Preview(showBackground = true)
fun SettingsPreview() {
    AppTheme {
        SettingsScreen(
            editUserStateFlow = MutableStateFlow(null),
            user = generateUserMain()
        )
    }
}