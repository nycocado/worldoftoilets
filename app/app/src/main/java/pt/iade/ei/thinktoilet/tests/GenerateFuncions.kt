package pt.iade.ei.thinktoilet.tests

import android.location.Location
import kotlinx.coroutines.flow.MutableStateFlow
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Rating
import pt.iade.ei.thinktoilet.models.Reaction
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.TypeReaction
import pt.iade.ei.thinktoilet.models.UiState
import pt.iade.ei.thinktoilet.models.User
import java.time.LocalDateTime

fun generateRandomRatingCategory(): Rating {
    return Rating(
        clean = (0..5).random().toFloat(),
        paper = (0..100).random().toFloat(),
        structure = (0..5).random().toFloat(),
        accessibility = (0..5).random().toFloat(),
    )
}

fun generateRandomToilet(id: Int = (1..100).random(), numComments: Int = (1..40).random()): Toilet {
    return Toilet(
        id = id,
        name = "Toilet $id",
        address = "Address ${(0..100).random()}",
        rating = generateRandomRatingCategory(),
        latitude = (0..100).random().toDouble(),
        longitude = (0..100).random().toDouble(),
        numComments = 0,
        placeId = "0"
    )
}
fun randomDateTime(): LocalDateTime {
    val randomYear = (2018..2024).random()
    val randomMonth = (1..12).random()
    val randomDay = (1..28).random()
    val randomHour = (0..23).random()
    val randomMinute = (0..59).random()
    val randomSecond = (0..59).random()
    val randomNano = (0..999999999).random()

    return LocalDateTime.of(randomYear, randomMonth, randomDay, randomHour, randomMinute, randomSecond, randomNano)

}


fun generateComment(): Comment {
    return Comment(
        id = (0..100).random(),
        toiletId = 1,
        userId = 1,
        text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ac varius ex. Morbi vitae fermentum dui. Sed in laoreet massa. Donec sed pretium ipsum. Phasellus diam nunc, hendrerit laoreet imperdiet sit amet, ornare ut diam. Sed augue nisl, sollicitudin id dui sit amet, auctor faucibus odio. Nulla hendrerit gravida lacus ut aliquet.",
        ratingClean = (0..5).random(),
        ratingPaper = true,
        ratingStructure = (0..5).random(),
        ratingAccessibility = (0..5).random(),
        dateTime = randomDateTime().toString(),
        like = (0..1000).random(),
        dislike = (0..1000).random(),
        score = (0..1000).random(),
    )
}

fun generateReactions(comments: List<Int>): Map<Int, Reaction> {
    val reactions = mutableMapOf<Int, Reaction>()
    for (commentId in comments) {
        reactions[commentId] = Reaction(
            commentId = commentId,
            typeReaction = TypeReaction.LIKE
        )
    }
    return reactions
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

fun generateUserMain(): User {
    val user = generateUser()
    user.email = "luan.ribeiro@gmail.com"
    return user
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

fun generateCarouselImage(): List<String> {
    return listOf(
        "https://media.themoviedb.org/t/p/w440_and_h660_face/bOVr292mwn3jxr1e0NmUPM1rcjo.jpg",
        "https://media.themoviedb.org/t/p/w440_and_h660_face/t5v2Zsb5sa6PSP9jMUWY4GdIb3c.jpg",
        "https://media.themoviedb.org/t/p/w440_and_h660_face/4BtyJ4KAyuptcjnFgoxJgEcPmrY.jpg",
        "https://media.themoviedb.org/t/p/w440_and_h660_face/hhhJN8aJdTlzGmARCbwWflHXhwI.jpg",
        "https://media.themoviedb.org/t/p/w440_and_h660_face/kOrGwksr5qlucIWtg4oRtyc5r1t.jpg",
        "https://media.themoviedb.org/t/p/w1066_and_h600_bestv2/qU4HDNKv7gjdlvMu74r70rISPwn.jpg"
    )
}

fun generateToiletsStateFlow(numToilets: Int = (10..20).random(), preferenceId: Int? = null): MutableStateFlow<Map<Int, Toilet>> {
    val toilets = generateRandomToilets(numToilets)
    if(preferenceId != null) {
        val toilet = generateRandomToilet(preferenceId)
        toilets.plus(toilet)
    }
    val toiletsMap = mutableMapOf<Int, Toilet>()
    for (toilet in toilets) {
        toiletsMap[toilet.id] = toilet
    }
    return MutableStateFlow(toiletsMap)
}

fun generateToiletsNearbyIdsStateFlow(toilets: Map<Int, Toilet>): MutableStateFlow<UiState<List<Int>>> {
    val toiletIds = toilets.keys.toList()
    return MutableStateFlow(UiState.Success(toiletIds))
}

fun generateLocationStateFlow(): MutableStateFlow<Location> {
    return MutableStateFlow(Location("mockprovider").apply {
        latitude = 0.0
        longitude = 0.0
    })
}
