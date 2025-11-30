package com.worldoftoilets.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.Send
import androidx.compose.material.icons.rounded.Flag
import androidx.compose.material.icons.rounded.MoreVert
import androidx.compose.material.icons.rounded.Verified
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.Comment
import com.worldoftoilets.app.models.Reply
import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.ui.theme.AppTheme
import com.worldoftoilets.app.ui.util.generateComment
import com.worldoftoilets.app.ui.util.generateUserMain

@Composable
fun CommentToilet(
    comment: Comment,
    userMain: User?,
    replies: List<Reply> = emptyList(),
    isLoadingReplies: Boolean = false,
    navigateToReport: (id: String) -> Unit = { _ -> },
    navigateToReplyReport: (id: String) -> Unit = { _ -> },
    onReaction: (publicId: String, react: String) -> Unit = { _, _ -> },
    onReply: (String) -> Unit = {},
    onLoadReplies: () -> Unit = {},
    onEditComment: (String) -> Unit = {},
    onDeleteComment: () -> Unit = {},
    onEditReply: (String, String) -> Unit = { _, _ -> },
    onDeleteReply: (String) -> Unit = {},
    onClick: () -> Unit = {}
) {
    val context = LocalContext.current
    var showReplyInput by remember { mutableStateOf(false) }
    var replyText by remember { mutableStateOf("") }
    var showReplies by remember { mutableStateOf(false) }
    var showCommentMenu by remember { mutableStateOf(false) }

    Card(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp), // Space between cards
        shape = MaterialTheme.shapes.medium,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface, // White surface
        ),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant), // Subtle border
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Header: User Info & Menu
            Row(
                verticalAlignment = Alignment.Top,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    modifier = Modifier.weight(1f),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Image(
                        modifier = Modifier
                            .size(48.dp) // Slightly smaller for card context
                            .clip(CircleShape)
                            .border(
                                width = 2.dp,
                                color = MaterialTheme.colorScheme.primary, // Primary color border
                                shape = CircleShape
                            ),
                        painter = comment.user.getIcon(),
                        contentDescription = context.getString(R.string.content_description_profile_picture)
                    )

                    Column {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Text(
                                text = comment.user.name,
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                                color = if (comment.user.isPartner) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
                            )
                            if (comment.user.isPartner) {
                                Icon(
                                    imageVector = Icons.Rounded.Verified,
                                    contentDescription = "Verified",
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Stars(
                                rating = comment.average(),
                                size = 14.dp // Compact stars
                            )
                            Text(
                                text = " • " + comment.getDateTimeString(),
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
                
                Box {
                    IconButton(
                        modifier = Modifier.size(24.dp),
                        onClick = { showCommentMenu = true }
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.MoreVert,
                            contentDescription = "Options",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    DropdownMenu(
                        expanded = showCommentMenu,
                        onDismissRequest = { showCommentMenu = false }
                    ) {
                        if (userMain != null && userMain.publicId == comment.user.publicId) {
                            DropdownMenuItem(
                                text = { Text("Edit") },
                                onClick = {
                                    onEditComment(comment.publicId)
                                    showCommentMenu = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Delete") },
                                onClick = {
                                    onDeleteComment()
                                    showCommentMenu = false
                                }
                            )
                        } else {
                            DropdownMenuItem(
                                text = { Text(context.getString(R.string.report)) },
                                onClick = {
                                    navigateToReport(comment.publicId)
                                    showCommentMenu = false
                                },
                                leadingIcon = {
                                    Icon(
                                        imageVector = Icons.Rounded.Flag,
                                        contentDescription = null,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            )
                        }
                    }
                }
            }

            // Content: Comment Text
            if (!comment.text.isNullOrBlank()) {
                Text(
                    text = comment.text ?: "",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }

            // Footer: Reactions and Reply
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Reply Action
                if (userMain != null) {
                    TextButton(
                        onClick = { showReplyInput = !showReplyInput }
                    ) {
                        Text(
                            text = context.getString(R.string.reply),
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                } else {
                    Spacer(modifier = Modifier.size(1.dp)) // Placeholder
                }

                Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                    ThumbUp(
                        count = comment.reactCounts.likeCount,
                        isPressed = comment.myReact == "like",
                        onClick = { onReaction(comment.publicId, "like") }
                    )
                    ThumbDown(
                        count = comment.reactCounts.dislikeCount,
                        isPressed = comment.myReact == "dislike",
                        onClick = { onReaction(comment.publicId, "dislike") }
                    )
                }
            }

            // Reply Input Field
            if (showReplyInput) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedTextField(
                        value = replyText,
                        onValueChange = { replyText = it },
                        modifier = Modifier.weight(1f),
                        placeholder = { Text(context.getString(R.string.write_reply)) },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                        keyboardActions = KeyboardActions(onSend = {
                            if (replyText.isNotBlank()) {
                                onReply(replyText)
                                replyText = ""
                                showReplyInput = false
                                showReplies = true // Auto-expand
                            }
                        })
                    )
                    IconButton(
                        onClick = {
                            if (replyText.isNotBlank()) {
                                onReply(replyText)
                                replyText = ""
                                showReplyInput = false
                                showReplies = true
                            }
                        },
                        enabled = replyText.isNotBlank()
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Rounded.Send,
                            contentDescription = "Send"
                        )
                    }
                }
            }

            // View Replies Button & List
            if (comment.replyCount > 0 || replies.isNotEmpty()) {
                val allRepliesLoaded = replies.size >= comment.replyCount
                
                Column {
                    // Toggle Button
                    TextButton(
                        onClick = {
                            showReplies = !showReplies
                            if (showReplies && replies.isEmpty()) {
                                onLoadReplies()
                            }
                        },
                        modifier = Modifier.align(Alignment.Start)
                    ) {
                        val text = if (showReplies) context.getString(R.string.hide_replies) else context.getString(R.string.view_replies, comment.replyCount)
                        Text(
                            text = text,
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }

                    if (showReplies) {
                        if (isLoadingReplies && replies.isEmpty()) {
                            CircularProgressIndicator(
                                modifier = Modifier
                                    .size(24.dp)
                                    .align(Alignment.CenterHorizontally),
                                strokeWidth = 2.dp
                            )
                        } else {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(start = 16.dp) // Indent replies
                            ) {
                                replies.forEach { reply ->
                                    ReplyItem(
                                        reply = reply,
                                        userMain = userMain,
                                        navigateToReport = navigateToReplyReport,
                                        onEdit = { text -> onEditReply(reply.publicId, text) },
                                        onDelete = { onDeleteReply(reply.publicId) }
                                    )
                                }
                                
                                // Load More Button for Replies
                                if (!allRepliesLoaded && replies.isNotEmpty()) {
                                    TextButton(
                                        onClick = { onLoadReplies() },
                                        modifier = Modifier.padding(start = 12.dp)
                                    ) {
                                        Text(
                                            text = context.getString(R.string.load_more),
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                    }
                                }
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
private fun CommentPreview() {
    val comment = generateComment()
    val userMain = generateUserMain()

    AppTheme {
        Column(modifier = Modifier.padding(16.dp)) {
            CommentToilet(
                comment = comment,
                userMain = userMain
            )
        }
    }
}
