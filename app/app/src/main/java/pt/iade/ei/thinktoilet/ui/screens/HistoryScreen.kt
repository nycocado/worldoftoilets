package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.StateFlow
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.UiState
import pt.iade.ei.thinktoilet.tests.generateToiletsNearbyIdsStateFlow
import pt.iade.ei.thinktoilet.tests.generateToiletsStateFlow
import pt.iade.ei.thinktoilet.ui.components.HistoryCard

@Composable
fun HistoryScreen(
    toiletsStateFlow: StateFlow<Map<Int, Toilet>>,
    toiletIdsStateFlow: StateFlow<UiState<List<Int>>>,
    navigateToHomeScreen: (Int?) -> Unit = {},
) {
    val toilets = toiletsStateFlow.collectAsState().value
    val toiletIds = toiletIdsStateFlow.collectAsState().value

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 20.dp),
    ) {
        when (toiletIds) {
            UiState.Loading -> {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ){
                    CircularProgressIndicator()
                }
            }

            is UiState.Success -> {
                LazyColumn {
                    val toiletList = toiletIds.data.mapNotNull { toilets[it] }
                    items(toiletList) { toilet ->
                        HistoryCard(
                            toilet = toilet,
                            onClick = { selectedToiletId ->
                                navigateToHomeScreen(selectedToiletId)
                            }
                        )
                    }
                }
            }

            is UiState.Error -> {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ){
                    Text(text = toiletIds.message)
                }
            }
        }
    }
}


@Preview(showBackground = true)
@Composable
fun HistoryPreview() {
    val toiletsStateFlow = generateToiletsStateFlow()
    val toilets = toiletsStateFlow.collectAsState().value
    val toiletsNearbyIdsStateFlow = generateToiletsNearbyIdsStateFlow(toilets)
    HistoryScreen(
        toiletsStateFlow = toiletsStateFlow,
        toiletIdsStateFlow = toiletsNearbyIdsStateFlow
    )
}
