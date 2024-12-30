package pt.iade.ei.thinktoilet.models.enums

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Done
import androidx.compose.ui.graphics.vector.ImageVector
import pt.iade.ei.thinktoilet.R

enum class ConfirmationType(
    val confirmation: Boolean,
    val type: String,
    val title: Int,
    val text: Int,
    val icon: ImageVector
) {
    REPORT_TOILET_SUCCESS(
        true,
        "report-toilet",
        R.string.confirmation_report_success,
        R.string.confirmation_report_success_text,
        Icons.Default.Done
    ),
    REPORT_TOILET_FAILURE(
        false,
        "report-toilet",
        R.string.confirmation_report_failure,
        R.string.confirmation_report_failure_text,
        Icons.Default.Close
    ),
    REPORT_COMMENT_SUCCESS(
        true,
        "report-comment",
        R.string.confirmation_report_success,
        R.string.confirmation_report_success_text,
        Icons.Default.Done
    ),
    REPORT_COMMENT_FAILURE(
        false,
        "report-comment",
        R.string.confirmation_report_failure,
        R.string.confirmation_report_failure_text,
        Icons.Default.Close
    ),
    SUGGEST_TOILET_SUCCESS(
        true,
        "suggest-toilet",
        R.string.confirmation_suggest_success,
        R.string.confirmation_suggest_success_text,
        Icons.Default.Done
    ),
    SUGGEST_TOILET_FAILURE(
        false,
        "suggest-toilet",
        R.string.confirmation_suggest_failure,
        R.string.confirmation_suggest_failure_text,
        Icons.Default.Close
    )
}