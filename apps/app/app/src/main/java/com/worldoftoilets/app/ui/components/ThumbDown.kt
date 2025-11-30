package com.worldoftoilets.app.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.material3.Icon
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ThumbDown
import androidx.compose.material.icons.rounded.ThumbDown
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.worldoftoilets.app.ui.theme.AppTheme
import com.worldoftoilets.app.ui.util.NoRippleInteractionSource
import com.worldoftoilets.app.R

@Composable
fun ThumbDown(
    count: Int = 0,
    size: Dp = 24.dp,
    isPressed: Boolean = false,
    onClick: (Boolean) -> Unit = {},
) {
    val context = LocalContext.current
    val contentColor = if (isPressed) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurfaceVariant

    Surface(
        onClick = { onClick(isPressed) },
        interactionSource = NoRippleInteractionSource(),
        color = Color.Transparent
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Icon(
                imageVector = if (isPressed) Icons.Rounded.ThumbDown else Icons.Outlined.ThumbDown,
                contentDescription = context.getString(R.string.content_description_dislike_button),
                modifier = Modifier.size(size),
                tint = contentColor
            )
            Text(
                text = count.toString(),
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.Medium,
                color = contentColor
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun ThumbDownPreview() {
    AppTheme {
        ThumbDown()
    }
}