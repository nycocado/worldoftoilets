package pt.iade.ei.thinktoilet.ui.components


import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.PagerState
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.lerp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.tests.generateCarouselImage
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.ui.theme.AppTheme
import kotlin.math.absoluteValue


@Composable
fun SettingsCarousel(
    imageList: List<String>,
    pagerState: PagerState,
    user: UserMain
) {

    Column {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center,
        ) {
            Text(
                text = "Role para mudar",
                style = MaterialTheme.typography.titleSmall,
                color = MaterialTheme.colorScheme.secondary

            )
        }
        Row {
            HorizontalPager(
                state = pagerState,
                contentPadding = PaddingValues(
                    start = 120.dp,
                    end = 130.dp
                ) // Posicionamento das imagens
            ) { index ->
                CardContent(index, pagerState, imageList)
            }
        }

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 10.dp)
        ) {
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center,
            ) {
                Text(
                    text = user.user.name,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.SemiBold,


                    )
            }
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center,
            ) {
                Text(
                    text = user.email,
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.primaryContainer

                )
            }
        }

    }
}

@Composable
fun CardContent(index: Int, pagerState: PagerState, imageList: List<String>) {
    val pageOffset = (pagerState.currentPage - index) + pagerState.currentPageOffsetFraction

    Card(
        shape = RoundedCornerShape(10.dp),
        modifier = Modifier
            .width(250.dp)  //Basicamente  o Quadrado onde a imagem vai estar N é quadrado
            .height(200.dp)
            .padding(5.dp)
            .graphicsLayer {
                lerp(
                    start = 0.6f.dp, // imagem das laterais menores
                    stop = 1f.dp,    // imagem do meio maior
                    fraction = 1f - pageOffset.absoluteValue.coerceIn(0f, 1f)
                ).also { scale ->
                    scaleX = scale.value
                    scaleY = scale.value
                }
            },
    ) {
        AsyncImage(
            modifier = Modifier.fillMaxWidth(),
            model = ImageRequest.Builder(LocalContext.current).data(imageList[index])
                .crossfade(true).build(),
            contentDescription = "Image",
            contentScale = ContentScale.Crop
        )
    }
}


@Composable
@Preview(showBackground = true)
fun SettingsCarouselPreview() {
    val imageList = generateCarouselImage()
    val pagerState = rememberPagerState(initialPage = 0) {
        imageList.size
    }
    AppTheme {
        SettingsCarousel(
            imageList = imageList,
            pagerState = pagerState,
            user = generateUserMain()
        )
    }
}