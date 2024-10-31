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
import androidx.compose.material3.Text
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
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.test.generateDistance
import pt.iade.ei.thinktoilet.test.generateRandomToilet

@Composable
@OptIn(ExperimentalMaterial3Api::class, ExperimentalFoundationApi::class)
fun BottomSheetScaffoldThinkToilet() {
    val scaffoldState = rememberBottomSheetScaffoldState(
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
        listOf(
            generateRandomToilet(),
            generateRandomToilet(),
            generateRandomToilet(),
            generateRandomToilet(),
            generateRandomToilet()
        )
    }

    BackHandler(enabled = locationSelected) {
        locationSelected = false
        toiletSelected = null
    }

    BottomSheetScaffold(
        scaffoldState = scaffoldState,
        sheetPeekHeight = 160.dp,
        sheetShadowElevation = 8.dp,
        sheetContent = {
            Box(
                modifier = Modifier
                    .fillMaxHeight(0.98f)
            ) {
                if (locationSelected) {
                    LaunchedEffect(scaffoldState.bottomSheetState) {
                        scaffoldState.bottomSheetState.expand()
                    }
                    Text(
                        text = "Toilet selected: ${toiletSelected?.name}",
                        modifier = Modifier.fillMaxSize()
                    )
                } else {
                    CompositionLocalProvider(
                        LocalOverscrollConfiguration provides null
                    ) { // Remove o efeito de overscroll do LazyColumn
                        LaunchedEffect(scaffoldState.bottomSheetState) {
                            scaffoldState.bottomSheetState.partialExpand()
                        }
                        LazyColumn(
                            modifier = Modifier
                                .fillMaxSize(),
                            userScrollEnabled = false
                        ) {
                            items(5) {
                                val toilet = toilets[it]
                                LocationCard(
                                    toilet = toilet,
                                    distance = generateDistance(),
                                    onClick = { selectedToilet ->
                                        locationSelected = true
                                        toiletSelected = selectedToilet
                                    }
                                )
                            }
                        }
                    }
                }
            }
        },
    ) {}
}