package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.ui.theme.AppTheme


         /**
         * Função que representa um complemento de uma reclamação.
         *
         * @param title O título do complemento. Este título será exibido em Bold.
         * @param value O valor atual do TextField quando ativo.
         * @param onValueChange Um `mutableStateOf()` que retornará os valores do TextField, permitindo acompanhar as alterações no seu conteúdo.
         *
         * Esta função permite ao usuário interagir com um texto e, ao clicar nele, uma interface aparecerá para adicionar um complemento ao texto.
         *
         * Exemplo de uso:
         * ```
         * ReportComplement(
         *     title = "Outros", // Título
         *     value = currentValue, // Valor atual do TextField atualmente vazio ""
         *     onValueChange = { newValue -> /* remember { mutableStateOf("") } */ }
         * )
         * ```
         */
@Composable
fun ReportComplement(
    title: String,
    value: String,
    onValueChange: (String) -> Unit,
) {

    var isToggled by remember { mutableStateOf(false) }

    Row{
        Column {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
                    .padding(vertical = 5.dp),
                    verticalAlignment = Alignment.CenterVertically


            ) {
                Surface(
                    modifier = Modifier.clickable {
                        isToggled = !isToggled
                    },
                ){
                    Text(
                        text = title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold

                    )
                }
            }
            if (isToggled){
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 5.dp),
                    horizontalArrangement = Arrangement.Center
                ) {
                    TextField(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(
                                horizontal = 15.dp,
                                vertical = 5.dp
                            ),
                        value = value,
                        onValueChange = onValueChange,
                    )
                }
            }
        }
    }
}


@Composable
@Preview(showBackground = true)
fun ReportComplementPreview() {
    val text = remember { mutableStateOf("") }
    AppTheme{
        ReportComplement(
            title = "Title",
            value = text.value,
            onValueChange = { text.value = it }
        )
    }
}