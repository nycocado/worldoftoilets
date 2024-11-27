package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.ui.components.LocationCard
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel

@Composable
fun ToiletListScreen(
    localViewModel: LocalViewModel,
    onToiletSelected: (Int) -> Unit
) {
    val toilets = localViewModel.toilets.observeAsState()

    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        if (toilets.value.isNullOrEmpty()) {
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
                items(5) { index ->
                    LocationCard(
                        toilet = toilets.value!![index],
                        location = localViewModel.location.value!!,
                        onClick = onToiletSelected
                    )
                }
            }
        }
    }
}