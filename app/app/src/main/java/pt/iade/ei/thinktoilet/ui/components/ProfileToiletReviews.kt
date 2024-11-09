package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import pt.iade.ei.thinktoilet.models.ToiletReviews
import pt.iade.ei.thinktoilet.test.generateToiletReviews


@Composable
fun ProfileCritiques(ToiletReviews: ToiletReviews) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(10.dp)
    ) {
        Row {
            Text(
                text = ToiletReviews.toilet.name,
                fontWeight = FontWeight.SemiBold,
                fontSize = 20.sp
            )
        }
        Row(
            modifier = Modifier.padding(
                top = 5.dp,
                bottom = 1.dp
            ),

        ) {
            Row(
                modifier = Modifier
                    .padding(end = 10.dp)
            ) {
                Stars(
                    rating = ToiletReviews.toilet.getAverageRating(),
                    size = 20.dp
                )
            }
            Text(
                text = "há uma semana",
                fontWeight = FontWeight.SemiBold,
                fontSize = 12.sp
            )
        }
        Row {
            Text(
                text = ToiletReviews.comments,
                fontWeight = FontWeight.Normal,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                fontSize = 14.sp,
            )
        }
    }

}

@Preview(showBackground = true)
@Composable
fun PreviewToiletReviews() {
    ProfileCritiques(generateToiletReviews())
}