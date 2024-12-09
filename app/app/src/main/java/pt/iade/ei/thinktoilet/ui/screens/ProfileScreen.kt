package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.tests.generateCommentsList
import pt.iade.ei.thinktoilet.tests.generateRandomToilet
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.ui.components.ProfileStatus
import pt.iade.ei.thinktoilet.ui.components.ProfileUser
import pt.iade.ei.thinktoilet.ui.components.ToiletReview

@Composable
fun ProfileScreen(
    toiletsStateFlow: StateFlow<Map<Int, Toilet>>,
    userStateFlow: StateFlow<User?>,
    commentsStateFlow: StateFlow<List<Comment>>
) {
    val user = userStateFlow.collectAsState().value
    val comments = commentsStateFlow.collectAsState().value
    val context = LocalContext.current

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
    ) {
        LazyColumn(
            modifier = Modifier.padding(top = 80.dp)
        ) {
            item {
                ProfileUser(user!!)
            }

            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(
                            horizontal = 15.dp
                        ),
                    horizontalArrangement = Arrangement.Center
                ) {
                    Button(
                        onClick = { /*TODO*/ },
                        colors = ButtonColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer,
                            contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
                            disabledContainerColor = MaterialTheme.colorScheme.primaryContainer.copy(
                                alpha = 0.5f
                            ),
                            disabledContentColor = MaterialTheme.colorScheme.onPrimaryContainer.copy(
                                alpha = 0.5f
                            )
                        )
                    ) {
                        Text(
                            text = context.getString(R.string.edit_profile),
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            item {
                ProfileStatus(user!!)
            }

            item {
                HorizontalDivider(
                    modifier = Modifier
                        .padding(
                            top = 15.dp,
                            bottom = 20.dp
                        )
                        .fillMaxWidth(1f),
                    thickness = 2.dp,
                    color = Color.LightGray
                )
            }

            item {
                Text(
                    text = context.getString(R.string.your_critics),
                    fontWeight = FontWeight.Bold,
                    style = MaterialTheme.typography.headlineSmall,
                    textDecoration = TextDecoration.Underline
                )
            }

            if (comments.isEmpty()) {
                item {
                    CircularProgressIndicator(modifier = Modifier.padding(16.dp))
                }
            } else {
                items(comments) { comment ->
                    val toilet = toiletsStateFlow.collectAsState().value[comment.toiletId]
                    if (toilet != null) {
                        ToiletReview(
                            comment = comment,
                            toilet = toilet
                        )
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ProfileScreenPreview() {
    val userStateFlow = MutableStateFlow(generateUserMain())
    val toiletsStateFlow = MutableStateFlow(
        mapOf(
            1 to generateRandomToilet(1),
        )
    )
    val commentsStateFlow = MutableStateFlow(generateCommentsList())
    ProfileScreen(
        toiletsStateFlow = toiletsStateFlow,
        userStateFlow = userStateFlow,
        commentsStateFlow = commentsStateFlow
    )
}
