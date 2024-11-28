package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import pt.iade.ei.thinktoilet.ui.components.LocationCard
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel

@Composable
fun ToiletListScreen(
    localViewModel: LocalViewModel,
    onToiletSelected: (Int) -> Unit
) {
    val toiletsIds = localViewModel.toiletsNearbyIds.observeAsState().value
    val toilets = localViewModel.toilets.observeAsState().value?.filter { it.id in toiletsIds!! }
    LaunchedEffect(Unit) {
        if(toilets.isNullOrEmpty() || localViewModel.location.value == null) {
            localViewModel.loadLocation()
        }
    }

    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        if (toilets.isNullOrEmpty()) {
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
        } else {
            LazyColumn {
                items(toilets) { toilet ->
                    LocationCard(
                        toilet = toilet,
                        location = localViewModel.location.value!!,
                        onClick = onToiletSelected
                    )
                }
            }
        }
    }
}