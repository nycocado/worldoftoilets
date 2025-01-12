package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
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
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.util.lerp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.models.enums.UserIcon
import pt.iade.ei.thinktoilet.ui.theme.AppTheme
import kotlin.math.absoluteValue

@Composable
fun IconCarousel(
    imageList: List<Int>,
    pagerState: PagerState
) {
    val context = LocalContext.current
    val screenWidth = LocalConfiguration.current.screenWidthDp

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Text(
            text = context.getString(R.string.roll_to_change),
            style = MaterialTheme.typography.titleSmall,
            color = MaterialTheme.colorScheme.secondary
        )
        HorizontalPager(
            state = pagerState,
            contentPadding = PaddingValues(
                start = (screenWidth * 0.3f).dp,
                end = (screenWidth * 0.3f).dp
            )
        ) { index ->
            IconContent(index, pagerState, imageList)
        }
    }
}

@Composable
fun IconContent(
    index: Int,
    pagerState: PagerState,
    imageList: List<Int>
) {
    val context = LocalContext.current
    val pageOffset = (pagerState.currentPage - index) + pagerState.currentPageOffsetFraction
    val screenWidth = LocalConfiguration.current.screenWidthDp

    Card(
        shape = CircleShape,
        modifier = Modifier
            .height((screenWidth * 0.4f).dp)
            .aspectRatio(1f)
            .graphicsLayer {
                val scale = lerp(
                    start = 0.8f,
                    stop = 1f,
                    fraction = 1f - pageOffset.absoluteValue.coerceIn(0f, 1f)
                )
                scaleX = scale
                scaleY = scale
                alpha = lerp(
                    start = 0.5f,
                    stop = 1f,
                    fraction = 1f - pageOffset.absoluteValue.coerceIn(0f, 1f)
                )
            },
    ) {
        Image(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f),
            painter = painterResource(imageList[index]),
            contentDescription = context.getString(R.string.icon) + index,
            contentScale = ContentScale.Crop
        )
    }
}

@Preview(showBackground = true)
@Composable
fun CardContentPreview() {
    val imageList = UserIcon.entries.map { it.icon }
    val pagerState = rememberPagerState(initialPage = 0) {
        imageList.size
    }
    AppTheme {
        IconContent(0, pagerState, imageList)
    }
}

@Preview(showBackground = true)
@Composable
fun SettingsCarouselPreview() {
    val imageList = UserIcon.entries.map { it.icon }
    val pagerState = rememberPagerState(initialPage = 0) {
        imageList.size
    }
    AppTheme {
        IconCarousel(
            imageList = imageList,
            pagerState = pagerState
        )
    }
}