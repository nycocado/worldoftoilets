package pt.iade.ei.thinktoilet.tests

import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Position
import pt.iade.ei.thinktoilet.models.RatingCategory
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.UserForeigner
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.models.ToiletReviews
import java.time.LocalDateTime

fun generateRandomRatingCategory(): RatingCategory {
    return RatingCategory(
        clean = (0..5).random().toFloat(),
        paper = (0..5).random().toFloat(),
        structure = (0..5).random().toFloat(),
        accessibility = (0..5).random().toFloat(),
    )
}

fun generateRandomPosition(): Position {
    return Position(
        latitude = (0..100).random().toDouble(),
        longitude = (0..100).random().toDouble()
    )
}

fun generateRandomToilet(): Toilet{
    return Toilet(
        id = 1,
        name = "Toilet ${(0..100).random()}",
        address = "Address ${(0..100).random()}",
        ratingCategory = generateRandomRatingCategory(),
        accessibility = (0..1).random() == 1,
        babyChangingStation = (0..1).random() == 1,
        position = generateRandomPosition(),
        numComments = 0,
        comments = emptyList(),
        googlePlaceId = "0",
        distance = generateRandomDistance()
    )
}

fun generateRandomToiletWithComments(): Toilet {
    val toilet = generateRandomToilet()
    val comments = mutableListOf<Comment>()
    for (i in 1..(1..15).random()) {
        comments.add(generateComment())
    }
    toilet.comments = comments
    toilet.numComments = comments.size
    return toilet
}

fun generateRandomToilets(numToilets: Int): List<Toilet> {
    val toilets = mutableListOf<Toilet>()
    for (i in 1..numToilets) {
        toilets.add(generateRandomToilet())
    }
    return toilets
}

fun generateRandomToiletsWithComments(numToilets: Int): List<Toilet> {
    val toilets = mutableListOf<Toilet>()
    for (i in 1..numToilets) {
        toilets.add(generateRandomToiletWithComments())
    }
    return toilets
}

fun generateRandomDistance(): Double {
    return (0..5000).random().toDouble()
}

fun generateUser(): UserForeigner {
    return UserForeigner(
        id = (0..100).random(),
        name = "Luan Ribeiro",
        iconId = 1,
        numComments = (0..200).random(),
        points = (0..10000).random(),
    )
}

fun generateComment(): Comment {
    return Comment(
        id = (0..100).random(),
        userForeigner = generateUser(),
        rate = (0..5).random().toFloat(),
        text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ac varius ex. Morbi vitae fermentum dui. Sed in laoreet massa. Donec sed pretium ipsum. Phasellus diam nunc, hendrerit laoreet imperdiet sit amet, ornare ut diam. Sed augue nisl, sollicitudin id dui sit amet, auctor faucibus odio. Nulla hendrerit gravida lacus ut aliquet.",
        ratingCategory = generateRandomRatingCategory(),
        datetime = LocalDateTime.now(),
        like = (0..1000).random(),
        dislike = (0..1000).random(),
    )
}

fun generateUserMain(): UserMain {
    return UserMain(
        id = (0..100).random(),
        name = "Lohanne Guedes",
        iconId = (0..100).random(),
        numComments = (0..200).random(),
        points = (0..10000).random(),
        email = "Lohanneguedes@fake.com",
        password = "nothing_here",
        position = generateRandomPosition(),
        historyComment = generateCommentsList(),
    )
}

fun generateCommentsList(numComments: Int = (10..40).random()): List<Comment> {
    val commentsList = mutableListOf<Comment>()
    for (i in 1..numComments) {
        commentsList.add(generateComment())
    }
    return commentsList
}

fun generateToiletReviews(): ToiletReviews {
    return ToiletReviews(
        toilet = generateRandomToilet(),
        user = generateUser(),
        comments = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ac varius ex. Morbi vitae fermentum dui. Sed in laoreet massa.",
        ratingCategory = generateRandomRatingCategory(),
        datetime = LocalDateTime.now(),
    )
}

fun generateToiletReviewsList(numComments: Int = (10..40).random()): List<ToiletReviews> {
    val ToiletReviewsList = mutableListOf<ToiletReviews>()
    for (i in 1..numComments) {
        ToiletReviewsList.add(generateToiletReviews())
    }
    return ToiletReviewsList
}


