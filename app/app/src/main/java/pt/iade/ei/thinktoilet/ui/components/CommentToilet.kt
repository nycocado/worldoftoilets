package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
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
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Reaction
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.models.enums.TypeReaction
import pt.iade.ei.thinktoilet.tests.generateComment
import pt.iade.ei.thinktoilet.tests.generateUser
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

/**
 * Exibe um comentário de um usuário sobre um Toilet.
 *
 * @param comment [Comment] que contém os detalhes do comentário.
 * @param reaction [Reaction] que contém a reação do usuário ao comentário.
 * @param user [User] que contém os detalhes do usuário que fez o comentário.
 * @param onReaction Callback que é chamado quando o usuário reage ao comentário.
 */
@Composable
fun CommentToilet(
    comment: Comment,
    reaction: Reaction,
    user: User,
    userMain: User,
    navigateToReport: (id: Int) -> Unit = { _ -> },
    onReaction: (id: Int, typeReaction: TypeReaction) -> Unit = { _, _ -> },
) {
    val context = LocalContext.current

    HorizontalDivider(
        thickness = 2.dp,
        color = Color.LightGray
    )
    Column(
        modifier = Modifier.padding(top = 12.dp),
    ) {
        Row(
            verticalAlignment = Alignment.Top
        ) {
            Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically
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
                    painter = user.getIcon(),
                    contentDescription = context.getString(R.string.content_description_profile_picture)
                )
                Column(
                    modifier = Modifier.padding(10.dp)
                ) {
                    Text(
                        text = user.name,
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Bold,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                    )
                    Text(
                        text = user.numComments.toString() + " " + context.getString(R.string.ratings),
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.SemiBold,
                    )
                }
            }
            if (userMain.id != user.id) {
                IconButton(
                    onClick = { navigateToReport(comment.id) }
                ) {
                    Icon(
                        painter = painterResource(R.drawable.flag_24px),
                        contentDescription = "Report"
                    )
                }
            }
        }
        Row(
            modifier = Modifier.padding(
                top = 5.dp,
                bottom = 1.dp
            ),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                modifier = Modifier
                    .padding(end = 10.dp)
            ) {
                Stars(
                    rating = comment.average(),
                    size = 20.dp
                )
            }
            Text(
                style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.SemiBold,
                text = comment.getDateTimeString()
            )
        }
        Row(
            modifier = Modifier.padding(top = 5.dp)
        ) {
            Text(
                text = comment.text,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Normal,
            )
        }
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier
                    .width(100.dp)
            ) {
                ThumbUp(
                    count = comment.like,
                    isPressed = reaction.typeReaction == TypeReaction.LIKE,
                    onClick = {
                        if (reaction.typeReaction == TypeReaction.LIKE) {
                            onReaction(comment.id, TypeReaction.NONE)
                        } else {
                            onReaction(comment.id, TypeReaction.LIKE)
                        }
                    }
                )
            }
            Column(
                modifier = Modifier
                    .width(100.dp)
            ) {
                ThumbDown(
                    count = comment.dislike,
                    isPressed = reaction.typeReaction == TypeReaction.DISLIKE,
                    onClick = {
                        if (reaction.typeReaction == TypeReaction.DISLIKE) {
                            onReaction(comment.id, TypeReaction.NONE)
                        } else {
                            onReaction(comment.id, TypeReaction.DISLIKE)
                        }
                    }
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun CommentPreview() {
    val comment = generateComment()
    val reaction = Reaction(
        commentId = comment.id,
        typeReaction = TypeReaction.LIKE
    )
    val user = generateUser()
    val userMain = generateUser()

    AppTheme {
        CommentToilet(
            comment = comment,
            reaction = reaction,
            user = user,
            userMain = userMain
        )
    }
}