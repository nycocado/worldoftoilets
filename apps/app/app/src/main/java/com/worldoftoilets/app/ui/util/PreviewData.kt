package com.worldoftoilets.app.ui.util

import android.location.Location
import com.worldoftoilets.app.models.Access
import com.worldoftoilets.app.models.Comment
import com.worldoftoilets.app.models.CommentRate
import com.worldoftoilets.app.models.Page
import com.worldoftoilets.app.models.ReactCounts
import com.worldoftoilets.app.models.Role
import com.worldoftoilets.app.models.Toilet
import com.worldoftoilets.app.models.ToiletRating
import com.worldoftoilets.app.models.UiState
import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.models.UserCommentResponse
import com.worldoftoilets.app.models.enums.UserIcon
import com.worldoftoilets.app.models.responses.LoginResponse
import com.worldoftoilets.app.models.responses.PageResponse
import kotlinx.coroutines.flow.MutableStateFlow
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.UUID
import kotlin.random.Random

fun generateUserMain(
    publicId: String = UUID.randomUUID().toString(),
    name: String = "John Doe",
    icon: String = UserIcon.ICON_DEFAULT.id!!,
    commentsCount: Int = 10,
    email: String = "john.doe@example.com",
    points: Int = 150,
    birthDate: String = "1990-01-01T00:00:00.000Z",
    isPartner: Boolean = false,
    roles: List<Role> = emptyList(),
    createdAt: String = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
): User {
    return User(
        publicId,
        name,
        icon,
        email,
        commentsCount,
        points,
        birthDate,
        isPartner,
        roles,
        createdAt
    )
}

fun generateUserCommentResponse(
    publicId: String = UUID.randomUUID().toString(),
    name: String = "Commenter Name",
    icon: String = UserIcon.ICON_1.id!!,
    commentsCount: Int = 5,
    points: Int = 50,
    isPartner: Boolean = false
): UserCommentResponse {
    return UserCommentResponse(publicId, name, icon, commentsCount, points, isPartner)
}

fun generateToiletRating(
    totalRatings: Int = Random.nextInt(1, 100),
    avgClean: Double = Random.nextDouble(1.0, 5.0),
    avgStructure: Double = Random.nextDouble(1.0, 5.0),
    avgAccessibility: Double = Random.nextDouble(1.0, 5.0),
    paperAvailability: Double = Random.nextDouble(0.0, 1.0)
): ToiletRating {
    return ToiletRating(totalRatings, avgClean, avgStructure, avgAccessibility, paperAvailability)
}

fun generateAccess(
    name: String = "Public",
    apiName: String = "public"
): Access {
    return Access(name, apiName)
}

fun generateRandomToilet(
    publicId: String = UUID.randomUUID().toString(),
    name: String = "Toilet " + Random.nextInt(1, 100),
    address: String = "123 Main St",
    city: String = "Lisbon",
    state: String = "Lisbon",
    country: String = "Portugal",
    countryCode: String = "PT",
    latitude: Double = Random.nextDouble(38.6, 38.8),
    longitude: Double = Random.nextDouble(-9.2, -9.0),
    access: Access = generateAccess(),
    extras: List<com.worldoftoilets.app.models.TypeExtra> = emptyList(),
    photoUrl: String? = null,
    placeId: String? = null,
    rating: ToiletRating = generateToiletRating()
): Toilet {
    return Toilet(
        publicId, name, address, city, state, country, countryCode, latitude, longitude,
        access, extras, photoUrl, placeId, rating
    )
}

fun generateComment(
    publicId: String = UUID.randomUUID().toString(),
    text: String = "This is a sample comment about a toilet.",
    score: Double = Random.nextDouble(1.0, 5.0),
    rate: CommentRate = CommentRate(
        Random.nextInt(1, 5),
        Random.nextBoolean(),
        Random.nextInt(1, 5),
        Random.nextInt(1, 5)
    ),
    reactCounts: ReactCounts = ReactCounts(Random.nextInt(0, 20), Random.nextInt(0, 5)),
    replyCount: Int = Random.nextInt(0, 5),
    user: UserCommentResponse = generateUserCommentResponse(),
    toilet: Toilet? = generateRandomToilet(),
    createdAt: String = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
    myReact: String? = null
): Comment {
    return Comment(
        publicId,
        text,
        score,
        rate,
        reactCounts,
        replyCount,
        user,
        toilet,
        createdAt,
        myReact
    )
}

fun generateCommentsList(): List<Comment> {
    return List(5) { generateComment(text = "Comment ${it + 1}") }
}

fun generateLocation(
    latitude: Double = 38.7223,
    longitude: Double = -9.1393,
    provider: String = "mock"
): Location {
    return Location(provider).apply {
        this.latitude = latitude
        this.longitude = longitude
        this.time = System.currentTimeMillis()
    }
}

fun generateLoginResponse(): LoginResponse {
    return LoginResponse("mockAccessToken", "mockRefreshToken", generateUserLoginResponse())
}

fun generateUserLoginResponse() = User(
    publicId = UUID.randomUUID().toString(),
    name = "Preview User",
    icon = UserIcon.ICON_DEFAULT.id!!,
    commentsCount = 0,
    email = "preview@example.com",
    points = 0,
    birthDate = "1990-01-01T00:00:00.000Z",
    isPartner = false,
    roles = emptyList(),
    createdAt = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
)

fun generateToiletsStateFlow(): MutableStateFlow<Map<String, Toilet>> {
    val toilets = List(5) { generateRandomToilet() }
    return MutableStateFlow(toilets.associateBy { it.publicId })
}

fun generateToiletsNearbyIdsStateFlow(toiletsMap: Map<String, Toilet>): MutableStateFlow<UiState<PageResponse<String>>> {
    return MutableStateFlow(
        UiState.Success(
            PageResponse(
                content = toiletsMap.keys.toList(),
                page = Page(number = 0, size = 5, isLast = false)
            )
        )
    )
}

fun generateLocationStateFlow(): MutableStateFlow<Location?> {
    return MutableStateFlow(generateLocation())
}

fun generateReportResultFlow(): MutableStateFlow<Result<Unit>?> {
    return MutableStateFlow(null)
}