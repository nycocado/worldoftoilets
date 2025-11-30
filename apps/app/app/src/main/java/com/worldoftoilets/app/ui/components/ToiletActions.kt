package com.worldoftoilets.app.ui.components

import android.content.Intent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.LocationOn
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.core.net.toUri
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.Toilet

@Composable
fun ToiletActions(
    toilet: Toilet,
    onRateClick: () -> Unit
) {
    val context = LocalContext.current

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Button(
            modifier = Modifier.weight(1f),
            onClick = {
                val intent = Intent(
                    Intent.ACTION_VIEW,
                    toilet.getMapsUrl().toUri()
                ).apply {
                    putExtra(
                        Intent.EXTRA_REFERRER,
                        context.getString(R.string.maps_uri).toUri()
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
            Icon(
                imageVector = Icons.Rounded.LocationOn,
                contentDescription = null,
                modifier = Modifier
                    .size(18.dp)
                    .padding(end = 4.dp)
            )
            Text(
                text = context.getString(R.string.go_to_maps),
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold
            )
        }

        Button(
            modifier = Modifier.weight(1f),
            onClick = onRateClick,
            colors = ButtonColors(
                containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                contentColor = MaterialTheme.colorScheme.onTertiaryContainer,
                disabledContainerColor = MaterialTheme.colorScheme.tertiaryContainer.copy(
                    alpha = 0.5f
                ),
                disabledContentColor = MaterialTheme.colorScheme.onTertiaryContainer.copy(
                    alpha = 0.5f
                )
            )
        ) {
            Icon(
                imageVector = Icons.Rounded.Star,
                contentDescription = null,
                modifier = Modifier
                    .size(18.dp)
                    .padding(end = 4.dp),
                tint = MaterialTheme.colorScheme.onTertiaryContainer
            )
            Text(
                text = context.getString(R.string.rate),
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold,
            )
        }
    }
}