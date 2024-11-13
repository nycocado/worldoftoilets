package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.tests.generateRandomToilets
import pt.iade.ei.thinktoilet.ui.components.HistoryCard
import pt.iade.ei.thinktoilet.viewmodels.LocalViewModel

@Composable
fun HistoryScreen(
    onNavigateToHomeScreen : (Int?) -> Unit = {},
    toilets: List<Toilet> = emptyList()
) {
    val viewModel: LocalViewModel = viewModel()
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 20.dp),
    ) {
        LazyColumn {
            items(toilets) { toilet ->
                HistoryCard(
                    toilet = toilet,
                    onClick = { selectedToiletId ->
                        onNavigateToHomeScreen(selectedToiletId)
                    }
                )
            }
        }
    }
}


@Preview(showBackground = true)
@Composable
fun HistoryPreview() {
    HistoryScreen(
        toilets = generateRandomToilets(15)
    )
}
