package pt.iade.ei.thinktoilet.ui.pages

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
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
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.ui.components.Stars
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@Composable
fun RatingPage(
    userMain: UserMain,
) {
    var ratingClean by remember { mutableFloatStateOf(0f) }
    var ratingPaper by remember { mutableFloatStateOf(0f) }
    var ratingStructure by remember { mutableFloatStateOf(0f) }
    var ratingAccessibility by remember { mutableFloatStateOf(0f) }
    var averageRating by remember { mutableFloatStateOf(0f) }
    averageRating = (ratingClean + ratingPaper + ratingStructure + ratingAccessibility) / 4
    var commentInput by remember { mutableStateOf("") }

    Column {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 20.dp),
            horizontalArrangement = Arrangement.Center
        ) {
            Text(
                text = "Avaliar",
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = FontWeight.Bold
            )
        }
        RatingUser(userMain = userMain)
        RatingComment(commentInput) {
            commentInput = it
        }
        HorizontalDivider(
            modifier = Modifier
                .padding(
                    vertical = 30.dp
                )
                .fillMaxWidth(1f),
            thickness = 2.dp,
            color = Color.LightGray
        )
        Column (
            modifier = Modifier
                .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Stars(averageRating, size = 60.dp)
        }
        Column(modifier = Modifier.padding(top = 30.dp)) {
            RatingItem(title = "Limpeza", rating = ratingClean) {
                ratingClean = it.toFloat()
            }
            RatingItem(title = "Papel", rating = ratingPaper) {
                ratingPaper = it.toFloat()
            }
            RatingItem(title = "Estrutura", rating = ratingStructure) {
                ratingStructure = it.toFloat()
            }
            RatingItem(title = "Acessibilidade", rating = ratingAccessibility) {
                ratingAccessibility = it.toFloat()
            }
        }
    }
}

@Composable
fun RatingUser(
    userMain: UserMain,
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column {
            Image(
                modifier = Modifier
                    .size(90.dp)
                    .clip(CircleShape)
                    .border(
                        width = 2.dp, color = Color.Gray, shape = CircleShape
                    ),
                painter = painterResource(R.drawable.image_test),
                contentDescription = "Like Icon"
            )
        }
        Column(
            modifier = Modifier.padding(start = 10.dp)
        ) {
            Row {
                Text(
                    text = userMain.user.name,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Normal,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
    }
}

@Composable
fun RatingComment(
    commentInput: String = "",
    onCommentChange: (String) -> Unit = {}
) {
    Row(
        modifier = Modifier
            .padding(
                top = 20.dp,
                bottom = 10.dp
            )
    ) {
        Text(
            text = "Comentar",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Normal,
        )

    }
    //here

    TextField(
        value = commentInput,
        singleLine = false,
        modifier = Modifier
            .fillMaxWidth()
            .height(125.dp),
        shape = RoundedCornerShape(topEnd = 10.dp, topStart = 10.dp),
        onValueChange = { newText ->
            onCommentChange(newText)
        },
        label = {
            Text(
                text = "Escreva seu Comentário...",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Normal,
            )
        },
    )
}

@Composable
fun RatingItem(
    title: String, rating: Float,
    onClick: ((Int) -> Unit)? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            modifier = Modifier.weight(1f),
            text = title,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Normal,
        )
        Stars(rating = rating, size = 35.dp) {
            if (onClick != null) {
                onClick(it)
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun RatingPagePreview() {
    AppTheme {
        RatingPage(userMain = generateUserMain())
    }
}