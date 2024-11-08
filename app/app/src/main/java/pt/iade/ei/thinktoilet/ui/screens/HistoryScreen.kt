package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController

@Composable
fun HistoryScreen(
    navController: NavController = rememberNavController(),
) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    )
    {
        Column {
            Text(
                text = "History",
                modifier = Modifier.align(Alignment.CenterHorizontally),
                fontSize = 100.sp
            )
        }
    }
}


@Preview(showBackground = true)
@Composable
fun HistoryPreview() {
    HistoryScreen()
}
