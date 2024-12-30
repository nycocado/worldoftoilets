package pt.iade.ei.thinktoilet.models.enums

import pt.iade.ei.thinktoilet.R

enum class UserIcon(
    val id: String?,
    val icon: Int
) {
    ICON_DEFAULT("icon_default", R.drawable.icon_default),
    ICON_1("icon_1", R.drawable.icon1),
    ICON_2("icon_2", R.drawable.icon2),
    ICON_3("icon_3", R.drawable.icon3),
    ICON_4("icon_4", R.drawable.icon4),
    ICON_5("icon_5", R.drawable.icon5),
    ICON_6("icon_6", R.drawable.icon6)
}