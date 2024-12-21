package pt.iade.ei.thinktoilet.ui.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.ui.theme.AppTheme


/**
         * Função que representa um complemento de uma reclamação.
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
    id: Int,
    onClick: (Int) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(70.dp)
            .padding(vertical = 5.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Surface(
            onClick = { onClick(id) },
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,

            )
        }
    }
}


@Composable
@Preview(showBackground = true)
fun ReportComplementPreview() {
    AppTheme{
        ReportComplement(
            title = "Title",
            id = 1,
        ){
            println("Fui Clicado")
        }
    }
}