package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.tests.generateCommentsList
import pt.iade.ei.thinktoilet.tests.generateRandomToilet
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.ui.components.ToiletReview
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@Composable
fun ProfileScreen(
    toiletsStateFlow: StateFlow<Map<Int, Toilet>>,
    userStateFlow: StateFlow<User?>,
    commentsStateFlow: StateFlow<List<Comment>>,
    isLoadingCommentsUserStateFlow: StateFlow<Boolean>,
    navigateToSettings: () -> Unit = { },
    onClickLogout: () -> Unit = { }
) {
    val user = userStateFlow.collectAsState().value
    val comments = commentsStateFlow.collectAsState().value
    val isLoadingCommentsUser = isLoadingCommentsUserStateFlow.collectAsState().value
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var menuExpanded by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        item {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.End
            ) {
                IconButton(
                    onClick = { menuExpanded = !menuExpanded }
                ) {
                    Icon(
                        imageVector = Icons.Default.MoreVert,
                        contentDescription = "Menu"
                    )
                    DropdownMenu(
                        expanded = menuExpanded,
                        onDismissRequest = { menuExpanded = false }
                    ) {
                        DropdownMenuItem(
                            text = {
                                Text(
                                    text = "Logout",
                                    style = MaterialTheme.typography.bodyLarge,
                                    fontWeight = FontWeight.Bold
                                )
                            },
                            onClick = { scope.launch { onClickLogout() } }
                        )
                    }
                }
            }
        }

        item {
            if (user != null) {
                Image(
                    modifier = Modifier
                        .size(150.dp)
                        .clip(CircleShape)
                        .border(
                            width = 5.dp, color = Color.Gray, shape = CircleShape
                        ),
                    painter = user.getIcon(),
                    contentDescription = context.getString(R.string.content_description_profile_picture)
                )
                Text(
                    text = user.name,
                    modifier = Modifier.padding(top = 20.dp),
                    fontWeight = FontWeight.SemiBold,
                    style = MaterialTheme.typography.titleLarge,
                    maxLines = 1,
                )
                Text(
                    text = user.email!!,
                    modifier = Modifier.padding(5.dp),
                    fontWeight = FontWeight.Normal,
                    style = MaterialTheme.typography.titleMedium,
                    maxLines = 1,
                )
            }
        }

        item {
            Button(
                modifier = Modifier
                    .padding(
                        top = 15.dp
                    ),
                onClick = { navigateToSettings() },
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

        item {
            HorizontalDivider(
                modifier = Modifier
                    .padding(
                        top = 20.dp,
                        bottom = 20.dp
                    )
                    .fillMaxWidth(1f),
                thickness = 2.dp,
                color = Color.LightGray
            )
        }

        item {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.Start
            ) {
                Text(
                    text = context.getString(R.string.your_critics),
                    fontWeight = FontWeight.Bold,
                    style = MaterialTheme.typography.headlineSmall,
                    textDecoration = TextDecoration.Underline
                )
            }
        }

        when (isLoadingCommentsUser) {
            true -> {
                item {
                    CircularProgressIndicator(modifier = Modifier.padding(16.dp))
                }
            }

            false -> {
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
    val isLoadingCommentsUser = MutableStateFlow(false)
    AppTheme {
        ProfileScreen(
            toiletsStateFlow = toiletsStateFlow,
            userStateFlow = userStateFlow,
            commentsStateFlow = commentsStateFlow,
            isLoadingCommentsUserStateFlow = isLoadingCommentsUser
        )
    }
}
