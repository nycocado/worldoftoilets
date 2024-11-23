package pt.iade.ei.thinktoilet.ui.pages

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.ui.components.Stars
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@Composable
fun RatingPage(
    onClick: () -> Unit = {}
) {
    var ratingClean by remember { mutableFloatStateOf(0f) }
    var ratingPaper by remember { mutableStateOf(false) }
    var ratingStructure by remember { mutableFloatStateOf(0f) }
    var ratingAccessibility by remember { mutableFloatStateOf(0f) }
    var averageRating by remember { mutableFloatStateOf(0f) }

    var avgPaper = 0f
    if (ratingPaper) {
        avgPaper = 2f // 40%
    }

    averageRating =
        ((ratingClean * 0.2f) + avgPaper + (ratingStructure * 0.2f) + (ratingAccessibility * 0.2f))
    var commentInput by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    Column {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(
                    top = 20.dp,
                    bottom = 10.dp
                ),
            horizontalArrangement = Arrangement.Center
        ) {
            Text(
                text = "Avaliar",
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = FontWeight.Bold
            )
        }
        Column(
            modifier = Modifier
                .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Stars(averageRating, size = 35.dp, horizontalPadding = 5.dp)
        }
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

        Column {
            RatingItem(title = "Limpeza", rating = ratingClean) {
                ratingClean = it.toFloat()
            }
        }
        RatingItem(title = "Estrutura", rating = ratingStructure) {
            ratingStructure = it.toFloat()
        }
        RatingItem(title = "Acessibilidade", rating = ratingAccessibility) {
            ratingAccessibility = it.toFloat()
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


        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(
                    top = 30.dp
                ),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Button(
                onClick = { scope.launch { onClick() } },
                modifier = Modifier
                    .padding(bottom = 10.dp),
                colors = ButtonColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
                    disabledContainerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f),
                    disabledContentColor = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.5f)
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

<<<<<<< HEAD
=======

>>>>>>> 6829211 (Update RatingPage and ToiletPage)
@Composable
fun RatingComment(
    commentInput: String = "",
    onCommentChange: (String) -> Unit = {}
) {

    Row(
        modifier = Modifier
            .padding(
                top = 40.dp,
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
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Normal,
        )
        Stars(rating = rating, size = 40.dp, horizontalPadding = 3.dp) {
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
        RatingPage()
    }
}