package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.tests.generateComment
import pt.iade.ei.thinktoilet.tests.generateRandomToilet
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

/**
* Exibe um comentário simplificado de uma casa de banho.
*
* @param comment [Comment] que contém os detalhes do comentário.
* @param toilet [Toilet] que contém os detalhes da casa de banho.
*/
@Composable
fun ToiletReview(
    comment: Comment,
    toilet: Toilet
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(
                vertical = 16.dp
            )
    ) {
        Text(
            text = toilet.name,
            fontWeight = FontWeight.SemiBold,
            style = MaterialTheme.typography.titleLarge
        )
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(bottom = 4.dp)
        ) {
            Stars(
                rating = toilet.getAverageRating(),
                size = 20.dp
            )
            Text(
                modifier = Modifier.padding(start = 8.dp),
                text = "há uma semana",
                fontWeight = FontWeight.SemiBold,
                style = MaterialTheme.typography.labelLarge
            )
        }
        Text(
            text = comment.text,
            fontWeight = FontWeight.Normal,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
            style = MaterialTheme.typography.bodyMedium,
        )
    }

}

@Preview(showBackground = true)
@Composable
private fun PreviewToiletReviews() {
    ToiletReview(
        comment = generateComment(),
        toilet = generateRandomToilet()
    )
}