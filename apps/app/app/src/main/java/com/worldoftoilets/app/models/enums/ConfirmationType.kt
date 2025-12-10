package com.worldoftoilets.app.models.enums

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Done
import androidx.compose.material.icons.filled.Email
import androidx.compose.ui.graphics.vector.ImageVector
import com.worldoftoilets.app.R

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
    REPORT_REPLY_SUCCESS(
        true,
        "report-reply",
        R.string.confirmation_report_success,
        R.string.confirmation_report_success_text,
        Icons.Default.Done
    ),
    REPORT_REPLY_FAILURE(
        false,
        "report-reply",
        R.string.confirmation_report_failure,
        R.string.confirmation_report_failure_text,
        Icons.Default.Close
    ),
    REPORT_USER_SUCCESS(
        true,
        "report-user",
        R.string.confirmation_report_success,
        R.string.confirmation_report_success_text,
        Icons.Default.Done
    ),
    REPORT_USER_FAILURE(
        false,
        "report-user",
        R.string.confirmation_report_failure,
        R.string.confirmation_report_failure_text,
        Icons.Default.Close
    ),
    REGISTER_SUCCESS(
        true,
        "register",
        R.string.confirmation_register_success,
        R.string.confirmation_register_success_text,
        Icons.Default.Email
    ),
    FORGOT_PASSWORD_SUCCESS(
        true,
        "forgot-password",
        R.string.forgot_password_success,
        R.string.forgot_password_success_text,
        Icons.Default.Email
    ),
    SUGGEST_SUCCESS(
        true,
        "suggest",
        R.string.confirmation_suggest_success,
        R.string.confirmation_suggest_success_text,
        Icons.Default.Done
    ),
    SUGGEST_FAILURE(
        false,
        "suggest",
        R.string.confirmation_suggest_failure,
        R.string.confirmation_suggest_failure_text,
        Icons.Default.Close
    )
}