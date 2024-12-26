package pt.iade.ei.thinktoilet.models.enums

enum class TypeExtra(
    val id: Int,
    val value: String,
    val technicalValue: String
) {
    NONE(id = 0, value = "None", technicalValue = "none"),
    WHEELCHAIR_ACCESSIBLE(id = 1, value = "Acessível para Cadeiras de Rodas", technicalValue = "wheelchair_accessible"),
    BABY_CHANGING_STATION(id = 2, value = "Estação de Troca de Fraldas", technicalValue = "baby_changing_station"),
    DISABLED_PARKING(id = 3, value = "Estacionamento para Deficientes", technicalValue = "disabled_parking"),
    ACCESSIBLE_FOR_VISUAL_IMPAIRMENT(id = 4, value = "Acessível para Deficientes Visuais", technicalValue = "accessible-for-visually-impaired"),
}