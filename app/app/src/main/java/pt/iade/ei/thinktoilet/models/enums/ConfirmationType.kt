package pt.iade.ei.thinktoilet.models.enums

enum class ConfirmationType(
    val confirmation: String,
    val type: String
) {
    REPORT_TOILET_SUCCESS("success", "report-toilet"),
    REPORT_TOILET_FAILURE("failure", "report-toilet"),
    REPORT_COMMENT_SUCCESS("success", "report-comment"),
    REPORT_COMMENT_FAILURE("failure", "report-comment"),
    SUGGEST_TOILET_SUCCESS("success", "suggest-toilet"),
    SUGGEST_TOILET_FAILURE("failure", "suggest-toilet"),
}