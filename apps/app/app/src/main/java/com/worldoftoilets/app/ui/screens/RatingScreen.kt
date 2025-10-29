package com.worldoftoilets.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.worldoftoilets.app.models.Comment
import com.worldoftoilets.app.models.Toilet
import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.tests.generateRandomToilet
import com.worldoftoilets.app.tests.generateUser
import com.worldoftoilets.app.ui.components.RatingItem
import com.worldoftoilets.app.ui.components.Stars
import com.worldoftoilets.app.ui.theme.AppTheme
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import com.worldoftoilets.app.R

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RatingScreen(
    toilet: Toilet,
    user: User,
    ratingStateFlow: StateFlow<Result<Comment>?> = MutableStateFlow(null),
    onRating: (toiletId: Int, userId: Int, text: String, ratingClean: Int, ratingPaper: Boolean, ratingStructure: Int, ratingAccessibility: Int) -> Unit = { _, _, _, _, _, _, _ -> },
    onRatingSuccess: () -> Unit = {},
    navigateToBack: () -> Unit = {}
) {
    val ratingState = ratingStateFlow.collectAsState().value
    var ratingClean by remember { mutableIntStateOf(1) }
    var ratingPaper by remember { mutableStateOf(false) }
    var ratingStructure by remember { mutableIntStateOf(1) }
    var ratingAccessibility by remember { mutableIntStateOf(1) }
    var averageRating by remember { mutableFloatStateOf(1f) }

    var avgPaper = 0f
    if (ratingPaper) {
        avgPaper = 2f // 40%
    }

    averageRating =
        ((ratingClean * 0.2f) + avgPaper + (ratingStructure * 0.2f) + (ratingAccessibility * 0.2f))

    var comment by remember { mutableStateOf("") }
    var commentSupportText by remember { mutableStateOf("") }
    var commentError by remember { mutableStateOf(false) }

    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    LaunchedEffect(comment) {
        commentSupportText = if (comment.isEmpty()) {
            commentError = true
            context.getString(R.string.comment_required)
        } else if (comment.length > 260) {
            commentError = true
            context.getString(R.string.comment_too_long)
        } else {
            commentError = false
            "${comment.length}/260"
        }
    }

    LaunchedEffect(ratingState) {
        ratingState?.onSuccess {
            onRatingSuccess()
        }

        ratingState?.onFailure {
            commentError = true
            commentSupportText = context.getString(R.string.error_comment)
        }
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = context.getString(R.string.rate),
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(onClick = {
                        navigateToBack()
                    }) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back"
                        )
                    }
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            item {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(vertical = 10.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(5.dp)
                ) {
                    Text(
                        text = toilet.name,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Stars(averageRating, size = 35.dp, horizontalPadding = 5.dp)
                        Text(
                            text = "%.1f".format(averageRating),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                }
            }

            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 10.dp),
                    horizontalAlignment = Alignment.Start,
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = context.getString(R.string.comment),
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Normal,
                    )
                    TextField(
                        value = comment,
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(min = 150.dp),
                        shape = RoundedCornerShape(topEnd = 10.dp, topStart = 10.dp),
                        onValueChange = { newText ->
                            comment = newText
                        },
                        label = {
                            Text(
                                text = context.getString(R.string.insert_comment),
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Normal,
                            )
                        },
                        isError = commentError,
                        supportingText = {
                            Text(
                                text = commentSupportText,
                                style = MaterialTheme.typography.bodySmall,
                                color = if (commentError) {
                                    MaterialTheme.colorScheme.error
                                } else {
                                    MaterialTheme.colorScheme.onSurface
                                }
                            )
                        }
                    )
                }
            }

            item {
                HorizontalDivider(
                    modifier = Modifier
                        .padding(vertical = 30.dp)
                        .fillMaxWidth(1f),
                    thickness = 2.dp,
                    color = Color.LightGray
                )
            }

            item {
                Column(
                    verticalArrangement = Arrangement.spacedBy(20.dp),
                ) {
                    RatingItem(title = context.getString(R.string.clean), rating = ratingClean) {
                        ratingClean = it
                    }
                    RatingItem(
                        title = context.getString(R.string.structure),
                        rating = ratingStructure
                    ) {
                        ratingStructure = it
                    }
                    RatingItem(
                        title = context.getString(R.string.accessibility),
                        rating = ratingAccessibility
                    ) {
                        ratingAccessibility = it
                    }
                    Row(
                        modifier = Modifier
                            .fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            modifier = Modifier.weight(1f),
                            text = context.getString(R.string.paper),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Normal,
                        )
                        Switch(
                            checked = ratingPaper,
                            onCheckedChange = {
                                ratingPaper = it
                            },
                            thumbContent = if (ratingPaper) {
                                {
                                    Icon(
                                        imageVector = Icons.Filled.Check,
                                        contentDescription = context.getString(R.string.checked),
                                        modifier = Modifier.size(SwitchDefaults.IconSize),
                                    )
                                }
                            } else {
                                null
                            }
                        )
                    }
                }

            }

            item {
                Button(
                    onClick = {
                        if (!commentError)
                            scope.launch {
                                onRating(
                                    toilet.id,
                                    user.id!!,
                                    comment,
                                    ratingClean,
                                    ratingPaper,
                                    ratingStructure,
                                    ratingAccessibility
                                )
                            }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 20.dp),
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
                        text = context.getString(R.string.rate),
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun DefaultPreview() {
    AppTheme {
        RatingScreen(
            toilet = generateRandomToilet(),
            user = generateUser()
        )
    }
}