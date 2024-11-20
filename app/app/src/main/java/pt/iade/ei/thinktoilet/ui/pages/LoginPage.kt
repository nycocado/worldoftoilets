package pt.iade.ei.thinktoilet.ui.pages

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.ui.theme.AppTheme


@Composable
fun LoginPage() {
    var UserName by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 20.dp),
            horizontalArrangement = Arrangement.Center
        ) {
            Text(
                text = "Login",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
        }
        Row(
            modifier = Modifier
                .padding(50.dp)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.Center
        ) {
            Image(
                modifier = Modifier
                    .size(200.dp),
                painter = painterResource(R.drawable.logo),
                contentDescription = "Logo Icon"
            )
        }
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center
        ) {

            OutlinedTextField(
                value = UserName,
                onValueChange = {
                    UserName = it
                },
                label = { Text("Nome de Usuário ou Email") }
            )
        }
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 10.dp),
            horizontalArrangement = Arrangement.Center

        ) {
            OutlinedTextField(
                value = password,
                onValueChange = {
                    password = it
                },
                label = { Text("Palavra-passe") }
            )
        }
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 10.dp),
            horizontalArrangement = Arrangement.Center

        ) {
            Button(
                onClick = { /*TODO*/ },
                modifier = Modifier.padding(top = 10.dp),
                colors = ButtonColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    contentColor = MaterialTheme.colorScheme.onPrimaryContainer,
                    disabledContainerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f),
                    disabledContentColor = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.5f)
                )
            ) {
                Text(
                    text = "Iniciar Sessão",
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.SemiBold
                )
            }

        }
        Row(
            modifier = Modifier
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.Center
        ) {
            Surface(
                onClick = { },
            ) {
                Text(
                    text = "Esqueces-te da palavra-passe?",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Bold
                )
            }
        }
        Row(
            modifier = Modifier
                .padding(top = 60.dp)
                .fillMaxWidth()
                .padding(top = 10.dp),
            horizontalArrangement = Arrangement.Center

        ) {
            Button(
                onClick = { /*TODO*/ },
                colors = ButtonColors(
                    containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                    contentColor = MaterialTheme.colorScheme.onTertiaryContainer,
                    disabledContainerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f),
                    disabledContentColor = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.5f)
                )
            ) {
                Text(
                    text = "Criar Conta",
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.SemiBold
                )
            }

        }

    }
}


@Composable
@Preview(showBackground = true)
fun DefaultPreview() {
    AppTheme {
        LoginPage()
    }
}