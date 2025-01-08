package pt.iade.ei.thinktoilet.ui.screens

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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.enums.ConfirmationType
import pt.iade.ei.thinktoilet.models.enums.ReportType
import pt.iade.ei.thinktoilet.models.enums.TypeReaction
import pt.iade.ei.thinktoilet.models.enums.TypeReport
import pt.iade.ei.thinktoilet.models.responses.ApiResponse
import pt.iade.ei.thinktoilet.ui.components.ReportButton
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportScreen(
    reportStateFlow: StateFlow<Result<ApiResponse>?>,
    type: String,
    id: Int,
    navigateToBack: () -> Unit = {},
    onToiletReport: (Int, TypeReport) -> Unit = { _, _ -> },
    onCommentReport: (Int, TypeReaction) -> Unit = { _, _ -> },
    onReportConfirmation: (ConfirmationType) -> Unit = { }
) {
    val context = LocalContext.current
    val reportState = reportStateFlow.collectAsState().value
    val reportType = ReportType.entries.find { it.value == type }!!
    val invalidReactions = listOf(TypeReaction.LIKE, TypeReaction.DISLIKE, TypeReaction.NONE)

    LaunchedEffect(reportState){
        reportState?.onSuccess {
            if (reportType == ReportType.TOILET) {
                onReportConfirmation(ConfirmationType.REPORT_TOILET_SUCCESS)
            } else {
                onReportConfirmation(ConfirmationType.REPORT_COMMENT_SUCCESS)
            }
        }
        reportState?.onFailure {
            if (reportType == ReportType.TOILET) {
                onReportConfirmation(ConfirmationType.REPORT_TOILET_FAILURE)
            } else {
                onReportConfirmation(ConfirmationType.REPORT_COMMENT_FAILURE)
            }
        }
    }

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
                    IconButton(onClick = {
                        navigateToBack()
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
                    items(TypeReport.entries) { typeReport ->
                        ReportButton(
                            title = context.getString(typeReport.value)
                        ) {
                            onToiletReport(id, typeReport)
                        }
                    }
                }

                ReportType.COMMENT -> {
                    items(TypeReaction.entries) { typeReaction ->
                        if (!invalidReactions.contains(typeReaction)) {
                            ReportButton(
                                title = context.getString(typeReaction.value),
                                onClick = {
                                    onCommentReport(id, typeReaction)
                                }
                            )
                        }
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
            reportStateFlow = MutableStateFlow(null),
            type = "toilet",
            id = 1
        )
    }
}