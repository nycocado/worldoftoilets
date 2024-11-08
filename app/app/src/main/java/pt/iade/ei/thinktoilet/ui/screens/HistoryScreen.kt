package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.test.generateRandomToilet
import pt.iade.ei.thinktoilet.test.generateRandomToilets
import pt.iade.ei.thinktoilet.ui.components.HistoryCard

@Composable
fun HistoryScreen() {
    val toilets: List<Toilet> = generateRandomToilets(20)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 20.dp),
    ) {
        LazyColumn {
            items(toilets) { toilet ->
                HistoryCard(
                    toilet = toilet,

                )
            }
        }
    }
}


@Preview(showBackground = true)
@Composable
fun HistoryPreview() {
    HistoryScreen()
}
