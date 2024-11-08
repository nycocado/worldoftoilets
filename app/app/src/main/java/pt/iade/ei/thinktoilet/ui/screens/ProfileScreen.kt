package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import pt.iade.ei.thinktoilet.tests.generateUserMain
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import pt.iade.ei.thinktoilet.ui.components.Profile
import pt.iade.ei.thinktoilet.ui.components.ProfileStatus

@Composable
fun ProfileScreen(navController: NavController = rememberNavController()) {
    Box(
        modifier = Modifier.fillMaxSize()
    ) {
        Column {
            Row {
                Text(
                    text = "Perfil",
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp, 22.dp),
                    fontWeight = FontWeight.Bold,
                    fontSize = 22.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            Row {
                Profile(generateUserMain())
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
            ) {
                Button(onClick = {
                    println("Botão de editar perfil pressionado")
                }) {
                    Text(text = "Editar Perfil")
                }
            }
            Row {
                ProfileStatus(generateUserMain())
            }
        }
    }
}


@Preview(showBackground = true)
@Composable
fun ProfileScreenPreview() {
    ProfileScreen()
}
