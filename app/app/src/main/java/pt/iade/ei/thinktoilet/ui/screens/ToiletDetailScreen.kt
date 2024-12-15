package pt.iade.ei.thinktoilet.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonColors
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import coil3.compose.LocalPlatformContext
import coil3.compose.SubcomposeAsyncImage
import coil3.request.ImageRequest
import coil3.request.crossfade
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
import pt.iade.ei.thinktoilet.ui.components.CommentToilet
import pt.iade.ei.thinktoilet.ui.components.Stars
import pt.iade.ei.thinktoilet.ui.components.ToiletRating

@Composable
fun ToiletDetailScreen(
    toiletId: Int,
    toiletsStateFlow: StateFlow<Map<Int, Toilet>>,
    commentsStateFlow: StateFlow<List<Comment>>,
    usersStateFlow: StateFlow<Map<Int, User>>,
    navigateToRating: (Int) -> Unit,
    onClickBack: () -> Unit = {}
) {
    val toilet = toiletsStateFlow.collectAsState().value[toiletId]!!
    val comments = commentsStateFlow.collectAsState().value.filter { it.toiletId == toiletId }
    val users = usersStateFlow.collectAsState().value

    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val platformContext = LocalPlatformContext.current

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        item {
            Row(
                modifier = Modifier.padding(bottom = 16.dp)
            ) {
                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = toilet.name,
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Row(
                        modifier = Modifier.padding(
                            top = 4.dp,
                        ),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Stars(
                            rating = toilet.getAverageRating(), size = 22.dp
                        )
                        Text(
                            modifier = Modifier.padding(horizontal = 4.dp),
                            text = "%.1f".format(toilet.getAverageRating()),
                            fontStyle = MaterialTheme.typography.bodyMedium.fontStyle,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
                FilledIconButton(
                    onClick = { onClickBack() },
                    modifier = Modifier.size(38.dp),
                    colors = IconButtonColors(
                        containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                        contentColor = MaterialTheme.colorScheme.onTertiaryContainer,
                        disabledContainerColor = MaterialTheme.colorScheme.tertiaryContainer.copy(
                            alpha = 0.5f
                        ),
                        disabledContentColor = MaterialTheme.colorScheme.onTertiaryContainer.copy(
                            alpha = 0.5f
                        )
                    )
                ) {
                    Icon(
                        imageVector = Icons.Filled.Close,
                        contentDescription = "Voltar"
                    )
                }
            }
        }

        item {
            SubcomposeAsyncImage(
                model = ImageRequest.Builder(platformContext)
                    .data(toilet.getImageUrl())
                    .crossfade(true)
                    .build(),
                contentDescription = context.getString(R.string.content_description_toilet_image) + ": " + toilet.name,
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(MaterialTheme.shapes.medium)
                    .aspectRatio(1f),
                contentScale = ContentScale.Crop,
                loading = {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .background(Color.LightGray),
                        contentAlignment = Alignment.Center,
                    ) {
                        CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                    }
                },
                error = {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .background(Color.LightGray),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = context.getString(R.string.error_image),
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            )
        }

        item {
            Row(
                modifier = Modifier.padding(vertical = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = toilet.address,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium
                    )
                }
                Column {
                    Button(
                        onClick = {
                            val intent = Intent(
                                Intent.ACTION_VIEW,
                                Uri.parse(toilet.getMapsUrl())
                            ).apply {
                                putExtra(
                                    Intent.EXTRA_REFERRER,
                                    Uri.parse(context.getString(R.string.maps_uri))
                                )
                            }
                            context.startActivity(intent)
                        },
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
                            text = context.getString(R.string.go_to_maps),
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }

        item {
            ToiletRating(toilet)
        }

        item {
            Button(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(
                        top = 16.dp,
                        bottom = 8.dp
                    ),
                onClick = { scope.launch { navigateToRating(toilet.id) } },
                colors = ButtonColors(
                    containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                    contentColor = MaterialTheme.colorScheme.onTertiaryContainer,
                    disabledContainerColor = MaterialTheme.colorScheme.tertiaryContainer.copy(
                        alpha = 0.5f
                    ),
                    disabledContentColor = MaterialTheme.colorScheme.onTertiaryContainer.copy(
                        alpha = 0.5f
                    )
                )
            ) {
                Text(
                    text = context.getString(R.string.rate),
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Bold,
                )
            }
        }

        item {
            Row(
                modifier = Modifier.padding(
                    bottom = 8.dp
                ),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    modifier = Modifier.padding(
                        end = 10.dp,
                    ),
                    text = context.getString(R.string.comments),
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                )
                Text(
                    text = toilet.numComments.toString(),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Medium,
                    color = Color.Gray
                )
            }
        }

        if (comments.isEmpty()) {
            item {
                CircularProgressIndicator(modifier = Modifier.padding(16.dp))
            }
        } else {
            items(comments) { comment ->
                val user = users[comment.userId]
                if (user != null) {
                    CommentToilet(
                        comment = comment,
                        user = user
                    )
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ToiletDetailScreenPreview() {
    val toiletsStateFlow = MutableStateFlow(
        mapOf(
            1 to generateRandomToilet(1)
        )
    )
    val commentsStateFlow = MutableStateFlow(generateCommentsList())
    val usersStateFlow = MutableStateFlow(
        mapOf(
            1 to generateUserMain()
        )
    )

    ToiletDetailScreen(
        toiletId = 1,
        toiletsStateFlow = toiletsStateFlow,
        commentsStateFlow = commentsStateFlow,
        usersStateFlow = usersStateFlow,
        navigateToRating = {}
    )
}