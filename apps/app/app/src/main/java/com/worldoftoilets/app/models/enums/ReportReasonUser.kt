package com.worldoftoilets.app.models.enums

import com.worldoftoilets.app.R

enum class ReportReasonUser(val apiValue: String, val labelRes: Int) {
    HARASSMENT_ABUSE("harassment-abuse", R.string.report_user_harassment_abuse),
    FAKE_ACCOUNT("fake-account", R.string.report_user_fake_account),
    IMPERSONATION("impersonation", R.string.report_user_impersonation),
    HATE_SPEECH("hate-speech", R.string.report_user_hate_speech),
    PRIVACY_VIOLATION("privacy-violation", R.string.report_user_privacy_violation),
    SPAM("spam", R.string.report_user_spam),
    OTHERS("others", R.string.report_user_others)
}
