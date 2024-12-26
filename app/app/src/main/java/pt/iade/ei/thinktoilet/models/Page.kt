package pt.iade.ei.thinktoilet.models

data class Page(
    val number: Int,
    val size: Int = 20,
    val isLast: Boolean
)