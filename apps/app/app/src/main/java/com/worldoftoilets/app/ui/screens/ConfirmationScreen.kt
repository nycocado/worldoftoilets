package com.worldoftoilets.app.ui.screens

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
import com.worldoftoilets.app.models.enums.ConfirmationType
import com.worldoftoilets.app.ui.theme.AppTheme
import com.worldoftoilets.app.R

import androidx.compose.material3.TopAppBarDefaults

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConfirmationScreen(
    confirmation: ConfirmationType,
    onClickConfirm: (ConfirmationType) -> Unit = {},
    navigateToBack: () -> Unit = {}
) {
    val iconSize = 140.dp // Slightly larger
    val context = LocalContext.current

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {}, // No title in confirmation screen for cleaner look
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
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
        bottomBar = {
            com.worldoftoilets.app.ui.components.SanitaryButton(
                text = context.getString(R.string.confirm),
                onClick = { onClickConfirm(confirmation) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 32.dp)
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
                // Icon Container
                Box(
                    modifier = Modifier
                        .padding(bottom = 32.dp)
                        .size(iconSize)
                        .background(
                            color = when (confirmation.confirmation) {
                                true -> MaterialTheme.colorScheme.secondaryContainer // Softer green container
                                false -> MaterialTheme.colorScheme.errorContainer // Softer red container
                            },
                            shape = CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = confirmation.icon,
                        contentDescription = null,
                        tint = when (confirmation.confirmation) {
                            true -> MaterialTheme.colorScheme.onSecondaryContainer // Darker green icon
                            false -> MaterialTheme.colorScheme.onErrorContainer // Darker red icon
                        },
                        modifier = Modifier.size(iconSize * 0.6f)
                    )
                }
            }
            item {
                Column(
                    modifier = Modifier.padding(horizontal = 32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Text(
                        text = context.getString(confirmation.title),
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center
                    )
                    Text(
                        text = context.getString(confirmation.text),
                        style = MaterialTheme.typography.bodyLarge,
                        textAlign = TextAlign.Center,
                        color = MaterialTheme.colorScheme.onSurfaceVariant // Muted text color
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