package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.enums.ConfirmationType
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConfirmationScreen(
    confirmation: ConfirmationType,
    onClickConfirm: (ConfirmationType) -> Unit = {},
    navigateToBack: () -> Unit = {}
) {
    val iconSize = 120.dp
    val context = LocalContext.current

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = context.getString(R.string.report),
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    if (!confirmation.confirmation) {
                        IconButton(
                            onClick = {
                                navigateToBack()
                            }
                        ) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                contentDescription = context.getString(R.string.back)
                            )
                        }
                    }
                }
            )
        },
        bottomBar = {
            Button(
                onClick = { onClickConfirm(confirmation) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 50.dp)
                    .padding(top = 30.dp),
                colors = ButtonColors(
                    containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                    contentColor = MaterialTheme.colorScheme.onTertiaryContainer,
                    disabledContainerColor = MaterialTheme.colorScheme.tertiaryContainer.copy(
                        alpha = 0.5f
                    ),
                    disabledContentColor = MaterialTheme.colorScheme.onTertiaryContainer.copy(
                        alpha = 0.5f
                    )
                )
            ) {
                Text(
                    text = context.getString(R.string.confirm),
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Bold,
                )
            }
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
                Box(
                    modifier = Modifier
                        .padding(bottom = 50.dp)
                        .size(iconSize)
                        .background(
                            color = when (confirmation.confirmation) {
                                true -> MaterialTheme.colorScheme.primaryContainer
                                false -> MaterialTheme.colorScheme.error
                            },
                            shape = CircleShape
                        ), contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = confirmation.icon,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(iconSize * 0.85f)
                    )
                }
            }
            item {
                Column(
                    modifier = Modifier.padding(horizontal = 30.dp),
                    verticalArrangement = Arrangement.spacedBy(18.dp),
                ) {
                    Text(
                        text = context.getString(confirmation.title),
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = context.getString(confirmation.text),
                        style = MaterialTheme.typography.bodyLarge,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}


@Composable
@Preview(showBackground = true)
fun ConfirmationScreenPreview() {
    AppTheme {
        ConfirmationScreen(
            confirmation = ConfirmationType.REPORT_TOILET_SUCCESS
        )
    }
}