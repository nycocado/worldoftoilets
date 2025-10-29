package com.worldoftoilets.app.models.enums

import com.worldoftoilets.app.R

enum class TypeAccess(
    val id: Int,
    val value: Int,
    val technicalValue: String
) {
    PUBLIC(1, R.string.access_public, "public"),
    PRIVATE(2, R.string.access_private, "private"),
    CONSUMERS_ONLY(3, R.string.access_consumers_only, "consumers-only"),
}