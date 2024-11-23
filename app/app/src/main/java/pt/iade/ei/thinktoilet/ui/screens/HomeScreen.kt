package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.BottomSheetScaffold
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SheetValue
import androidx.compose.material3.rememberBottomSheetScaffoldState
import androidx.compose.material3.rememberStandardBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.CommentItem
import pt.iade.ei.thinktoilet.ui.components.Comment
import pt.iade.ei.thinktoilet.ui.components.CustomDragHandle
import pt.iade.ei.thinktoilet.ui.components.LocationCard
import pt.iade.ei.thinktoilet.ui.navegation.BottomSheetNavigation
import pt.iade.ei.thinktoilet.ui.navegation.Routes
import pt.iade.ei.thinktoilet.ui.pages.ToiletPage
import pt.iade.ei.thinktoilet.viewmodel.LocalViewModel

val LocalNavHostController = compositionLocalOf<NavController> { error("NavHostController ERRO") }

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    mainNavController: NavController = rememberNavController(),
    localViewModel: LocalViewModel,
    selectedToiletId: Int? = null,
) {
    val navController = rememberNavController()
    val scope = rememberCoroutineScope()
    val bottomSheetCurrentRoute =
        navController.currentBackStackEntryAsState().value?.destination?.route
    val initialSheetValue: SheetValue = SheetValue.PartiallyExpanded
    val scaffoldState = rememberBottomSheetScaffoldState(
        bottomSheetState = rememberStandardBottomSheetState(
            initialValue = initialSheetValue,
            confirmValueChange = {
                it == SheetValue.Expanded || it == SheetValue.PartiallyExpanded
            }
        )
    )

    LaunchedEffect(selectedToiletId) {
        if (selectedToiletId != null) {
            navController.navigate(Routes.homeToiletDetail(selectedToiletId))
        }
    }

    LaunchedEffect(bottomSheetCurrentRoute) {
        if (bottomSheetCurrentRoute == "home/{toiletId}") {
            scaffoldState.bottomSheetState.expand()
        } else {
            scaffoldState.bottomSheetState.partialExpand()
        }
    }

    val toggleSheetState: () -> Unit = {
        scope.launch {
            if (scaffoldState.bottomSheetState.currentValue == SheetValue.Expanded) {
                scaffoldState.bottomSheetState.partialExpand()
            } else {
                scaffoldState.bottomSheetState.expand()
            }
        }
    }

    CompositionLocalProvider(
        LocalNavHostController provides navController
    ) {
        BottomSheetScaffold(
            scaffoldState = scaffoldState,
            sheetPeekHeight = 140.dp,
            sheetShadowElevation = 8.dp,
            sheetContainerColor = MaterialTheme.colorScheme.surfaceContainerLow,
            sheetDragHandle = {
                CustomDragHandle {
                    toggleSheetState()
                }
            },
            sheetContent = {
                Box(
                    modifier = Modifier.fillMaxHeight(0.99f)
                ) {
                    BottomSheetNavigation(navController, mainNavController, localViewModel)
                }
            },
        ) {
            Image(
                painter = painterResource(id = R.drawable.map_placeholder),
                contentDescription = "Mapa",
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        }
    }
}

@Composable
fun ToiletDetail(
    navController: NavController,
    localViewModel: LocalViewModel,
    toiletId: Int,
) {
    val toilet = localViewModel.toilets.value?.find { it.id == toiletId }
    localViewModel.getToiletComment(toiletId)
    val comments: List<CommentItem> = localViewModel.commentsToilet.value!!.filter { it.toiletId == toiletId }
    LazyColumn {
        item {
            ToiletPage(toilet = toilet!!) {
                navController.navigate("rating")
            }
        }
        items(comments) { comment ->
            Comment(
                comment = comment,
                user = localViewModel.users.value!!.find { it.id == comment.userId }!!
            )
        }
    }
}

@Composable
fun ToiletList(
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
                        onClick = onToiletSelected
                    )
                }
            }
        }
    }
}
