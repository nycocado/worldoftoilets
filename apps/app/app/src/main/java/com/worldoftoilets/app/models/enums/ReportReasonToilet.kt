package com.worldoftoilets.app.models.enums

import com.worldoftoilets.app.R

enum class ReportReasonToilet(val apiValue: String, val labelRes: Int) {
    FAKE_INFORMATION("fake-information", R.string.report_fake_information),
    UNSANITARY_CONDITIONS("unsanitary-conditions", R.string.report_unsanitary_conditions),
    PRIVACY_VIOLATION("privacy-violation", R.string.report_privacy_violation),
    MAINTENANCE_NEEDED("maintenance-needed", R.string.report_maintenance_needed),
    DAMAGED_EQUIPMENT("damaged-equipment", R.string.report_damaged_equipment),
    OTHERS("others", R.string.report_others)
}
