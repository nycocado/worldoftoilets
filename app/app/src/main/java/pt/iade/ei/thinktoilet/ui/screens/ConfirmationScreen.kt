package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.ui.theme.AppTheme


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConfirmationScreenOne() {
    val iconSize = 90.dp

    Scaffold(topBar = {
        CenterAlignedTopAppBar(title = {
            Text(
                text = "Denúncia",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
        })
    }) { innerPadding ->

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 30.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                HorizontalDivider(
                    thickness = 2.dp, color = Color.LightGray,
                )

                Row(
                    modifier = Modifier.padding(
                        top = 120.dp,
                        bottom = 60.dp
                    )
                ) {
                    Box(
                        modifier = Modifier
                            .size(iconSize)
                            .background(
                                color = MaterialTheme.colorScheme.primaryContainer,
                                shape = CircleShape
                            ), contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Check,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(iconSize * 0.85f)
                        )
                    }
                }
            }
            item {
                Text(
                    text = "Obrigado por reportar",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    modifier = Modifier.padding(
                        top = 20.dp
                    ),
                    text = "Iremos analisar a tua denúncia e tomar as medidas adequadas caso se verifique uma violação das diretrizes da comunidade.",
                    style = MaterialTheme.typography.bodyLarge,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}


@Composable
@Preview(showBackground = true)
fun ConfirmationScreenPreview() {
    AppTheme {
        ConfirmationScreenOne()
    }
}