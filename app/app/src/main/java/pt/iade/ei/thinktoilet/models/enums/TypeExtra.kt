package pt.iade.ei.thinktoilet.models.enums

import pt.iade.ei.thinktoilet.R

enum class TypeExtra(
    val id: Int,
    val value: Int,
    val icon: Int,
    val technicalValue: String
) {
    WHEELCHAIR_ACCESSIBLE(
        id = 1,
        value = R.string.extra_wheelchair_accessible,
        icon = R.drawable.accessible_24px,
        technicalValue = "wheelchair_accessible"
    ),
    BABY_CHANGING_STATION(
        id = 2,
        value = R.string.extra_baby_changing_station,
        icon = R.drawable.baby_changing_station_24px,
        technicalValue = "baby_changing_station"
    ),
    DISABLED_PARKING(
        id = 3,
        value = R.string.extra_disabled_parking,
        icon = R.drawable.local_parking_24px,
        technicalValue = "disabled_parking"
    ),
    ACCESSIBLE_FOR_VISUAL_IMPAIRMENT(
        id = 4,
        value = R.string.extra_accessible_for_visual_impairment,
        icon = R.drawable.visibility_off_24px,
        technicalValue = "accessible-for-visually-impaired"
    )
}