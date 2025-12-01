package com.worldoftoilets.app.ui.screens

import android.annotation.SuppressLint
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
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.LocationOn
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil3.compose.LocalPlatformContext
import coil3.compose.SubcomposeAsyncImage
import coil3.request.ImageRequest
import coil3.request.crossfade
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.Comment
import com.worldoftoilets.app.models.Reply
import com.worldoftoilets.app.models.Toilet
import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.ui.components.ChipsToilet
import com.worldoftoilets.app.ui.components.CommentDetailDialog
import com.worldoftoilets.app.ui.components.CommentToilet
import com.worldoftoilets.app.ui.components.ToiletActions
import com.worldoftoilets.app.ui.components.ToiletHeader
import com.worldoftoilets.app.ui.components.ToiletRatingSummary
import com.worldoftoilets.app.ui.theme.AppTheme
import com.worldoftoilets.app.ui.util.generateCommentsList
import com.worldoftoilets.app.ui.util.generateToiletsStateFlow
import com.worldoftoilets.app.ui.util.generateUserMain
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

@SuppressLint("DefaultLocale")
@Composable
fun ToiletDetailScreen(
    toiletId: String,
    toiletsStateFlow: StateFlow<Map<String, Toilet>>,
    commentsCacheStateFlow: StateFlow<Map<String, List<Comment>>>,
    isLoadingCommentsToiletStateFlow: StateFlow<Boolean>,
    userMainStateFlow: StateFlow<User?>,
    errorStateFlow: StateFlow<String> = MutableStateFlow(""),
    repliesCacheStateFlow: StateFlow<Map<String, List<Reply>>> = MutableStateFlow(emptyMap()),
    loadingRepliesStateFlow: StateFlow<Set<String>> = MutableStateFlow(emptySet()),
    lazyListState: LazyListState,
    navigateToRating: (toiletId: String) -> Unit = {},
    navigateToToiletReport: (toiletId: String) -> Unit = {},
    navigateToCommentReport: (commentId: String) -> Unit = {},
    navigateToReplyReport: (replyId: String) -> Unit = {},
    navigateToBack: () -> Unit = {},
    onReaction: (toiletId: String, commentPublicId: String, react: String) -> Unit = { _, _, _ -> },
    onLoadMoreComments: () -> Unit = {},
    onLoadReplies: (String) -> Unit = {},
    onReply: (String, String) -> Unit = { _, _ -> },
    onEditComment: (String) -> Unit = { _ -> },
    onDeleteComment: (String) -> Unit = {},
    onEditReply: (String, String, String) -> Unit = { _, _, _ -> },
    onDeleteReply: (String, String) -> Unit = { _, _ -> }
) {
    val toilets by toiletsStateFlow.collectAsStateWithLifecycle()
    val commentsCache by commentsCacheStateFlow.collectAsStateWithLifecycle()
    val isLoadingCommentsToilet by isLoadingCommentsToiletStateFlow.collectAsStateWithLifecycle()
    val userMain by userMainStateFlow.collectAsStateWithLifecycle()
    val repliesCache by repliesCacheStateFlow.collectAsStateWithLifecycle()
    val loadingReplies by loadingRepliesStateFlow.collectAsStateWithLifecycle()
    val error by errorStateFlow.collectAsStateWithLifecycle()

    val toilet = toilets[toiletId]!!
    val comments = commentsCache[toiletId] ?: emptyList()

    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val platformContext = LocalPlatformContext.current
    var selectedComment by remember { mutableStateOf<Comment?>(null) }
    val snackbarHostState = remember { SnackbarHostState() }

    val isAtBottom by remember {
        derivedStateOf {
            val layoutInfo = lazyListState.layoutInfo
            val totalItems = layoutInfo.totalItemsCount
            val lastVisibleItemIndex = layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
            lastVisibleItemIndex >= totalItems - 1
        }
    }

    LaunchedEffect(error) {
        if (error.isNotEmpty()) {
            scope.launch {
                snackbarHostState.showSnackbar(error)
            }
        }
    }

    LaunchedEffect(isAtBottom, isLoadingCommentsToilet) {
        if (isAtBottom && !isLoadingCommentsToilet) {
            onLoadMoreComments()
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header Section: Title, Address, Top Actions
            ToiletHeader(
                toilet = toilet,
                onReportClick = { navigateToToiletReport(toilet.publicId) },
                onBackClick = { navigateToBack() }
            )

            LazyColumn(
                state = lazyListState,
                modifier = Modifier
                    .fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
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

                // Main Action Buttons Row (Maps, Rate)
                item {
                    ToiletActions(
                        toilet = toilet,
                        onRateClick = { scope.launch { navigateToRating(toilet.publicId) } }
                    )
                }

                // Address Item
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.LocationOn,
                            contentDescription = context.getString(R.string.image_description_null),
                            modifier = Modifier
                                .size(20.dp)
                                .padding(end = 6.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = toilet.address,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                if (toilet.extras.isNotEmpty()) {
                    item {
                        ChipsToilet(toilet.extras)
                    }
                }

                item {
                    ToiletRatingSummary(toilet = toilet)
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
                            text = toilet.rating.totalRatings.toString(),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Medium,
                            color = Color.Gray
                        )
                    }
                }

                items(
                    items = comments,
                    key = { it.publicId }
                ) { comment ->
                    CommentToilet(
                        comment = comment,
                        userMain = userMain,
                        replies = repliesCache[comment.publicId] ?: emptyList(),
                        isLoadingReplies = loadingReplies.contains(comment.publicId),
                        navigateToReport = { commentId ->
                            navigateToCommentReport(commentId)
                        },
                        navigateToReplyReport = { replyId ->
                            navigateToReplyReport(replyId)
                        },
                        onReaction = { commentId, typeReaction ->
                            onReaction(toiletId, commentId, typeReaction)
                        },
                        onLoadReplies = { onLoadReplies(comment.publicId) },
                        onReply = { text -> onReply(comment.publicId, text) },
                        onEditComment = { onEditComment(comment.publicId) },
                        onDeleteComment = { onDeleteComment(comment.publicId) },
                        onEditReply = { replyId, text ->
                            onEditReply(
                                replyId,
                                comment.publicId,
                                text
                            )
                        },
                        onDeleteReply = { replyId -> onDeleteReply(replyId, comment.publicId) },
                        onClick = { selectedComment = comment }
                    )
                }

                if (isLoadingCommentsToilet) {
                    item {
                        Box(
                            modifier = Modifier.fillMaxWidth(),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator(modifier = Modifier.padding(16.dp))
                        }
                    }
                }
            }
        }

        SnackbarHost(
            hostState = snackbarHostState,
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }

    selectedComment?.let { comment ->
        CommentDetailDialog(
            comment = comment,
            onDismiss = { selectedComment = null }
        )
    }
}

@Preview(showBackground = true)
@Composable
fun ToiletDetailScreenPreview() {
    val toiletsStateFlow = generateToiletsStateFlow()
    val toiletId = toiletsStateFlow.collectAsState().value.keys.first()
    val commentsStateFlow = MutableStateFlow(mapOf(toiletId to generateCommentsList()))
    val isLoadingCommentsToiletStateFlow = MutableStateFlow(false)
    val userMainStateFlow = MutableStateFlow(generateUserMain())

    AppTheme {
        ToiletDetailScreen(
            toiletId = toiletId,
            toiletsStateFlow = toiletsStateFlow,
            commentsCacheStateFlow = commentsStateFlow,
            isLoadingCommentsToiletStateFlow = isLoadingCommentsToiletStateFlow,
            userMainStateFlow = userMainStateFlow,
            navigateToRating = {},
            lazyListState = rememberLazyListState()
        )
    }
}