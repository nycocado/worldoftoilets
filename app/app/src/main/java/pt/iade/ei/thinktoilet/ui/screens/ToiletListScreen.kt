package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.models.UiState
import pt.iade.ei.thinktoilet.ui.components.LocationCard
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel

@Composable
fun ToiletListScreen(
    localViewModel: LocalViewModel,
    onToiletSelected: (Int) -> Unit
) {
    val toiletIds = localViewModel.toiletsNearbyIds.collectAsState().value
    val toilets = localViewModel.toilets.collectAsState().value

    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        when (toiletIds) {
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
                val toiletList = toilets
                    .filter { it.id in toiletIds.data }
                    .sortedBy { toiletIds.data.indexOf(it.id) }
                LazyColumn {
                    items(toiletList) { toilet ->
                        LocationCard(
                            toilet = toilet,
                            location = localViewModel.location.value!!,
                            onClick = onToiletSelected
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