package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
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
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@Composable
fun RatingPage(
    userMain: UserMain,
) {
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
        RatingUser(userMain)
        RatingComment()
        HorizontalDivider(
            modifier = Modifier
                .padding(
                    vertical = 30.dp
                )
                .fillMaxWidth(1f),
            thickness = 2.dp,
            color = Color.LightGray
        )
        Row(
            modifier = Modifier
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Stars(rating = 0f, size = 60.dp)
        }
        Column(modifier = Modifier.padding(top = 30.dp)) {
            RatingItem(title = "Limpeza", rating = 0f)
            RatingItem(title = "Papel", rating = 0f)
            RatingItem(title = "Estrutura", rating = 0f)
            RatingItem(title = "Acessibilidade", rating = 0f)
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
                        width = 2.dp,
                        color = Color.Gray,
                        shape = CircleShape
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
fun RatingComment() {
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
    Card(
        modifier = Modifier
            .fillMaxWidth(),
        shape = MaterialTheme.shapes.large,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceDim,
            contentColor = MaterialTheme.colorScheme.onSurface,
            disabledContainerColor = MaterialTheme.colorScheme.surfaceDim.copy(alpha = 0.5f),
            disabledContentColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
        ),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 40.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                modifier = Modifier.fillMaxWidth(),
                text = "Compartilhe sua experiência...",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurface,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }
}

@Composable
fun RatingItem(
    title: String, rating: Float
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
        Stars(rating = rating, size = 35.dp)
    }
}

@Preview(showBackground = true)
@Composable
fun RatingPagePreview() {
    AppTheme {
        RatingPage(userMain = generateUserMain())
    }
}