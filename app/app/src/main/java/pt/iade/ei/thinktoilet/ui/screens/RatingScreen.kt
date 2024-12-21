package pt.iade.ei.thinktoilet.ui.screens

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
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.tests.generateRandomToilet
import pt.iade.ei.thinktoilet.tests.generateUser
import pt.iade.ei.thinktoilet.ui.components.RatingItem
import pt.iade.ei.thinktoilet.ui.components.Stars
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

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
            "O comentário é obrigatório"
        } else if (comment.length > 260) {
            commentError = true
            "O comentário é muito longo"
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
            commentSupportText = "Erro ao enviar comentário"
        }
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = context.getString(R.string.register),
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
                .padding(horizontal = 16.dp)
        ) {
            item {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp)
                        .padding(vertical = 10.dp)
                        .padding(bottom = 10.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        modifier = Modifier.padding(bottom = 5.dp),
                        text = toilet.name,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Stars(averageRating, size = 35.dp, horizontalPadding = 5.dp)
                        Text(
                            modifier = Modifier.padding(start = 6.dp),
                            text = "%.1f".format(averageRating),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                }
            }

            item {
                Text(
                    modifier = Modifier
                        .padding(bottom = 10.dp),
                    text = "Comentar",
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
                            text = "Insira o comentário...",
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

            item {
                HorizontalDivider(
                    modifier = Modifier
                        .padding(
                            vertical = 30.dp
                        )
                        .fillMaxWidth(1f),
                    thickness = 2.dp,
                    color = Color.LightGray
                )
            }

            item {
                RatingItem(title = "Limpeza", rating = ratingClean) {
                    ratingClean = it
                }
                RatingItem(title = "Estrutura", rating = ratingStructure) {
                    ratingStructure = it
                }
                RatingItem(title = "Acessibilidade", rating = ratingAccessibility) {
                    ratingAccessibility = it
                }
                Row(
                    modifier = Modifier
                        .fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        modifier = Modifier.weight(0.9f),
                        text = "Papel",
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
                                    contentDescription = "Possui Papel Hiênico",
                                    modifier = Modifier.size(SwitchDefaults.IconSize),
                                )
                            }
                        } else {
                            null
                        }
                    )
                }
            }

            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(
                            top = 30.dp
                        ),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
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
                            .padding(bottom = 10.dp),
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
                            text = "Avaliar",
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
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