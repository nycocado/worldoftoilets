package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.PagerState
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.lerp
import coil3.compose.AsyncImage
import coil3.request.ImageRequest
import coil3.request.crossfade
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.tests.generateCarouselImage
import pt.iade.ei.thinktoilet.ui.theme.AppTheme
import kotlin.math.absoluteValue

/**
 * Exibe um carrossel de imagens.
 *
 * @param imageList Lista de [String] com os links das imagens.
 * @param pagerState [PagerState] que controla o estado do carrossel.
 */
@Composable
fun SettingsCarousel(
    imageList: List<String>,
    pagerState: PagerState
) {
    val context = LocalContext.current

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            modifier = Modifier.padding(vertical = 10.dp),
            text = context.getString(R.string.roll_to_change),
            style = MaterialTheme.typography.titleSmall,
            color = MaterialTheme.colorScheme.secondary
        )
        HorizontalPager(
            modifier = Modifier.padding(vertical = 10.dp),
            state = pagerState,
            contentPadding = PaddingValues(
                start = 150.dp,
                end = 130.dp
            )
        ) { index ->
            CardContent(index, pagerState, imageList)
        }
    }
}

/**
 * Exibe o conteúdo de um Card do carrossel.
 *
 * @param index [Int] que representa a posição do Card.
 * @param pagerState [PagerState] que controla o estado do carrossel.
 * @param imageList Lista de [String] com os links das imagens.
 */
@Composable
fun CardContent(
    index: Int,
    pagerState: PagerState,
    imageList: List<String>
) {
    val pageOffset = (pagerState.currentPage - index) + pagerState.currentPageOffsetFraction

    Card(
        shape = CircleShape,
        modifier = Modifier
            .height(150.dp)
            .aspectRatio(1f)
            .graphicsLayer {
                lerp(
                    start = 0.8f.dp,
                    stop = 1f.dp,
                    fraction = 1f - pageOffset.absoluteValue.coerceIn(0f, 1f)
                ).also { scale ->
                    scaleX = scale.value
                    scaleY = scale.value
                }
            },
    ) {
        AsyncImage(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f)
                .height(150.dp),
            model = ImageRequest.Builder(LocalContext.current).data(imageList[index])
                .crossfade(true).build(),
            contentDescription = "Image",
            contentScale = ContentScale.Crop
        )
    }
}

@Preview(showBackground = true)
@Composable
fun CardContentPreview() {
    val imageList = generateCarouselImage()
    val pagerState = rememberPagerState(initialPage = 0) {
        imageList.size
    }
    AppTheme {
        CardContent(0, pagerState, imageList)
    }
}

@Preview(showBackground = true)
@Composable
fun SettingsCarouselPreview() {
    val imageList = generateCarouselImage()
    val pagerState = rememberPagerState(initialPage = 0) {
        imageList.size
    }
    AppTheme {
        SettingsCarousel(
            imageList = imageList,
            pagerState = pagerState
        )
    }
}