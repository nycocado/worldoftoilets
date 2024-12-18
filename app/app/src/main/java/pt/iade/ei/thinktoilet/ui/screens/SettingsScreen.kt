package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
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
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.tests.generateCarouselImage
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.ui.components.SettingsCarousel
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    navigateToBack: () -> Unit = {}
) {
    val imageList = generateCarouselImage()

    val pagerState = rememberPagerState(initialPage = 0) {
        imageList.size
    }
    var userName: String by remember { mutableStateOf("") }
    var userEmail: String by remember { mutableStateOf("") }
    var userOldPassword: String by remember { mutableStateOf("") }
    var userNewPassword: String by remember { mutableStateOf("") }
    var userNewPasswordVerification: String by remember { mutableStateOf("") }

    val context = LocalContext.current

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = "Configurações",
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
                .padding(innerPadding)
                .padding(horizontal = 16.dp)
        ) {
            item {
                SettingsCarousel(
                    imageList = imageList,
                    pagerState = pagerState,
                    user = generateUserMain()
                )
                Text(
                    text = "Alterar a Nome do Usuario",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                OutlinedTextField(value = userName, onValueChange = {
                    userName = it
                }, label = { Text("Alterar Nome do Usuario") })
                Text(
                    text = "Alterar a Email",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                OutlinedTextField(value = userEmail, onValueChange = {
                    userEmail = it
                }, label = { Text("Alterar Email") })
                Text(
                    text = "Alterar a Palavra-passe",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                OutlinedTextField(value = userOldPassword, onValueChange = {
                    userOldPassword = it
                }, label = { Text("Palavra-passe Atual") })
                OutlinedTextField(value = userNewPassword, onValueChange = {
                    userNewPassword = it
                }, label = { Text("Nova Palavra-passe") })
                OutlinedTextField(value = userNewPasswordVerification, onValueChange = {
                    userNewPasswordVerification = it
                }, label = { Text("Confirmar palavra-passe") })
            }

            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 10.dp),
                    horizontalArrangement = Arrangement.Center

                ) {
                    Button(
                        onClick = { navigateToBack() },
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
                            text = "Salvar Alterações",
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }
    }

}

@Composable
@Preview(showBackground = true)
fun SettingsPreview() {
    AppTheme {
        SettingsScreen()
    }
}