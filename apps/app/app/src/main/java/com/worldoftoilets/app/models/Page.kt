package com.worldoftoilets.app.models

import kotlinx.serialization.Serializable

@Serializable
data class Page(
    val number: Int,
    val size: Int = 20,
    val isLast: Boolean
)
