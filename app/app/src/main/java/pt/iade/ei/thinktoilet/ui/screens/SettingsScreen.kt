package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.tests.generateCarouselImage
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.ui.components.SettingsCarousel
import pt.iade.ei.thinktoilet.ui.components.ChangeEmailTextField
import pt.iade.ei.thinktoilet.ui.components.ChangeNameTextField
import pt.iade.ei.thinktoilet.ui.components.ChangePasswordTextField
import pt.iade.ei.thinktoilet.ui.navegation.AppGraph
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    user: User,
    navigateToBack: () -> Unit = {},
    onChange: (String) -> Unit = {},
) {
    val imageList = generateCarouselImage()

    val pagerState = rememberPagerState(initialPage = 0) {
        imageList.size
    }

    val context = LocalContext.current

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
                SettingsCarousel(
                    imageList = imageList,
                    pagerState = pagerState
                )
                Text(
                    modifier = Modifier.padding(top = 10.dp),
                    text = user.name,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.SemiBold,
                )
                Text(
                    modifier = Modifier.padding(top = 3.dp, bottom = 40.dp),
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
                ) {
                    ChangeNameTextField(
                        name = user.name,
                        onClick = {
                            onChange(AppGraph.settings.SETTINGS_CHANGE_NAME)
                        }
                    )
                    ChangeEmailTextField(
                        email = user.email!!,
                        onClick = {
                            onChange(AppGraph.settings.SETTINGS_CHANGE_EMAIL)
                        }
                    )
                    ChangePasswordTextField(
                        onClick = {
                            onChange(AppGraph.settings.SETTINGS_CHANGE_PASSWORD)
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
            user = generateUserMain()
        )
    }
}