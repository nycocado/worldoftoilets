package com.worldoftoilets.app.ui.navegation

import kotlinx.serialization.Serializable

object AppDestinations {
    // Graphs
    @Serializable
    object RootGraph
    @Serializable
    object MainGraph
    @Serializable
    object BottomSheetGraph
    @Serializable
    object AuthGraph
    @Serializable
    object RatingGraph
    @Serializable
    object SettingsGraph
    @Serializable
    object ReportGraph

    // Main Screens
    @Serializable
    data class Home(val toiletId: String? = null)
    @Serializable
    object Profile

    // BottomSheet Screens
    @Serializable
    object ToiletList
    @Serializable
    data class ToiletDetails(val toiletId: String)

    // Auth Screens
    @Serializable
    object Login
    @Serializable
    object Register
    @Serializable
    object ForgotPassword

    // Rating Screens
    @Serializable
    data class Rating(val toiletId: String, val commentId: String? = null)

    // Settings Screens
    @Serializable
    object SettingsStart
    @Serializable
    data class SettingsChange(val type: String)

    // Report Screens
    @Serializable
    data class Report(val typeId: String, val id: String)
    @Serializable
    data class Confirmation(val type: String, val confirmation: Boolean, val email: String? = null)
}
