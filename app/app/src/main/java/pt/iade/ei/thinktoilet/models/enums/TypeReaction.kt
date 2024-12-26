package pt.iade.ei.thinktoilet.models.enums

import pt.iade.ei.thinktoilet.R

enum class TypeReaction(
    val id: Int,
    val value: Int,
    val technicalValue: String
) {
    NONE(id = 0, value = R.string.reaction_none, technicalValue = "none"),
    LIKE(id = 1, value = R.string.reaction_like, technicalValue = "like"),
    DISLIKE(id = 2, value = R.string.reaction_dislike, technicalValue = "dislike"),
    NOT_USEFUL(id = 3, value = R.string.reaction_not_useful, technicalValue = "not-useful"),
    FAKE_INFORMATION(id = 4, value = R.string.reaction_fake_information, technicalValue = "fake-information"),
    INAPPROPRIATE_CONTENT(id = 5, value = R.string.reaction_inappropriate_content, technicalValue = "inappropriate-content"),
    OFFENSIVE_CONTENT(id = 6, value = R.string.reaction_offensive_content, technicalValue = "offensive-content"),
    SPAM(id = 7, value = R.string.reaction_spam, technicalValue = "spam"),
    OTHER(id = 8, value = R.string.reaction_others, technicalValue = "others")
}