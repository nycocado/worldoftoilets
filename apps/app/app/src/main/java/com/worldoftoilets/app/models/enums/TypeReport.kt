package com.worldoftoilets.app.models.enums

import com.worldoftoilets.app.R

enum class TypeReport(
    val id: Int,
    val value: Int,
    val technicalValue: String
) {
    FAKE_INFORMATION(id = 1, value = R.string.report_fake_information, technicalValue = "fake-information"),
    UNSANITARY_CONDITIONS(id = 2, value = R.string.report_unsanitary_conditions, technicalValue = "unsanitary-conditions"),
    PRIVACY_VIOLATION(id = 3, value = R.string.report_privacy_violation, technicalValue = "privacy-violation"),
    MAINTENANCE_NEEDED(id = 4, value = R.string.report_maintenance_needed, technicalValue = "maintenance-needed"),
    DAMAGED_EQUIPMENT(id = 5, value = R.string.report_damaged_equipment, technicalValue = "damaged-equipment"),
    OTHER(id = 6, value = R.string.report_others, technicalValue = "others")
}