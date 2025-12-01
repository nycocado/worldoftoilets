package com.worldoftoilets.app.models.enums

import com.worldoftoilets.app.R

enum class UserIcon(
    val id: String,
    val drawableResId: Int
) {
    ICON_DEFAULT("icon-default", 0),
    ICON_1("icon-1", R.drawable.icon1),
    ICON_2("icon-2", R.drawable.icon2),
    ICON_3("icon-3", R.drawable.icon3),
    ICON_4("icon-4", R.drawable.icon4),
    ICON_5("icon-5", R.drawable.icon5),
    ICON_6("icon-6", R.drawable.icon6)
}