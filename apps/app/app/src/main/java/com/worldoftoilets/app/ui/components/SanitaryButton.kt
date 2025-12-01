package com.worldoftoilets.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.worldoftoilets.app.R
import com.worldoftoilets.app.ui.theme.AppTheme
import com.worldoftoilets.app.ui.theme.ElectricBlue
import com.worldoftoilets.app.ui.theme.FreshGreen

import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.contentDescription

@Composable
fun SanitaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isLoading: Boolean = false,
    enabled: Boolean = true
) {
    val context = LocalContext.current
    // Define the gradient brush
    val gradient = Brush.horizontalGradient(
        colors = listOf(ElectricBlue, FreshGreen)
    )

    Button(
        onClick = onClick,
        modifier = modifier.height(50.dp), // Standard height for touch targets
        enabled = enabled,
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.Transparent, // Transparent to show box background
            disabledContainerColor = Color.Transparent
        ),
        contentPadding = PaddingValues() // Reset padding to manage it inside Box
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    brush = if (enabled) gradient else Brush.linearGradient(
                        listOf(Color.LightGray, Color.Gray)
                    ),
                    shape = MaterialTheme.shapes.medium // Match button shape
                )
                .semantics { contentDescription = context.getString(R.string.content_description_loading_indicator) }, // Moved contentDescription here
            contentAlignment = Alignment.Center
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    color = Color.White,
                    strokeWidth = 3.dp,
                    // contentDescription removed from here
                )
            } else {
                Text(
                    text = text,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }
        }
    }
}

@Preview
@Composable
fun SanitaryButtonPreview() {
    AppTheme {
        SanitaryButton(
            text = "Login",
            onClick = {}
        )
    }
}
