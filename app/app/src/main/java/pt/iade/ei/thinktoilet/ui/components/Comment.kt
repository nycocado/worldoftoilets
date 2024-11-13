package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.tests.generateComment
import pt.iade.ei.thinktoilet.ui.theme.AppTheme
import pt.iade.ei.thinktoilet.viewmodels.LocalViewModel

@Composable
fun Comment(
    comment: Comment,
) {
    HorizontalDivider(
        thickness = 2.dp,
        color = Color.LightGray
    )
    Column(
        modifier = Modifier.padding(vertical = 12.dp)
    ) {
        UserComment(comment = comment)
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
                    rating = comment.rate,
                    size = 20.dp
                )
            }
            Text(
                text = "há uma semana",
                style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.SemiBold,
                fontSize = 12.sp
            )
        }
        Row(
            modifier = Modifier.padding(vertical = 5.dp)
        ) {
            Text(
                text = comment.text,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Normal,
            )
        }
        Row(
            modifier = Modifier.padding(vertical = 3.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier
                    .padding(end = 30.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Image(
                        painter = painterResource(R.drawable.like),
                        contentDescription = "Like Icon",
                        Modifier.padding(end = 5.dp)
                    )
                    Text(
                        text = comment.like.toString(),
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold,
                    )
                }
            }
            Column {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Image(
                        painter = painterResource(R.drawable.dislike),
                        contentDescription = "Like Icon",
                        Modifier.padding(end = 5.dp)

                    )
                    Text(
                        text = comment.dislike.toString(),
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold,
                    )
                }
            }
        }
    }
}

@Composable
fun UserComment(comment: Comment) {
    val viewModel: LocalViewModel = viewModel()
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
                    text = viewModel.users.value?.get(comment.userId)!!.name,
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            Row {
                Text(
                    text = "${viewModel.users.value?.get(comment.userId)!!.numComments} Avaliações",
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
        Comment(
            comment = generateComment()
        )
    }
}


