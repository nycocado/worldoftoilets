package com.worldoftoilets.app.ui.components

import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.worldoftoilets.app.R
import com.worldoftoilets.app.models.ToiletFilter

@Composable
fun FilterFloatingButton(
    currentFilter: ToiletFilter,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val filterCount = (if (currentFilter.access != null) 1 else 0) + currentFilter.extras.size

    FloatingActionButton(
        onClick = onClick,
        containerColor = MaterialTheme.colorScheme.surfaceContainerLow,
        contentColor = MaterialTheme.colorScheme.primary,
        modifier = modifier.size(56.dp)
    ) {
        BadgedBox(
            badge = {
                if (filterCount > 0) {
                    Badge {
                        Text(filterCount.toString())
                    }
                }
            }
        ) {
            Icon(
                imageVector = Icons.Filled.FilterList,
                contentDescription = stringResource(R.string.filter_title)
            )
        }
    }
}
