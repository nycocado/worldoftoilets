package com.worldoftoilets.app.models.requests

data class ReportRequest(
    val toiletId: Int,
    val userId: Int,
    val typeReport: String
)
