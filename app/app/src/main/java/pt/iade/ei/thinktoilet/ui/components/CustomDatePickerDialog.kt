package pt.iade.ei.thinktoilet.ui.components

import android.annotation.SuppressLint
import androidx.compose.material3.Button
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.SelectableDates
import androidx.compose.material3.Text
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import pt.iade.ei.thinktoilet.ui.theme.AppTheme
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.util.Date

/**
 * Exibe um diálogo de seleção de data personalizado.
 *
 * @param onDateSelected Callback que é chamado quando a data é selecionada.
 * @param onDismiss Callback que é chamado quando o diálogo é fechado.
 */
@ExperimentalMaterial3Api
@Composable
fun CustomDatePickerDialog(
    onDateSelected: (String) -> Unit = { },
    onDismiss: () -> Unit = { }
) {
    val datePickerState = rememberDatePickerState(
        selectableDates = object : SelectableDates {
            override fun isSelectableDate(utcTimeMillis: Long): Boolean {
                return utcTimeMillis <= System.currentTimeMillis()
            }
        },
        initialSelectedDateMillis = convertDateToMillis("01/01/2000"),
        yearRange = 1900..LocalDate.now().year
    )

    val selectedDate = datePickerState.selectedDateMillis?.let {
        convertMillisToDate(it)
    } ?: ""

    DatePickerDialog(
        onDismissRequest = { onDismiss() },
        confirmButton = {
            Button(
                onClick = {
                    onDateSelected(selectedDate)
                    onDismiss()
                }
            ) {
                Text(text = "OK")
            }
        },
        dismissButton = {
            Button(
                onClick = {
                    onDismiss()
                }
            ) {
                Text(text = "Cancel")
            }
        }
    ) {
        DatePicker(
            state = datePickerState
        )
    }
}

@SuppressLint("SimpleDateFormat")
private fun convertMillisToDate(millis: Long): String {
    val formatter = SimpleDateFormat("dd/MM/yyyy")
    return formatter.format(Date(millis))
}

@SuppressLint("SimpleDateFormat")
private fun convertDateToMillis(date: String): Long {
    val formatter = SimpleDateFormat("dd/MM/yyyy")
    return formatter.parse(date)?.time ?: 0
}

@OptIn(ExperimentalMaterial3Api::class)
@Preview(showBackground = true)
@Composable
private fun CustomDatePickerDialogPreview() {
    AppTheme {
        CustomDatePickerDialog()
    }
}