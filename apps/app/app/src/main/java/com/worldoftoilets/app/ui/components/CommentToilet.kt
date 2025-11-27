package com.worldoftoilets.app.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.worldoftoilets.app.models.Comment
import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.ui.theme.AppTheme
import com.worldoftoilets.app.R

@Composable
fun CommentToilet(
    comment: Comment,
    userMain: User?,
    navigateToReport: (id: String) -> Unit = { _ -> },
    onReaction: (publicId: String, react: String) -> Unit = { _, _ -> },
) {
    val context = LocalContext.current

    HorizontalDivider(
        thickness = 2.dp,
        color = Color.LightGray
    )
    Column(
        modifier = Modifier.padding(top = 12.dp),
        verticalArrangement = Arrangement.spacedBy(5.dp)
    ) {
        Row(
            verticalAlignment = Alignment.Top
        ) {
            Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Image(
                    modifier = Modifier
                        .size(60.dp)
                        .clip(CircleShape)
                        .border(
                            width = 2.dp,
                            color = Color.Gray,
                            shape = CircleShape
                        ),
                    painter = comment.user.getIcon(),
                    contentDescription = context.getString(R.string.content_description_profile_picture)
                )
                Column {
                    Text(
                        text = comment.user.name,
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Bold,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                    )
                    Text(
                        text = comment.user.commentsCount.toString() + " " + context.getString(R.string.ratings),
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.SemiBold,
                    )
                }
            }
            if (userMain != null && userMain.publicId != comment.user.publicId) {
                IconButton(
                    onClick = { navigateToReport(comment.publicId) }
                ) {
                    Icon(
                        painter = painterResource(R.drawable.flag_24px),
                        contentDescription = "Report"
                    )
                }
            }
        }
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(5.dp)
        ) {
            Row {
                Stars(
                    rating = comment.score.toFloat(),
                    size = 20.dp
                )
            }
            Text(
                style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.SemiBold,
                text = comment.getDateTimeString()
            )
        }
        Column {
            Text(
                text = comment.text ?: "",
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Normal,
            )
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(60.dp)
            ) {
                ThumbUp(
                    count = comment.reactCounts.likeCount,
                    isPressed = comment.myReact == "like",
                    onClick = {
                        onReaction(comment.publicId, "like")
                    }
                )
                ThumbDown(
                    count = comment.reactCounts.dislikeCount,
                    isPressed = comment.myReact == "dislike",
                    onClick = {
                        onReaction(comment.publicId, "dislike")
                    }
                )
            }
        }
    }
}

/*
@Preview(showBackground = true)
@Composable
private fun CommentPreview() {
    val comment = generateComment()
    val userMain = generateUser()

    AppTheme {
        CommentToilet(
            comment = comment,
            userMain = userMain
        )
    }
}
*/