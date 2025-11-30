package com.worldoftoilets.app.models

import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import com.worldoftoilets.app.R
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import kotlin.math.floor

@Serializable
data class Reply(
    @SerialName("publicId") val publicId: String,
    @SerialName("text") val text: String,
    @SerialName("user") val user: UserCommentResponse,
    @SerialName("createdAt") val createdAt: String
) : java.io.Serializable {
    @Composable
    fun getDateTimeString(): String {
        val context = LocalContext.current
        val replyDate = java.time.Instant.parse(createdAt)
            .atZone(java.time.ZoneId.systemDefault())
            .toLocalDateTime()
        val year = ChronoUnit.YEARS.between(replyDate, LocalDateTime.now())
        val month = ChronoUnit.MONTHS.between(replyDate, LocalDateTime.now())
        val days = ChronoUnit.DAYS.between(replyDate, LocalDateTime.now())
        val hours = ChronoUnit.HOURS.between(replyDate, LocalDateTime.now())
        val weeks = floor(days / 7.0).toInt()

        return when {
            year >= 1 -> {
                if (year.toInt() == 1)
                    context.getString(R.string.time_year_single)
                else
                    context.getString(R.string.time_year_plural, year.toInt())
            }

            month >= 1 -> {
                if (month.toInt() == 1)
                    context.getString(R.string.time_month_single)
                else
                    context.getString(R.string.time_month_plural, month.toInt())
            }

            weeks >= 1 -> {
                if (weeks == 1)
                    context.getString(R.string.time_week_single)
                else
                    context.getString(R.string.time_week_plural, weeks)
            }

            days.toInt() >= 1 -> {
                if (days.toInt() == 1)
                    context.getString(R.string.time_day_single)
                else
                    context.getString(R.string.time_day_plural, days.toInt())
            }

            hours >= 1 -> {
                if (hours.toInt() == 1)
                    context.getString(R.string.time_hour_single)
                else
                    context.getString(R.string.time_hour_plural, hours.toInt())
            }

            else -> {
                context.getString(R.string.time_hour_less)
            }
        }
    }
}