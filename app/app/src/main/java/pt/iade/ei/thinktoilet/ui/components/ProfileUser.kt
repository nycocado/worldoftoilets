package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.ui.theme.AppTheme


@Composable
fun Profile(userMain: UserMain) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 30.dp)
    ) {
        Row {
            Image(
                modifier = Modifier
                    .size(190.dp)
                    .clip(CircleShape)
                    .border(
                        width = 5.dp, color = Color.Gray, shape = CircleShape
                    ),
                painter = painterResource(R.drawable.image_test),
                contentDescription = "Profile Icon"
            )
        }
        Row {
            Text(
                text = userMain.name,
                modifier = Modifier.padding(top = 10.dp),
                fontWeight = FontWeight.SemiBold,
                style = MaterialTheme.typography.headlineMedium,
                maxLines = 1,
            )
        }
        Row {
            Text(
                text = userMain.email,
                modifier = Modifier.padding(5.dp),
                fontWeight = FontWeight.Normal,
                style = MaterialTheme.typography.titleLarge,
                maxLines = 1,
            )
        }
        Row {
            Text(
                modifier = Modifier.padding(top = 8.dp),
                text = userMain.points.toString() + " points",
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.secondary,
                style = MaterialTheme.typography.headlineSmall,
                maxLines = 1,
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewProfile() {
    AppTheme {
        Profile(generateUserMain())
    }
}