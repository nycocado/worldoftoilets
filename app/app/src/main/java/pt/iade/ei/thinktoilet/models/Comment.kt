package pt.iade.ei.thinktoilet.models

import com.google.gson.annotations.SerializedName
import java.io.Serializable
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import kotlin.math.floor

data class Comment(
    @SerializedName("id") var id: Int?,
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

    fun getDateTimeString(): String {
        val formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME
        val commentDate = LocalDateTime.parse(dateTime, formatter)
        val year = ChronoUnit.YEARS.between(commentDate, LocalDateTime.now())
        val month = ChronoUnit.MONTHS.between(commentDate, LocalDateTime.now())
        val days = ChronoUnit.DAYS.between(commentDate, LocalDateTime.now())
        val hours = ChronoUnit.HOURS.between(commentDate, LocalDateTime.now())
        val weeks = floor(days / 7.0).toInt()

        return if (year >= 1) {
            if (year.toInt() == 1) "Há um ano." else "Há mais de um ano."
        } else if (month >= 1) {
            if (month.toInt() == 1) "Há um mês." else "Há $month de um mês."
        } else if (weeks >= 1) {
            if (weeks == 1) "Há uma semana." else "Há $weeks semanas."
        } else if (days.toInt() >= 1) {
            if (days.toInt() == 1) "Há um dia." else "Há $days dias."
        } else if (hours > 1) {
            "Há $hours horas."
        } else {
            "Há uma hora."
        }
    }
}