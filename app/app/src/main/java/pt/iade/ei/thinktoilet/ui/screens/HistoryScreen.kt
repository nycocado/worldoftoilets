package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import pt.iade.ei.thinktoilet.models.UiState
import pt.iade.ei.thinktoilet.ui.components.HistoryCard
import pt.iade.ei.thinktoilet.ui.components.SettingsCarousel
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel

@Composable
fun HistoryScreen(
    onNavigateToHomeScreen: (Int?) -> Unit = {},
    localViewModel: LocalViewModel = viewModel()
) {
    val toiletIds = localViewModel.toiletsHistoryIds.collectAsState().value
    val toilets = localViewModel.toilets.collectAsState().value

    LaunchedEffect(Unit) {
        localViewModel.loadToiletsHistory()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 20.dp),
    ) {
        when (toiletIds) {
            UiState.Loading -> {
                CircularProgressIndicator()
            }

            is UiState.Success -> {
                LazyColumn {
                    val toiletList = toilets
                        .filter { it.id in toiletIds.data }
                        .sortedBy { toiletIds.data.indexOf(it.id) }
                    items(toiletList) { toilet ->
                        HistoryCard(
                            toilet = toilet,
                            onClick = { selectedToiletId ->
                                onNavigateToHomeScreen(selectedToiletId)
                            }
                        )
                    }
                }
            }

            is UiState.Error -> {
                Text(text = toiletIds.message)
            }
        }
    }
}


@Preview(showBackground = true)
@Composable
fun HistoryPreview() {
    HistoryScreen()
}
