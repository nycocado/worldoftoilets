package pt.iade.ei.thinktoilet.models

import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import com.google.gson.annotations.SerializedName
import pt.iade.ei.thinktoilet.R
import java.io.Serializable
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import kotlin.math.floor

data class Comment(
    @SerializedName("id") var id: Int,
    @SerializedName("toiletId") var toiletId: Int,
    @SerializedName("userId") val userId: Int,
    @SerializedName("text") val text: String,
    @SerializedName("ratingClean") val ratingClean: Int,
    @SerializedName("ratingPaper") val ratingPaper: Boolean,
    @SerializedName("ratingStructure") val ratingStructure: Int,
    @SerializedName("ratingAccessibility") val ratingAccessibility: Int,
    @SerializedName("datetime") val dateTime: String,
    @SerializedName("numLikes") var like: Int,
    @SerializedName("numDislikes") var dislike: Int,
    @SerializedName("score") var score: Int,
) : Serializable {
    fun average(): Float {
        var avgPaper = 0f
        if (ratingPaper) {
            avgPaper = 2f // 40%
        }
        return ((ratingClean * 0.2f) + avgPaper + (ratingStructure * 0.2f) + (ratingAccessibility * 0.2f))
    }

    @Composable
    fun getDateTimeString(): String {
        val context = LocalContext.current
        val formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME
        val commentDate = LocalDateTime.parse(dateTime, formatter)
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