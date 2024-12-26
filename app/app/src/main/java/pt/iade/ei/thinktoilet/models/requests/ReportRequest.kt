package pt.iade.ei.thinktoilet.models.requests

data class ReportRequest(
    val toiletId: Int,
    val userId: Int,
    val typeReport: String
)
