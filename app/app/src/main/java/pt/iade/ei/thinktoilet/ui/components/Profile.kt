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
import androidx.compose.ui.unit.sp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.test.generateUserMain


@Composable
fun Profile(userMain: UserMain) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(
                top = 20.dp,
            )
        ) {
            Image(
                modifier = Modifier
                    .size(190.dp) // Size of Image checked if is good...
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
                fontSize = 32.sp,
                maxLines = 1,
            )
        }
        Row {
            Text(
                text = userMain.email,
                modifier = Modifier.padding(top = 10.dp),
                fontWeight = FontWeight.Normal,
                fontSize = 26.sp,
                maxLines = 1,
            )
        }
        Row {
            Text(
                text = userMain.points.toString() + " points",
                modifier = Modifier.padding(top = 10.dp),
                fontWeight = FontWeight.Normal,
                color = MaterialTheme.colorScheme.secondary,
                fontSize = 24.sp,
                maxLines = 1,
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewProfile() {
    Profile(generateUserMain())
}