package pt.iade.ei.thinktoilet.ui.screens

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonColors
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import coil3.compose.LocalPlatformContext
import coil3.compose.SubcomposeAsyncImage
import coil3.request.ImageRequest
import coil3.request.crossfade
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Reaction
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.models.enums.TypeReaction
import pt.iade.ei.thinktoilet.tests.generateCommentsList
import pt.iade.ei.thinktoilet.tests.generateRandomToilet
import pt.iade.ei.thinktoilet.tests.generateReactions
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.ui.components.ChipsToilet
import pt.iade.ei.thinktoilet.ui.components.CommentToilet
import pt.iade.ei.thinktoilet.ui.components.ProgressBar
import pt.iade.ei.thinktoilet.ui.components.Stars
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@SuppressLint("DefaultLocale")
@Composable
fun ToiletDetailScreen(
    toiletId: Int,
    toiletsStateFlow: StateFlow<Map<Int, Toilet>>,
    commentsStateFlow: StateFlow<List<Comment>>,
    isLoadingCommentsToiletStateFlow: StateFlow<Boolean>,
    reactionsStateFlow: StateFlow<Map<Int, Reaction>>,
    usersStateFlow: StateFlow<Map<Int, User>>,
    userMainStateFlow: StateFlow<User?>,
    navigateToRating: (toiletId: Int) -> Unit = {},
    navigateToToiletReport: (toiletId: Int) -> Unit = {},
    navigateToCommentReport: (commentId: Int) -> Unit = {},
    navigateToBack: () -> Unit = {},
    onReaction: (comment: Int, typeReaction: TypeReaction) -> Unit = { _, _ -> }
) {
    val toilet = toiletsStateFlow.collectAsState().value[toiletId]!!
    val comments = commentsStateFlow.collectAsState().value.filter { it.toiletId == toiletId }
    val isLoadingCommentsToilet = isLoadingCommentsToiletStateFlow.collectAsState().value
    val reactions = reactionsStateFlow.collectAsState().value
    val users = usersStateFlow.collectAsState().value
    val userMain = userMainStateFlow.collectAsState().value

    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val platformContext = LocalPlatformContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row {
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = toilet.name,
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold
                )
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Stars(
                        rating = toilet.getAverageRating(), size = 22.dp
                    )
                    Text(
                        text = "%.1f".format(toilet.getAverageRating()) + " - " + context.getString(toilet.access.value),
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold,
                        overflow = TextOverflow.Ellipsis,
                        maxLines = 1,
                        minLines = 1
                    )
                }
            }
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilledIconButton(
                    onClick = { navigateToToiletReport(toilet.id) },
                    modifier = Modifier
                        .size(38.dp),
                    colors = IconButtonColors(
                        containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                        contentColor = MaterialTheme.colorScheme.onTertiaryContainer,
                        disabledContainerColor = MaterialTheme.colorScheme.tertiaryContainer.copy(
                            alpha = 0.5f
                        ),
                        disabledContentColor = MaterialTheme.colorScheme.onTertiaryContainer.copy(
                            alpha = 0.5f
                        )
                    )
                ) {
                    Icon(
                        painter = painterResource(R.drawable.flag_filled_24px),
                        contentDescription = context.getString(R.string.report)
                    )
                }
                FilledIconButton(
                    onClick = { navigateToBack() },
                    modifier = Modifier.size(38.dp),
                    colors = IconButtonColors(
                        containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                        contentColor = MaterialTheme.colorScheme.onTertiaryContainer,
                        disabledContainerColor = MaterialTheme.colorScheme.tertiaryContainer.copy(
                            alpha = 0.5f
                        ),
                        disabledContentColor = MaterialTheme.colorScheme.onTertiaryContainer.copy(
                            alpha = 0.5f
                        )
                    )
                ) {
                    Icon(
                        painter = painterResource(R.drawable.close_24px),
                        contentDescription = context.getString(R.string.back)
                    )
                }
            }
        }
        LazyColumn(
            modifier = Modifier
                .fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            item {
                SubcomposeAsyncImage(
                    model = ImageRequest.Builder(platformContext)
                        .data(toilet.getImageUrl())
                        .crossfade(true)
                        .build(),
                    contentDescription = context.getString(R.string.content_description_toilet_image) + ": " + toilet.name,
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(MaterialTheme.shapes.medium)
                        .aspectRatio(1f),
                    contentScale = ContentScale.Crop,
                    loading = {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color.LightGray),
                            contentAlignment = Alignment.Center,
                        ) {
                            CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                        }
                    },
                    error = {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color.LightGray),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = context.getString(R.string.error_image),
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                )
            }

            item {
                Row(
                    modifier = Modifier.padding(vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Row(
                        modifier = Modifier.weight(1f),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            painter = painterResource(R.drawable.location_on_filled_24px),
                            contentDescription = null,
                            modifier = Modifier.size(30.dp),
                            tint = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = toilet.address,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                    }
                    Button(
                        onClick = {
                            val intent = Intent(
                                Intent.ACTION_VIEW,
                                Uri.parse(toilet.getMapsUrl())
                            ).apply {
                                putExtra(
                                    Intent.EXTRA_REFERRER,
                                    Uri.parse(context.getString(R.string.maps_uri))
                                )
                            }
                            context.startActivity(intent)
                        },
                        colors = ButtonColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer,
                            contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
                            disabledContainerColor = MaterialTheme.colorScheme.primaryContainer.copy(
                                alpha = 0.5f
                            ),
                            disabledContentColor = MaterialTheme.colorScheme.onPrimaryContainer.copy(
                                alpha = 0.5f
                            )
                        )
                    ) {
                        Text(
                            text = context.getString(R.string.go_to_maps),
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }

            if (toilet.extras.isNotEmpty()) {
                item {
                    ChipsToilet(toilet.extras)
                }
            }

            item {
                Row(
                    modifier = Modifier.padding(horizontal = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "%.1f".format(toilet.getAverageRating()),
                            style = MaterialTheme.typography.displayLarge,
                            fontWeight = FontWeight.Bold
                        )
                        Stars(
                            rating = toilet.getAverageRating(), size = 20.dp
                        )
                    }
                    Column(
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        ProgressBar(
                            progress = toilet.rating.clean,
                            text = String.format(
                                "%.1f",
                                toilet.rating.clean
                            ) + " " + context.getString(R.string.clean)
                        )
                        ProgressBar(
                            progress = toilet.rating.structure,
                            text = String.format(
                                "%.1f",
                                toilet.rating.structure
                            ) + " " + context.getString(R.string.structure)
                        )
                        ProgressBar(
                            progress = toilet.rating.accessibility,
                            text = String.format(
                                "%.1f",
                                toilet.rating.accessibility
                            ) + " " + context.getString(R.string.accessibility)
                        )
                        ProgressBar(
                            progress = toilet.rating.paper,
                            text = String.format(
                                "%.0f",
                                toilet.rating.paper
                            ) + "% " + context.getString(R.string.paper),
                            maxValue = 100f
                        )
                    }
                }
            }

            item {
                Button(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    onClick = { scope.launch { navigateToRating(toilet.id) } },
                    colors = ButtonColors(
                        containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                        contentColor = MaterialTheme.colorScheme.onTertiaryContainer,
                        disabledContainerColor = MaterialTheme.colorScheme.tertiaryContainer.copy(
                            alpha = 0.5f
                        ),
                        disabledContentColor = MaterialTheme.colorScheme.onTertiaryContainer.copy(
                            alpha = 0.5f
                        )
                    )
                ) {
                    Text(
                        text = context.getString(R.string.rate),
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.Bold,
                    )
                }
            }

            item {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = context.getString(R.string.comments),
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                    )
                    Text(
                        text = toilet.numComments.toString(),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Medium,
                        color = Color.Gray
                    )
                }
            }

            when (isLoadingCommentsToilet) {
                true -> {
                    item {
                        CircularProgressIndicator(modifier = Modifier.padding(16.dp))
                    }
                }

                false -> {
                    items(comments) { comment ->
                        val user = users[comment.userId]
                        if (user != null) {
                            reactions[comment.id]?.let {
                                CommentToilet(
                                    comment = comment,
                                    reaction = it,
                                    user = user,
                                    userMain = userMain!!,
                                    navigateToReport = { commentId ->
                                        navigateToCommentReport(commentId)
                                    },
                                    onReaction = { commentId, typeReaction ->
                                        onReaction(commentId, typeReaction)
                                    },
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ToiletDetailScreenPreview() {
    val toiletsStateFlow = MutableStateFlow(
        mapOf(
            1 to generateRandomToilet(1)
        )
    )
    val commentsStateFlow = MutableStateFlow(generateCommentsList())
    val comments = commentsStateFlow.collectAsState().value
    val isLoadingCommentsToiletStateFlow = MutableStateFlow(false)
    val reactionsStateFlow = MutableStateFlow(
        generateReactions(comments.map { it.id })
    )
    val usersStateFlow = MutableStateFlow(
        mapOf(
            1 to generateUserMain()
        )
    )
    val userMainStateFlow = MutableStateFlow(generateUserMain())

    AppTheme {
        ToiletDetailScreen(
            toiletId = 1,
            toiletsStateFlow = toiletsStateFlow,
            commentsStateFlow = commentsStateFlow,
            isLoadingCommentsToiletStateFlow = isLoadingCommentsToiletStateFlow,
            reactionsStateFlow = reactionsStateFlow,
            usersStateFlow = usersStateFlow,
            userMainStateFlow = userMainStateFlow,
            navigateToRating = {}
        )
    }
}