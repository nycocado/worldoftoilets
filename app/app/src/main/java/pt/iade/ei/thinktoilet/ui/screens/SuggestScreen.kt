package pt.iade.ei.thinktoilet.ui.screens

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
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
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.R
import pt.iade.ei.thinktoilet.ui.theme.AppTheme


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SuggestScreen() {
    val context = LocalContext.current
    val verticalPadding = 10.dp
    var toiletName by remember { mutableStateOf("") }
    var country by remember { mutableStateOf("") }
    var address by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("") }
    var postalCode by remember { mutableStateOf("") }

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
                SuggestionTextField(
                    value = toiletName,
                    onValueChange = { toiletName = it },
                    label = context.getString(R.string.toilet_name),
                    verticalPadding = verticalPadding
                )
            }
            item {
                SuggestionTextField(
                    value = country,
                    onValueChange = { country = it },
                    label = context.getString(R.string.toilet_country),
                    verticalPadding = verticalPadding
                )
            }
            item {
                SuggestionTextField(
                    value = address,
                    onValueChange = { address = it },
                    label = context.getString(R.string.toilet_address),
                    verticalPadding = verticalPadding
                )
            }
            item {
                SuggestionTextField(
                    value = city,
                    onValueChange = { city = it },
                    label = context.getString(R.string.toilet_city),
                    verticalPadding = verticalPadding
                )
            }
            item {
                SuggestionTextField(
                    value = postalCode,
                    onValueChange = { postalCode = it },
                    label = context.getString(R.string.toilet_postal_code),
                    verticalPadding = verticalPadding
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
fun SuggestionTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    verticalPadding: Dp
) {
    Row(
        modifier = Modifier.padding(vertical = verticalPadding)
    ) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            label = { Text(text = label) },
            keyboardOptions = KeyboardOptions.Default.copy(
                imeAction = ImeAction.Next,
                keyboardType = KeyboardType.Text
            ),
            modifier = Modifier.fillMaxWidth()
        )
    }
}


@Composable
@Preview(showBackground = true)
fun SuggestionToiletScreenPreview() {
    AppTheme {
        SuggestScreen()
    }
}