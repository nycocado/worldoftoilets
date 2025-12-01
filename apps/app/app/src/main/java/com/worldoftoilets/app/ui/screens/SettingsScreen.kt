package com.worldoftoilets.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.ArrowBack
import androidx.compose.material.icons.rounded.Person
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
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
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.models.enums.ChangeSettingType
import com.worldoftoilets.app.models.enums.UserIcon
import com.worldoftoilets.app.ui.components.ClickableTextField
import com.worldoftoilets.app.ui.components.IconCarousel
import com.worldoftoilets.app.ui.theme.AppTheme
import com.worldoftoilets.app.ui.util.generateUserMain
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    updateUserStateFlow: StateFlow<Result<User>?>,
    user: User,
    navigateToBack: () -> Unit = {},
    onChange: (ChangeSettingType) -> Unit = {},
    onChangeIcon: (String) -> Unit = {}
) {
    val scope = rememberCoroutineScope()
    val updateUserState by updateUserStateFlow.collectAsStateWithLifecycle()
    var isLoading by remember { mutableStateOf(false) }

    val imageList = UserIcon.entries.map { it.id }
    val initialPage = UserIcon.entries.indexOfFirst { it.id == user.icon }.takeIf { it != -1 } ?: 0

    val pagerState = rememberPagerState(initialPage = initialPage) {
        imageList.size
    }

    val currentPage = pagerState.currentPage
    val currentIcon = UserIcon.entries[currentPage].id

    val context = LocalContext.current

    LaunchedEffect(updateUserState) {
        updateUserState?.onSuccess {
            isLoading = false
        }

        updateUserState?.onFailure {
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
                            imageVector = Icons.AutoMirrored.Rounded.ArrowBack,
                            contentDescription = context.getString(R.string.content_description_back_button)
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
                            onChangeIcon(currentIcon)
                        }
                    },
                    modifier = Modifier
                        .padding(vertical = 24.dp)
                        .fillMaxWidth(0.6f),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                        contentColor = MaterialTheme.colorScheme.onTertiaryContainer
                    )
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(24.dp),
                            color = MaterialTheme.colorScheme.onTertiaryContainer
                        )
                    } else {
                        Text(
                            text = context.getString(R.string.save),
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                Text(
                    text = user.name,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                )
                Text(
                    modifier = Modifier.padding(top = 4.dp, bottom = 32.dp),
                    text = user.email!!,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
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
                                imageVector = Icons.Rounded.Person,
                                contentDescription = context.getString(R.string.content_description_change_name_icon)
                            )
                        },
                        onClick = {
                            onChange(ChangeSettingType.NAME)
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
            updateUserStateFlow = MutableStateFlow(null),
            user = generateUserMain()
        )
    }
}