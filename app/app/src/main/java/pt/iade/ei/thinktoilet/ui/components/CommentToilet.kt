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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
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
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.tests.generateComment
import pt.iade.ei.thinktoilet.tests.generateUser
import pt.iade.ei.thinktoilet.ui.theme.AppTheme


/**
         * Função que mostra um Comentário.
         *
         * @param comment O comentário a ser exibido.
         * @param user O usuário.
         *
         *
         * Esta função permite ao usuário interagir com um comentário, incluindo
         *a possibilidade de clicar nos botões de "like" ou "dislike".
         *
         *
         * Exemplo de uso:
         * ```
         * ReportComplement(
         *     comment = "Gostei da Casa de Banho.",
         *     user = User
         * )
         * ```
         */
@Composable
fun CommentToilet(
    comment: Comment,
    user: User
) {
    var likePressed by remember { mutableStateOf(false) }
    var dislikePressed by remember { mutableStateOf(false) }
    val context = LocalContext.current

    HorizontalDivider(
        thickness = 2.dp,
        color = Color.LightGray
    )
    Column(
        modifier = Modifier.padding(top = 12.dp)
    ) {
        UserComment(user)
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
                    isPressed = likePressed
                ) {
                    likePressed = !it
                    if (likePressed && !dislikePressed) {
                        comment.like += 1
                    } else if (!likePressed && !dislikePressed) {
                        comment.like -= 1
                    } else if (likePressed && dislikePressed) {
                        comment.like += 1
                        comment.dislike -= 1
                        dislikePressed = false
                    }
                }
            }
            Column(
                modifier = Modifier
                    .width(100.dp)
            ) {
                ThumbDown(
                    count = comment.dislike,
                    isPressed = dislikePressed
                ) {
                    dislikePressed = !it
                    if (dislikePressed && !likePressed) {
                        comment.dislike += 1
                    } else if (!dislikePressed && !likePressed) {
                        comment.dislike -= 1
                    } else if (dislikePressed && likePressed) {
                        comment.dislike += 1
                        comment.like -= 1
                        likePressed = false
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

@Composable
fun UserComment(user: User) {
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
                Text(//
                    text = user.numComments.toString() + " " + LocalContext.current.getString(R.string.commentToilet),
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.SemiBold,
                )
            }
        }
    }
}


@Preview(showBackground = true)
@Composable
fun CommentPreview() {
    AppTheme {
        CommentToilet(
            comment = generateComment(),
            user = generateUser()
        )
    }
}


