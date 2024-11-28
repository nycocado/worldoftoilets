package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import pt.iade.ei.thinktoilet.ui.components.HistoryCard
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel

@Composable
fun HistoryScreen(
    onNavigateToHomeScreen: (Int?) -> Unit = {},
    localViewModel: LocalViewModel = viewModel()
) {
    val toiletIds = localViewModel.toiletsHistoryIds.observeAsState().value
    val toilets = localViewModel.toilets.observeAsState().value?.filter{ it.id in toiletIds!! }
    LaunchedEffect(Unit){
        if(toilets.isNullOrEmpty()){
            localViewModel.loadToiletsHistory()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 20.dp),
    ) {
        if(toilets.isNullOrEmpty()) {
            CircularProgressIndicator()
        } else {
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
}


@Preview(showBackground = true)
@Composable
fun HistoryPreview() {
    HistoryScreen()
}
