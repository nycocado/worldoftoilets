package com.worldoftoilets.app.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.DirectionsRun
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Flag
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonColors
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.Toilet
import com.worldoftoilets.app.models.enums.TypeAccess

@Composable
fun ToiletHeader(
    toilet: Toilet,
    onRouteClick: (() -> Unit)? = null,
    onReportClick: (() -> Unit)? = null,
    onBackClick: () -> Unit,
    maxLinesForName: Int? = null
) {
    val context = LocalContext.current

    Row(
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Top
    ) {
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = toilet.name,
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                maxLines = maxLinesForName ?: Int.MAX_VALUE,
                overflow = if (maxLinesForName != null) TextOverflow.Ellipsis else TextOverflow.Clip
            )
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Stars(
                    rating = toilet.getAverageRating().toFloat(), size = 18.dp
                )
                val accessEnum =
                    TypeAccess.entries.find { it.technicalValue == toilet.access.apiName }
                val accessText =
                    accessEnum?.let { context.getString(it.value) } ?: toilet.access.name

                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = context.getString(R.string.access_separator),
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 1
                    )
                    Text(
                        text = accessText,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 1
                    )
                }
            }
        }

        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            if (onRouteClick != null) {
                FilledIconButton(
                    onClick = onRouteClick,
                    modifier = Modifier.size(38.dp),
                    colors = IconButtonColors(
                        containerColor = MaterialTheme.colorScheme.surfaceContainerHigh,
                        contentColor = MaterialTheme.colorScheme.onSurface,
                        disabledContainerColor = MaterialTheme.colorScheme.surfaceContainerHigh.copy(
                            alpha = 0.5f
                        ),
                        disabledContentColor = MaterialTheme.colorScheme.onSurface.copy(
                            alpha = 0.5f
                        )
                    )
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Rounded.DirectionsRun,
                        contentDescription = stringResource(R.string.route_title)
                    )
                }
            }
            if (onReportClick != null) {
                FilledIconButton(
                    onClick = onReportClick,
                    modifier = Modifier.size(38.dp),
                    colors = IconButtonColors(
                        containerColor = MaterialTheme.colorScheme.surfaceContainerHigh,
                        contentColor = MaterialTheme.colorScheme.onSurface,
                        disabledContainerColor = MaterialTheme.colorScheme.surfaceContainerHigh.copy(
                            alpha = 0.5f
                        ),
                        disabledContentColor = MaterialTheme.colorScheme.onSurface.copy(
                            alpha = 0.5f
                        )
                    )
                ) {
                    Icon(
                        imageVector = Icons.Rounded.Flag,
                        contentDescription = context.getString(R.string.report)
                    )
                }
            }
            FilledIconButton(
                onClick = onBackClick,
                modifier = Modifier.size(38.dp),
                colors = IconButtonColors(
                    containerColor = MaterialTheme.colorScheme.surfaceContainerHigh,
                    contentColor = MaterialTheme.colorScheme.onSurface,
                    disabledContainerColor = MaterialTheme.colorScheme.surfaceContainerHigh.copy(
                        alpha = 0.5f
                    ),
                    disabledContentColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                )
            ) {
                Icon(
                    imageVector = Icons.Rounded.Close,
                    contentDescription = context.getString(R.string.back)
                )
            }
        }
    }
}