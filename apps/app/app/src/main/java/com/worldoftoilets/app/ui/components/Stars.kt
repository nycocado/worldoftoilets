package com.worldoftoilets.app.ui.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material.icons.rounded.StarBorder
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.worldoftoilets.app.ui.theme.AppTheme
import com.worldoftoilets.app.ui.util.NoRippleInteractionSource
import kotlin.math.round

@Composable
fun Stars(
    rating: Float,
    size: Dp = 24.dp,
    horizontalPadding: Dp = 0.dp,
    onClick: ((Int) -> Unit)? = null
) {
    Row {
        for (i in 1..5) {
            val icon = if (i <= (if (onClick != null) rating else round(rating))) Icons.Rounded.Star else Icons.Rounded.StarBorder
            
            if (onClick != null) {
                Surface(
                    modifier = Modifier
                        .size(size)
                        .padding(horizontal = horizontalPadding),
                    onClick = { onClick(i) },
                    interactionSource = NoRippleInteractionSource(),
                    color = androidx.compose.ui.graphics.Color.Transparent
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = "$i star",
                        modifier = Modifier.size(size),
                        tint = MaterialTheme.colorScheme.primary // Or Secondary/Gold depending on design
                    )
                }
            } else {
                Icon(
                    imageVector = icon,
                    contentDescription = "$i star",
                    modifier = Modifier.size(size),
                    tint = MaterialTheme.colorScheme.primary // Or Secondary/Gold depending on design
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun StarsPreview() {
    AppTheme {
        Stars(rating = 3.5f)
    }
}