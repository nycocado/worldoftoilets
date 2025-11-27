package com.worldoftoilets.app.models

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import com.google.gson.annotations.SerializedName
import com.worldoftoilets.app.R
import java.io.Serializable
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import kotlin.math.floor

data class Comment(
    @SerializedName("publicId") val publicId: String,
    @SerializedName("text") val text: String?,
    @SerializedName("score") val score: Double,
    @SerializedName("rate") val rate: CommentRate,
    @SerializedName("reactCounts") val reactCounts: ReactCounts,
    @SerializedName("replyCount") val replyCount: Int,
    @SerializedName("user") val user: UserCommentResponse,
    @SerializedName("createdAt") val createdAt: String,
    @SerializedName("myReact") val myReact: String?
) : Serializable {
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

data class CommentRate(
    @SerializedName("clean") val clean: Int,
    @SerializedName("paper") val paper: Boolean,
    @SerializedName("structure") val structure: Int,
    @SerializedName("accessibility") val accessibility: Int
) : Serializable

data class ReactCounts(
    @SerializedName("likes") val likes: Int,
    @SerializedName("dislikes") val dislikes: Int
) : Serializable {
    val likeCount: Int
        get() = likes
    val dislikeCount: Int
        get() = dislikes
}

data class UserCommentResponse(
    @SerializedName("publicId") val publicId: String,
    @SerializedName("name") val name: String,
    @SerializedName("icon") val icon: String,
    @SerializedName("commentsCount") val commentsCount: Int,
    @SerializedName("points") val points: Int,
    @SerializedName("isPartner") val isPartner: Boolean
) : Serializable {
    @Composable
    fun getIcon(): Painter {
        return when (icon) {
            "icon-1" -> painterResource(R.drawable.icon1)
            "icon-2" -> painterResource(R.drawable.icon2)
            "icon-3" -> painterResource(R.drawable.icon3)
            "icon-4" -> painterResource(R.drawable.icon4)
            "icon-5" -> painterResource(R.drawable.icon5)
            "icon-6" -> painterResource(R.drawable.icon6)
            "icon-default" -> painterResource(R.drawable.icon_default)
            else -> painterResource(R.drawable.icon_default)
        }
    }
}