package com.worldoftoilets.app.ui.screens

import android.location.Location
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
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
import com.worldoftoilets.app.ui.components.LocationCard
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import com.worldoftoilets.app.R
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.LaunchedEffect
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.worldoftoilets.app.ui.theme.AppTheme
import com.worldoftoilets.app.ui.util.generateLocationStateFlow
import com.worldoftoilets.app.ui.util.generateToiletsNearbyIdsStateFlow
import com.worldoftoilets.app.ui.util.generateToiletsStateFlow

@Composable
fun ToiletListScreen(
    toiletsStateFlow: StateFlow<Map<String, Toilet>>,
    toiletsNearbyIdsStateFlow: StateFlow<UiState<PageResponse<String>>>,
    locationStateFlow: StateFlow<Location?>,
    navigateToToiletDetail: (String) -> Unit = {},
    onClickLoadMore: (PageResponse<String>) -> Unit = {}
) {
    val context = LocalContext.current
    val toilets by toiletsStateFlow.collectAsStateWithLifecycle()
    val toiletIds by toiletsNearbyIdsStateFlow.collectAsStateWithLifecycle()
    val location by locationStateFlow.collectAsStateWithLifecycle()
    
    val scope = rememberCoroutineScope()
    val listState = rememberLazyListState()
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.surfaceContainerLow)
    ) {            
        when (val state = toiletIds) {
            UiState.Loading -> {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 16.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    CircularProgressIndicator(
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }

            is UiState.Success -> {
                val toiletList = state.data.content.mapNotNull { toilets[it] }

                val isAtBottom by remember {
                    derivedStateOf {
                        val layoutInfo = listState.layoutInfo
                        val totalItems = layoutInfo.totalItemsCount
                        if (totalItems == 0) return@derivedStateOf false
                        val lastVisibleItemIndex = layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
                        lastVisibleItemIndex >= totalItems - 1
                    }
                }

                LaunchedEffect(isAtBottom) {
                    if (isAtBottom && state.data.page?.isLast != true) {
                        onClickLoadMore(state.data)
                    }
                }

                LazyColumn(state = listState) {
                    items(toiletList) { toilet ->
                        LocationCard(
                            toilet = toilet,
                            location = location,
                            onClick = { scope.launch { navigateToToiletDetail(it) } }
                        )
                    }

                    if (state.data.page?.isLast != true) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                CircularProgressIndicator()
                            }
                        }
                    }
                }
            }

            is UiState.Error -> {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 16.dp)
                        .padding(horizontal = 30.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(context.getString(R.string.error_unexpected))
                }
            }

            UiState.Idle -> {
                // Nothing to show
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ToiletListPreview() {
    AppTheme {
        ToiletListScreen(
            toiletsStateFlow = generateToiletsStateFlow(),
            toiletsNearbyIdsStateFlow = generateToiletsNearbyIdsStateFlow(
                generateToiletsStateFlow().collectAsState().value
            ),
            locationStateFlow = generateLocationStateFlow()
        )
    }
}
