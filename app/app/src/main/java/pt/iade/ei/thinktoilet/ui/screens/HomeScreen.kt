package pt.iade.ei.thinktoilet.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.BottomSheetScaffold
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SheetValue
import androidx.compose.material3.Text
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import coil.compose.SubcomposeAsyncImage
import coil.request.ImageRequest
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.BuildConfig
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.ui.components.Comment
import pt.iade.ei.thinktoilet.ui.components.CustomDragHandle
import pt.iade.ei.thinktoilet.ui.components.LocationCard
import pt.iade.ei.thinktoilet.ui.components.Stars
import pt.iade.ei.thinktoilet.ui.components.ToiletRating
import pt.iade.ei.thinktoilet.ui.navegation.BottomSheetNavigation
import pt.iade.ei.thinktoilet.ui.navegation.Routes
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
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val toilet = localViewModel.toilets.value?.find { it.id == toiletId }
    val comments =
        localViewModel.commentsToilet.observeAsState().value?.filter { it.toiletId == toiletId }
            .orEmpty()
    val url = BuildConfig.API_URL + "toilets/${toilet!!.id}/image?API_KEY=" + BuildConfig.API_KEY

    if (comments.isEmpty()) {
        localViewModel.getToiletComments(toiletId)
    }

    LazyColumn(
        modifier = Modifier.padding(16.dp)
    ) {
        item {
            Text(
                text = toilet.name,
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            Row(
                modifier = Modifier.padding(
                    top = 4.dp,
                    bottom = 14.dp
                ),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Stars(
                    rating = toilet.getAverageRating(), size = 22.dp
                )
                Text(
                    modifier = Modifier.padding(horizontal = 4.dp),
                    text = "%.1f".format(toilet.getAverageRating()),
                    fontStyle = MaterialTheme.typography.bodyMedium.fontStyle,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        item {
            SubcomposeAsyncImage(
                model = ImageRequest.Builder(context)
                    .data(url)
                    .crossfade(true)
                    .build(),
                contentDescription = "Imagem da casa de banho",
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(MaterialTheme.shapes.medium)
                    .aspectRatio(1f),
                contentScale = ContentScale.Crop,
                loading = {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .background(Color.LightGray),
                        contentAlignment = Alignment.Center,
                    ) {
                        CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                    }
                },
                error = {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .background(Color.LightGray),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Erro ao carregar a imagem",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            )
        }

        item {
            Row(
                modifier = Modifier.padding(vertical = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = toilet.address,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium
                    )
                }
                Column {
                    Button(
                        onClick = {
                            val destination = Uri.encode(toilet.address)
                            val intent = Intent(
                                Intent.ACTION_VIEW,
                                Uri.parse("https://www.google.com/maps/dir/?api=1&destination=${destination}QVB&destination_place_id=${toilet.placeId}&travelmode=walking")
                            ).apply {
                                putExtra(
                                    Intent.EXTRA_REFERRER,
                                    Uri.parse("android-app://com.google.android.apps.maps")
                                )
                            }
                            context.startActivity(intent)
                        },
                        colors = ButtonColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer,
                            contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
                            disabledContainerColor = MaterialTheme.colorScheme.primaryContainer.copy(
                                alpha = 0.5f
                            ),
                            disabledContentColor = MaterialTheme.colorScheme.onPrimaryContainer.copy(
                                alpha = 0.5f
                            )
                        )
                    ) {
                        Text(
                            text = "Ir para o Maps",
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }

        item {
            ToiletRating(toilet = toilet)
        }

        item {
            Button(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(
                        top = 16.dp,
                        bottom = 8.dp
                    ),
                onClick = { scope.launch { navController.navigate("rating") } },
                colors = ButtonColors(
                    containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                    contentColor = MaterialTheme.colorScheme.onTertiaryContainer,
                    disabledContainerColor = MaterialTheme.colorScheme.tertiaryContainer.copy(alpha = 0.5f),
                    disabledContentColor = MaterialTheme.colorScheme.onTertiaryContainer.copy(alpha = 0.5f)
                )
            ) {
                Text(
                    text = "Avaliar",
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Bold,
                )
            }
        }

        item {
            Row(
                modifier = Modifier.padding(
                    bottom = 8.dp
                ),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    modifier = Modifier.padding(
                        end = 10.dp,
                    ),
                    text = "Avaliações",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                )
                Text(
                    text = toilet.numComments.toString(),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Medium,
                    color = Color.Gray
                )
            }
        }

        if (comments.isEmpty()) {
            item {
                CircularProgressIndicator(modifier = Modifier.padding(16.dp))
            }
        } else {
            items(comments) { comment ->
                val user = localViewModel.users.value?.find { it.id == comment.userId }
                if (user != null) {
                    Comment(comment = comment, user = user)
                }
            }
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
                        location = localViewModel.location.value!!,
                        onClick = onToiletSelected
                    )
                }
            }
        }
    }
}