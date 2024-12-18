package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Reaction
import pt.iade.ei.thinktoilet.models.TypeReaction
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.tests.generateComment
import pt.iade.ei.thinktoilet.tests.generateUser
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@Composable
fun CommentToilet(
    comment: Comment,
    reaction: Reaction,
    user: User,
    onReaction: (Int, TypeReaction) -> Unit = { _, _ -> }
) {
    HorizontalDivider(
        thickness = 2.dp,
        color = Color.LightGray
    )
    Column(
        modifier = Modifier.padding(top = 12.dp)
    ) {
        Row(
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
                painter = painterResource(R.drawable.image_test),
                contentDescription = "Like Icon"
            )
            Column(
                modifier = Modifier.padding(10.dp)
            ) {
                Row {
                    Text(
                        text = user.name,
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Bold,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
                Row {
                    Text(
                        text = "${user.numComments} Avaliações",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.SemiBold,
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
                    isPressed = reaction.typeReaction == TypeReaction.LIKE
                ) {
                    if (reaction.typeReaction == TypeReaction.LIKE) {
                        onReaction(comment.id!!, TypeReaction.NONE)
                    } else {
                        onReaction(comment.id!!, TypeReaction.LIKE)
                    }
                }
            }
            Column(
                modifier = Modifier
                    .width(100.dp)
            ) {
                ThumbDown(
                    count = comment.dislike,
                    isPressed = reaction.typeReaction == TypeReaction.DISLIKE
                ) {
                    if (reaction.typeReaction == TypeReaction.DISLIKE) {
                        onReaction(comment.id!!, TypeReaction.NONE)
                    } else {
                        onReaction(comment.id!!, TypeReaction.DISLIKE)
                    }
                }
            }
            Column(
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ){
                    Surface(
                        onClick = { /*TODO*/ },
                        color = Color.Transparent,
                        ){
                        Text(
                            text = context.getString(R.string.reportComment),
                            modifier = Modifier
                                .width(100.dp)
                                .padding(10.dp),
                            style = MaterialTheme.typography.labelSmall,
                            color = Color.Gray,
                            fontWeight = FontWeight.Normal,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun CommentPreview() {
    AppTheme {
        val comment = generateComment()
        val reaction = Reaction(
            commentId = comment.id!!,
            typeReaction = TypeReaction.LIKE
        )
        CommentToilet(
            comment = comment,
            reaction = reaction,
            user = generateUser()
        )
    }
}


