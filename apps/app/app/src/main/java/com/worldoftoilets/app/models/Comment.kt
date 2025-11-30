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
data class Comment(
    @SerialName("publicId") val publicId: String,
    @SerialName("text") val text: String? = null,
    @SerialName("score") val score: Double,
    @SerialName("rate") val rate: CommentRate,
    @SerialName("reactCounts") val reactCounts: ReactCounts,
    @SerialName("replyCount") val replyCount: Int,
    @SerialName("user") val user: UserCommentResponse,
    @SerialName("toilet") val toilet: Toilet? = null,
    @SerialName("createdAt") val createdAt: String,
    @SerialName("myReact") val myReact: String? = null
) : java.io.Serializable {
    fun average(): Float {
        var avgPaper = 0f
        if (rate.paper) {
            avgPaper = 2f
        }
        return ((rate.clean * 0.2f) + avgPaper + (rate.structure * 0.2f) + (rate.accessibility * 0.2f))
    }

    @Composable
    fun getDateTimeString(): String {
        val context = LocalContext.current
        val commentDate = java.time.Instant.parse(createdAt)
            .atZone(java.time.ZoneId.systemDefault())
            .toLocalDateTime()
        val year = ChronoUnit.YEARS.between(commentDate, LocalDateTime.now())
        val month = ChronoUnit.MONTHS.between(commentDate, LocalDateTime.now())
        val days = ChronoUnit.DAYS.between(commentDate, LocalDateTime.now())
        val hours = ChronoUnit.HOURS.between(commentDate, LocalDateTime.now())
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