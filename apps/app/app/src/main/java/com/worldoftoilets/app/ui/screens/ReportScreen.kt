package com.worldoftoilets.app.ui.screens

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.enums.ConfirmationType
import com.worldoftoilets.app.models.enums.ReportReasonComment
import com.worldoftoilets.app.models.enums.ReportReasonToilet
import com.worldoftoilets.app.models.enums.ReportType
import com.worldoftoilets.app.ui.components.ReportButton
import com.worldoftoilets.app.ui.theme.AppTheme
import com.worldoftoilets.app.ui.util.generateReportResultFlow
import kotlinx.coroutines.flow.StateFlow

import androidx.compose.material3.TopAppBarDefaults

import com.worldoftoilets.app.models.enums.ReportReasonReply

import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportScreen(
    type: String,
    id: String,
    reportStateFlow: StateFlow<Result<Unit>?>,
    navigateToBack: () -> Unit = {},
    onToiletReport: (toiletPublicId: String, typeReport: String) -> Unit = { _, _ -> },
    onCommentReport: (commentPublicId: String, typeReport: String) -> Unit = { _, _ -> },
    onReplyReport: (replyPublicId: String, typeReport: String) -> Unit = { _, _ -> },
    onReportConfirmation: (ConfirmationType) -> Unit = {}
) {
    val context = LocalContext.current
    val reportType = ReportType.entries.find { it.value == type }!!
    val reportState by reportStateFlow.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    LaunchedEffect(reportState) {
        reportState?.onSuccess {
            val confirmationType = when (reportType) {
                ReportType.TOILET -> ConfirmationType.REPORT_TOILET_SUCCESS
                ReportType.COMMENT -> ConfirmationType.REPORT_COMMENT_SUCCESS
                ReportType.REPLY -> ConfirmationType.REPORT_REPLY_SUCCESS
            }
            onReportConfirmation(confirmationType)
        }
        reportState?.onFailure {
            scope.launch {
                snackbarHostState.showSnackbar(it.message ?: context.getString(R.string.error_unexpected))
            }
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
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
                    IconButton(onClick = {
                        navigateToBack()
                    }) {
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
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 40.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        modifier = Modifier.padding(top = 60.dp, bottom = 20.dp),
                        text = when (reportType) {
                            ReportType.TOILET -> context.getString(R.string.report_why_toilet)
                            ReportType.COMMENT -> context.getString(R.string.report_why_comment)
                            ReportType.REPLY -> context.getString(R.string.report_why_comment) // Reuse comment string for now
                        },
                        style = MaterialTheme.typography.titleLarge,
                        textAlign = TextAlign.Center,
                    )
                    Text(
                        text = context.getString(R.string.report_anonymous),
                        style = MaterialTheme.typography.bodySmall,
                    )
                }
            }

            when (reportType) {
                ReportType.TOILET -> {
                    items(ReportReasonToilet.entries) { reason ->
                        ReportButton(
                            title = context.getString(reason.labelRes)
                        ) {
                            onToiletReport(id, reason.apiValue)
                        }
                    }
                }

                ReportType.COMMENT -> {
                    items(ReportReasonComment.entries) { reason ->
                        ReportButton(
                            title = context.getString(reason.labelRes),
                            onClick = {
                                onCommentReport(id, reason.apiValue)
                            }
                        )
                    }
                }

                ReportType.REPLY -> {
                    items(ReportReasonReply.entries) { reason ->
                        ReportButton(
                            title = context.getString(reason.labelRes),
                            onClick = {
                                onReplyReport(id, reason.apiValue)
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
@Preview(showBackground = true)
fun PreviewReportScreen() {
    AppTheme {
        ReportScreen(
            type = "toilet",
            id = "1",
            reportStateFlow = generateReportResultFlow()
        )
    }
}