package pt.iade.ei.thinktoilet.ui.screens


import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import pt.iade.ei.thinktoilet.ui.components.ReportComplement
import pt.iade.ei.thinktoilet.ui.theme.AppTheme


@Composable
fun ReportScreen(
    state: Boolean
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
    ) {
        LazyColumn {
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 5.dp),
                    horizontalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "Report",
                        style = MaterialTheme.typography.headlineSmall,
                        textAlign = TextAlign.Center,
                        fontWeight = FontWeight.Bold
                    )
                }
                Row(
                    modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center
                ) {
                    Text(
                        modifier = Modifier.padding(top = 40.dp, bottom = 20.dp),
                        text = if (state) {
                            "Porque estás a denunciar esta \ncasa de banho?"
                        } else {
                            "Porque estás a denunciar este comentário?"
                        },
                        style = MaterialTheme.typography.titleLarge,
                        textAlign = TextAlign.Center,
                    )
                }
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 25.dp),
                    horizontalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "A tua denúncia é anônima.",
                        style = MaterialTheme.typography.bodySmall,

                        )
                }
            }
            if (state) {

                item {
                    ReportComplement(
                        title = "Informações incorretas",
                        id = 1
                    ) {}
                    ReportComplement(
                        title = "Condições insalubres",
                        id = 2
                    ) {}
                    ReportComplement(
                        title = "Violação de privacidade",
                        id = 3
                    ) {}
                    ReportComplement(
                        title = "Manutenção necessária",
                        id = 4
                    ) {}
                    ReportComplement(
                        title = "Equipamento ou instalações danificadas",
                        id = 5
                    ) {}
                    ReportComplement(
                        title = "Outras",
                        id = 6
                    ) {}

                }
            } else {
                item {
                    ReportComplement(
                        title = "Pouco útil",
                        id = 3
                    ) {}
                    ReportComplement(
                        title = "Informação falsa",
                        id = 4
                    ) {}
                    ReportComplement(
                        title = "Conteúdo inapropriado",
                        id = 5
                    ) {}
                    ReportComplement(
                        title = "Ofensivo ou abusivo",
                        id = 6
                    ) {}
                    ReportComplement(
                        title = "Spam ou propaganda indesejada",
                        id = 7
                    ) {}
                    ReportComplement(
                        title = "Outros",
                        id = 8
                    ) {}

                }
            }
        }
    }
}


@Composable
@Preview(showBackground = true)
fun PreviewReportScreen(){
    AppTheme {
        ReportScreen(
            state = true
        )
    }

}