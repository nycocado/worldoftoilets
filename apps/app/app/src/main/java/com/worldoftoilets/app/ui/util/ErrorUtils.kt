package com.worldoftoilets.app.ui.util

import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonPrimitive

fun parseApiError(errorBody: String?): String {
    if (errorBody.isNullOrBlank()) return "Unknown error"
    return try {
        val jsonElement = Json { ignoreUnknownKeys = true }.parseToJsonElement(errorBody)
        if (jsonElement is JsonObject) {
            // Check 'message' field
            val message = jsonElement["message"]?.jsonPrimitive?.contentOrNull
            // Check 'error' field (sometimes used for short codes)
            val error = jsonElement["error"]?.jsonPrimitive?.contentOrNull

            // Return message or error, or fallback to raw body if neither found
            message ?: error ?: errorBody
        } else {
            errorBody
        }
    } catch (e: Exception) {
        // If parsing fails, return raw body
        errorBody
    }
}