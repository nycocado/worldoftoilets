package pt.iade.ei.thinktoilet.test

import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Position
import pt.iade.ei.thinktoilet.models.RatingCategory
import pt.iade.ei.thinktoilet.models.Toilet

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
        id = (0..100).random(),
        name = "Toilet ${(0..100).random()}",
        address = "Address ${(0..100).random()}",
        ratingCategory = generateRandomRatingCategory(),
        accessibility = (0..1).random() == 1,
        babyChangingStation = (0..1).random() == 1,
        position = generateRandomPosition(),
        numComments = (0..100).random(),
        comments = emptyList(),
        googlePlaceId = "0"
    )
}

fun generateRandomToilets(numToilets: Int): List<Toilet> {
    val toilets = mutableListOf<Toilet>()
    for (i in 1..numToilets) {
        toilets.add(generateRandomToilet())
    }
    return toilets
}

fun generateRandomDistance(): Double {
    return (0..5000).random().toDouble()
}