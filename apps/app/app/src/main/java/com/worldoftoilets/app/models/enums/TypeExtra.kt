package com.worldoftoilets.app.models.enums

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.Accessible
import androidx.compose.material.icons.rounded.BabyChangingStation
import androidx.compose.material.icons.rounded.LocalParking
import androidx.compose.material.icons.rounded.Visibility
import androidx.compose.ui.graphics.vector.ImageVector
import com.worldoftoilets.app.R

enum class TypeExtra(
    val id: Int,
    val value: Int,
    val icon: ImageVector,
    val technicalValue: String
) {
    WHEELCHAIR_ACCESSIBLE(
        id = 1,
        value = R.string.extra_wheelchair_accessible,
        icon = Icons.AutoMirrored.Rounded.Accessible,
        technicalValue = "wheelchair-accessible"
    ),
    BABY_CHANGING_STATION(
        id = 2,
        value = R.string.extra_baby_changing_station,
        icon = Icons.Rounded.BabyChangingStation,
        technicalValue = "baby-changing-station"
    ),
    DISABLED_PARKING(
        id = 3,
        value = R.string.extra_disabled_parking,
        icon = Icons.Rounded.LocalParking,
        technicalValue = "disabled-parking"
    ),
    ACCESSIBLE_FOR_VISUAL_IMPAIRMENT(
        id = 4,
        value = R.string.extra_accessible_for_visual_impairment,
        icon = Icons.Rounded.Visibility,
        technicalValue = "accessible-for-visually-impaired"
    )
}