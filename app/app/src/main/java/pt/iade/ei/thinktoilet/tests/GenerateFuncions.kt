package pt.iade.ei.thinktoilet.tests

import androidx.compose.foundation.pager.PagerState
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.runtime.Composable
import pt.iade.ei.thinktoilet.models.CommentItem
import pt.iade.ei.thinktoilet.models.Extra
import pt.iade.ei.thinktoilet.models.Rating
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.models.UserMain
import java.time.LocalDateTime

fun generateRandomRatingCategory(): Rating {
    return Rating(
        clean = (0..5).random().toFloat(),
        paper = (0..100).random().toFloat(),
        structure = (0..5).random().toFloat(),
        accessibility = (0..5).random().toFloat(),
    )
}

fun generateRandomDistance(): Double {
    return (0..5000).random().toDouble()
}

fun generateExtra(): List<Extra> {
    val extras = mutableListOf<Extra>()
    extras.add(Extra(1))
    extras.add(Extra(2))
    return extras
}

fun generateRandomToilet(id: Int = (1..100).random(), numComments: Int = (1..40).random()): Toilet {
    return Toilet(
        id = id,
        name = "Toilet $id",
        address = "Address ${(0..100).random()}",
        rating = generateRandomRatingCategory(),
        extras = generateExtra(),
        latitude = (0..100).random().toDouble(),
        longitude = (0..100).random().toDouble(),
        numComments = 0,
        placeId = "0"
    )
}

fun generateComment(): CommentItem {
    return CommentItem(
        id = (0..100).random(),
        toiletId = 1,
        userId = 1,
        text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ac varius ex. Morbi vitae fermentum dui. Sed in laoreet massa. Donec sed pretium ipsum. Phasellus diam nunc, hendrerit laoreet imperdiet sit amet, ornare ut diam. Sed augue nisl, sollicitudin id dui sit amet, auctor faucibus odio. Nulla hendrerit gravida lacus ut aliquet.",
        ratingClean = (0..5).random(),
        ratingPaper = true,
        ratingStructure = (0..5).random(),
        ratingAccessibility = (0..5).random(),
        datetime = LocalDateTime.now().toString(),
        like = (0..1000).random(),
        dislike = (0..1000).random(),
        score = (0..1000).random(),
    )
}

fun generateUser(): User {
    return User(
        id = 1,
        name = "Luan Ribeiro",
        iconId = "",
        numComments = (0..200).random(),
        points = (0..10000).random(),
    )
}

fun generateUserMain(): UserMain {
    return UserMain(
        user = generateUser(),
        email = "Lohanneguedes@fake.com",
        password = "nothing_here"
    )
}

fun generateCommentsList(numComments: Int = (10..40).random()): List<CommentItem> {
    val commentsList = mutableListOf<CommentItem>()
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


fun generateCarouselImage(): List<String> {
    return listOf(
        //filme muito bom
        "https://media.themoviedb.org/t/p/w440_and_h660_face/bOVr292mwn3jxr1e0NmUPM1rcjo.jpg",
        "https://media.themoviedb.org/t/p/w440_and_h660_face/t5v2Zsb5sa6PSP9jMUWY4GdIb3c.jpg",
        "https://media.themoviedb.org/t/p/w440_and_h660_face/4BtyJ4KAyuptcjnFgoxJgEcPmrY.jpg",
        "https://media.themoviedb.org/t/p/w440_and_h660_face/hhhJN8aJdTlzGmARCbwWflHXhwI.jpg",
        "https://media.themoviedb.org/t/p/w440_and_h660_face/kOrGwksr5qlucIWtg4oRtyc5r1t.jpg",
        "https://media.themoviedb.org/t/p/w1066_and_h600_bestv2/qU4HDNKv7gjdlvMu74r70rISPwn.jpg"
    )
}

