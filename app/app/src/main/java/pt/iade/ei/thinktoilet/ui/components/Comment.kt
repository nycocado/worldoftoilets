package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.ui.Modifier
import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.modifier.modifierLocalMapOf
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.max
import androidx.compose.ui.unit.sp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.test.generateComment
import pt.iade.ei.thinktoilet.ui.theme.montserratFontFamily

@Composable
fun Comment(
    comment: Comment,
) {
    HorizontalDivider(
        thickness = 2.dp,
        color = Color.LightGray
    )
    Column (
        modifier = Modifier.padding(vertical = 12.dp)
    ){
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
                fontFamily = montserratFontFamily,
                fontWeight = FontWeight.SemiBold,
                fontSize = 12.sp
            )
        }
        Row(
            modifier = Modifier.padding(vertical = 5.dp)
        ) {
            Text(
                text = comment.text,
                fontFamily = montserratFontFamily,
                fontWeight = FontWeight.Normal,
                fontSize = 14.sp,
                style = TextStyle.Default
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
                        fontFamily = montserratFontFamily,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 14.sp
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
                        fontFamily = montserratFontFamily,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 14.sp
                    )
                }
            }
        }
    }
}

@Composable
fun UserComment(comment: Comment) {
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
                    comment.userForeigner.name,
                    fontFamily = montserratFontFamily,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = 20.sp
                )
            }
            Row {
                Text(
                    text = "${comment.userForeigner.numComments} Avaliações",
                    fontFamily = montserratFontFamily,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 12.sp,
                    lineHeight = 20.sp
                )
            }
        }
    }
}


@Preview(showBackground = true)
@Composable
fun CommentPreview() {
    Comment(
        comment = generateComment()
    )
}


