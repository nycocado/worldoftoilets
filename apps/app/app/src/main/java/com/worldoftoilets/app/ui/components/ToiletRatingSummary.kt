package com.worldoftoilets.app.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.Toilet

@Composable
fun ToiletRatingSummary(
    toilet: Toilet
) {
    val context = LocalContext.current

    Row(
        modifier = Modifier.padding(horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "%.1f".format(toilet.getAverageRating()),
                style = MaterialTheme.typography.displayLarge,
                fontWeight = FontWeight.Bold
            )
            Stars(
                rating = toilet.getAverageRating().toFloat(), size = 20.dp
            )
        }
        Column(
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            ProgressBar(
                progress = toilet.rating.avgClean.toFloat(),
                text = String.format(
                    "%.1f",
                    toilet.rating.avgClean
                ) + " " + context.getString(R.string.clean)
            )
            ProgressBar(
                progress = toilet.rating.avgStructure.toFloat(),
                text = String.format(
                    "%.1f",
                    toilet.rating.avgStructure
                ) + " " + context.getString(R.string.structure)
            )
            ProgressBar(
                progress = toilet.rating.avgAccessibility.toFloat(),
                text = String.format(
                    "%.1f",
                    toilet.rating.avgAccessibility
                ) + " " + context.getString(R.string.accessibility)
            )
            ProgressBar(
                progress = (toilet.rating.paperAvailability * 100).toFloat(),
                text = String.format(
                    "%.0f",
                    toilet.rating.paperAvailability * 100
                ) + "% " + context.getString(R.string.paper),
                maxValue = 100f
            )
        }
    }
}