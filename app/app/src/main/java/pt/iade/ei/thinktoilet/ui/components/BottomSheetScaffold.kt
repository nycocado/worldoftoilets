package pt.iade.ei.thinktoilet.ui.components

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.LocalOverscrollConfiguration
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.BottomSheetScaffold
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.SheetValue
import androidx.compose.material3.rememberBottomSheetScaffoldState
import androidx.compose.material3.rememberStandardBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.test.generateRandomDistance
import pt.iade.ei.thinktoilet.test.generateRandomToiletsWithComments

@Composable
@OptIn(ExperimentalMaterial3Api::class)
fun BottomSheetScaffoldThinkToilet() {
    val scaffoldState = rememberBottomSheetScaffoldState( // Define os estados do BottomSheet
        bottomSheetState = rememberStandardBottomSheetState(
            initialValue = SheetValue.PartiallyExpanded,
            confirmValueChange = {
                it == SheetValue.Expanded || it == SheetValue.PartiallyExpanded
            }
        )
    )
    var locationSelected by remember { mutableStateOf(false) }
    var toiletSelected by remember { mutableStateOf<Toilet?>(null) }
    val toilets: List<Toilet> = remember {
        generateRandomToiletsWithComments(
            numToilets = 5,
            numComments = 5
        )
    }

    BackHandler(enabled = locationSelected) {
        locationSelected = false
        toiletSelected = null
    }

    BottomSheetScaffold(
        // Define o BottomSheet
        scaffoldState = scaffoldState,
        sheetPeekHeight = 160.dp,
        sheetShadowElevation = 8.dp,
        sheetContent = {
            Box(
                modifier = Modifier
                    .fillMaxHeight(0.98f) // Deixa um espaço entre o BottomSheet e a camera
            ) {
                if (locationSelected) {
                    LaunchedEffect(scaffoldState.bottomSheetState) {
                        scaffoldState.bottomSheetState.expand()
                    }
                    SelectedToiletContent(toiletSelected!!)
                } else {
                    LaunchedEffect(scaffoldState.bottomSheetState) {
                        scaffoldState.bottomSheetState.partialExpand()
                    }
                    ToiletListContent(toilets = toilets) { selectedToilet ->
                        locationSelected = true
                        toiletSelected = selectedToilet
                    }
                }
            }
        },
    ) {}
}

@Composable
fun SelectedToiletContent(toilet: Toilet) {
    LazyColumn {
        item {
            ToiletPage(toilet = toilet)
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun ToiletListContent(toilets: List<Toilet>, onToiletSelected: (Toilet) -> Unit) {
    CompositionLocalProvider(
        LocalOverscrollConfiguration provides null
    ) { // Remove o efeito de overscroll do LazyColumn
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
        ) {
            items(5) {
                val toilet = toilets[it]
                LocationCard(
                    toilet = toilet,
                    distance = generateRandomDistance(),
                    onClick = onToiletSelected
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun BottomSheetScaffoldThinkToiletPreview() {
    BottomSheetScaffoldThinkToilet()
}