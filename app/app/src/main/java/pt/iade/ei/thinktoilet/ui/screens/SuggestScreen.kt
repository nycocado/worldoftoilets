package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.ui.components.NextTextField
import pt.iade.ei.thinktoilet.ui.theme.AppTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SuggestScreen() {
    val context = LocalContext.current
    val verticalPadding = 10.dp
    var name by remember { mutableStateOf("") }
    var country by remember { mutableStateOf("") }
    var address by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("") }
    var postalCode by remember { mutableStateOf("") }
    var nameSupportText by remember { mutableStateOf("") }
    var countrySupportText by remember { mutableStateOf("") }
    var addressSupportText by remember { mutableStateOf("") }
    var citySupportText by remember { mutableStateOf("") }
    var postalCodeSupportText by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = context.getString(R.string.suggest),
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 35.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                NextTextField(
                    value = name,
                    label = context.getString(R.string.toilet_name),
                    supportText = nameSupportText,
                    onValueChange = { name = it },
                )
                NextTextField(
                    value = country,
                    label = context.getString(R.string.toilet_country),
                    supportText = countrySupportText,
                    onValueChange = { country = it },
                )
                NextTextField(
                    value = address,
                    label = context.getString(R.string.toilet_address),
                    supportText = addressSupportText,
                    onValueChange = { address = it },
                )
                NextTextField(
                    value = city,
                    label = context.getString(R.string.toilet_city),
                    supportText = citySupportText,
                    onValueChange = { city = it },
                )
                NextTextField(
                    value = postalCode,
                    label = context.getString(R.string.toilet_postal_code),
                    supportText = postalCodeSupportText,
                    onValueChange = { postalCode = it },
                )
            }

            item {
                Row(
                    modifier = Modifier.padding(vertical = verticalPadding*4)
                ){
                    Button(
                        onClick = { /* Handle submit */ },
                        modifier = Modifier.padding(horizontal = verticalPadding * 2),
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
                        Text(
                            text = context.getString(R.string.suggest_toilet),
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }
    }
}

@Composable
@Preview(showBackground = true)
fun SuggestionToiletScreenPreview() {
    AppTheme {
        SuggestScreen()
    }
}