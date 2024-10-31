package pt.iade.ei.thinktoilet.test

import pt.iade.ei.thinktoilet.models.Position
import pt.iade.ei.thinktoilet.models.RatingCategory
import pt.iade.ei.thinktoilet.models.Toilet

fun generateRatingCategory(clean: Float = 0.0f, paper: Float = 0.0f, structure: Float = 0.0f, accessibility: Float = 0.0f): RatingCategory {
    return RatingCategory(
        clean = clean,
        paper = paper,
        structure = structure,
        accessibility = accessibility,
    )
}

fun generateRandomRatingCategory(): RatingCategory {
    return RatingCategory(
        clean = (0..5).random().toFloat(),
        paper = (0..5).random().toFloat(),
        structure = (0..5).random().toFloat(),
        accessibility = (0..5).random().toFloat(),
    )
}

fun generatePosition(latitude: Double = 0.0, longitude: Double = 0.0): Position {
    return Position(
        latitude = latitude,
        longitude = longitude
    )
}

fun generateRandomPosition(): Position {
    return Position(
        latitude = (0..100).random().toDouble(),
        longitude = (0..100).random().toDouble()
    )
}

fun generateToilet(): Toilet {
    return Toilet(
        id = 1,
        name = "Toiletaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        address = "Addressaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        ratingCategory = generateRatingCategory(),
        accessibility = true,
        babyChangingStation = true,
        position = generatePosition(),
        numComments = 0,
        comments = emptyList(),
        googlePlaceId = "0"
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

fun generateToilets(numToilets: Int): List<Toilet> {
    val toilets = mutableListOf<Toilet>()
    for (i in 1..numToilets) {
        toilets.add(generateRandomToilet())
    }
    return toilets
}

fun generateDistance(): Double {
    return (0..5000).random().toDouble()
}