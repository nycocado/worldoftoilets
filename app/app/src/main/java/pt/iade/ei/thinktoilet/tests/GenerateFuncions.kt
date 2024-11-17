package pt.iade.ei.thinktoilet.tests

import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Extra
import pt.iade.ei.thinktoilet.models.Position
import pt.iade.ei.thinktoilet.models.RatingCategory
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.models.UserMain
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

fun generateRandomDistance(): Double {
    return (0..5000).random().toDouble()
}

fun generateExtra(): List<Extra> {
    val extras = mutableListOf<Extra>()
    extras.add(Extra(1, true))
    extras.add(Extra(2, false))
    return extras
}

fun generateRandomToilet(id: Int = (1..100).random(), numComments: Int = (1..40).random()): Toilet {
    return Toilet(
        id = id,
        name = "Toilet $id",
        address = "Address ${(0..100).random()}",
        ratingCategory = generateRandomRatingCategory(),
        extras = generateExtra(),
        position = generateRandomPosition(),
        numComments = 0,
        googlePlaceId = "0",
        comments = generateCommentsList(numComments),
        distance = generateRandomDistance(),
        image = ""
    )
}

fun generateComment(): Comment {
    return Comment(
        id = (0..100).random(),
        toiletId = 1,
        userId = 1,
        rate = (0..5).random().toFloat(),
        text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ac varius ex. Morbi vitae fermentum dui. Sed in laoreet massa. Donec sed pretium ipsum. Phasellus diam nunc, hendrerit laoreet imperdiet sit amet, ornare ut diam. Sed augue nisl, sollicitudin id dui sit amet, auctor faucibus odio. Nulla hendrerit gravida lacus ut aliquet.",
        ratingCategory = generateRandomRatingCategory(),
        datetime = LocalDateTime.now(),
        like = (0..1000).random(),
        dislike = (0..1000).random(),
    )
}

fun generateUser(): User {
    return User(
        id = 1,
        name = "Luan Ribeiro",
        iconId = 1,
        numComments = (0..200).random(),
        points = (0..10000).random(),
    )
}

fun generateUserMain(): UserMain {
    return UserMain(
        user = generateUser(),
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

fun generateRandomToilets(
    numToilets: Int = (10..20).random(),
    numComments: Int = (10..40).random()
): List<Toilet> {
    val toilets = mutableListOf<Toilet>()
    toilets.add(generateRandomToilet(0))
    for (i in 1..numToilets) {
        toilets.add(generateRandomToilet(numComments = numComments))
    }
    return toilets
}

fun generateUsers(numUsers: Int): List<User> {
    val users = mutableListOf<User>()
    for (i in 1..numUsers) {
        users.add(generateUser())
    }
    return users
}