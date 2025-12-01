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
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.enums.ConfirmationType
import com.worldoftoilets.app.ui.theme.AppTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConfirmationScreen(
    confirmation: ConfirmationType,
    onClickConfirm: (ConfirmationType) -> Unit = {},
    onClickResend: (() -> Unit)? = null,
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
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 32.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                if ((confirmation == ConfirmationType.REGISTER_SUCCESS || confirmation == ConfirmationType.FORGOT_PASSWORD_SUCCESS) && onClickResend != null) {
                    androidx.compose.material3.TextButton(
                        onClick = { onClickResend() },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = context.getString(R.string.resend_verification),
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
                com.worldoftoilets.app.ui.components.SanitaryButton(
                    text = context.getString(R.string.confirm),
                    onClick = { onClickConfirm(confirmation) },
                    modifier = Modifier.fillMaxWidth()
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
                        contentDescription = context.getString(R.string.image_description_null),
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