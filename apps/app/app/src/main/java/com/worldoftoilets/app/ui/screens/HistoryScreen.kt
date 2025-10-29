package com.worldoftoilets.app.ui.screens

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
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.worldoftoilets.app.models.Toilet
import com.worldoftoilets.app.models.UiState
import com.worldoftoilets.app.models.responses.PageResponse
import com.worldoftoilets.app.tests.generateToiletsHistoryIdsStateFlow
import com.worldoftoilets.app.tests.generateToiletsStateFlow
import com.worldoftoilets.app.ui.components.HistoryCard
import com.worldoftoilets.app.ui.components.LoadMoreCard
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import com.worldoftoilets.app.R

@Composable
fun HistoryScreen(
    toiletsStateFlow: StateFlow<Map<Int, Toilet>>,
    toiletIdsStateFlow: StateFlow<UiState<PageResponse<Int>>>,
    navigateToHomeScreen: (Int?) -> Unit = {},
    onClickLoadMore: (PageResponse<Int>) -> Unit = {}
) {
    val context = LocalContext.current
    val toilets = toiletsStateFlow.collectAsState().value
    val toiletIds = toiletIdsStateFlow.collectAsState().value
    val scope = rememberCoroutineScope()

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
                    val toiletList = toiletIds.data.content.mapNotNull { toilets[it] }
                    items(toiletList) { toilet ->
                        HistoryCard(
                            toilet = toilet,
                            onClick = { selectedToiletId ->
                                navigateToHomeScreen(selectedToiletId)
                            }
                        )
                    }

                    if (!toiletIds.data.page.isLast) {
                        item {
                            LoadMoreCard(
                                onClick = { scope.launch { onClickLoadMore(toiletIds.data) } }
                            )
                        }
                    }
                }
            }

            is UiState.Error -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(top = 16.dp)
                        .padding(horizontal = 30.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(context.getString(R.string.error_unexpected))
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
    val toiletsNearbyIdsStateFlow = generateToiletsHistoryIdsStateFlow(toilets)
    HistoryScreen(
        toiletsStateFlow = toiletsStateFlow,
        toiletIdsStateFlow = toiletsNearbyIdsStateFlow
    )
}
