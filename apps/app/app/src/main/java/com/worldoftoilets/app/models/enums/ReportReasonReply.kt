package com.worldoftoilets.app.models.enums

import com.worldoftoilets.app.R

enum class ReportReasonReply(val apiValue: String, val labelRes: Int) {
    NOT_USEFUL("not-useful", R.string.reaction_not_useful),
    FAKE_INFORMATION("fake-information", R.string.reaction_fake_information),
    INAPPROPRIATE_CONTENT("inappropriate-content", R.string.reaction_inappropriate_content),
    OFFENSIVE_CONTENT("offensive-content", R.string.reaction_offensive_content),
    SPAM("spam", R.string.reaction_spam),
    OTHERS("others", R.string.reaction_others)
}
