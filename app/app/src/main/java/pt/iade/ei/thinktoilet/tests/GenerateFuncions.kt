package pt.iade.ei.thinktoilet.tests

import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Position
import pt.iade.ei.thinktoilet.models.RatingCategory
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.ToiletDetailed
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

fun generateRandomToilet(id: Int = (1..100).random()): Toilet {
    return Toilet(
        id = id,
        name = "Toilet ${(0..100).random()}",
        address = "Address ${(0..100).random()}",
        ratingCategory = generateRandomRatingCategory(),
        accessibility = (0..1).random() == 1,
        babyChangingStation = (0..1).random() == 1,
        position = generateRandomPosition(),
        numComments = 0,
        googlePlaceId = "0",
    )
}

fun generateRandomToiletDetailed(id: Int = (1..100).random(), numComments: Int): ToiletDetailed {
    return ToiletDetailed(
        toilet = generateRandomToilet(id),
        comments = generateCommentsList(numComments),
        distance = generateRandomDistance()
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

fun generateRandomToiletsDetailed(
    numToilets: Int = (10..20).random(),
    numComments: Int = (10..40).random()
): HashMap<Int, ToiletDetailed> {
    val toilets = hashMapOf<Int, ToiletDetailed>()
    toilets[1] = generateRandomToiletDetailed(1, numComments)
    for (i in 1..numToilets) {
        val toilet: ToiletDetailed = generateRandomToiletDetailed(numComments = numComments)
        if(toilets.keys.contains(toilet.toilet.id)) continue
        toilets[toilet.toilet.id!!] = toilet
    }
    return toilets
}

fun generateRandomToiletsDetailedToList(
    numToilets: Int = (10..20).random(),
    numComments: Int = (10..40).random()
): List<ToiletDetailed> {
    return generateRandomToiletsDetailed(numToilets, numComments).values.toList()
}

fun generateUsers(numUsers: Int): HashMap<Int, User> {
    val users = hashMapOf<Int, User>()
    for (i in 1..numUsers) {
        val user: User = generateUser()
        users[user.id!!] = user
    }
    return users
}