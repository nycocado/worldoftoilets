package pt.iade.ei.thinktoilet.viewmodels

import androidx.lifecycle.ViewModel
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.tests.generateRandomToiletsWithComments

class ToiletViewModel: ViewModel() {
    val toilets: List<Toilet> = generateRandomToiletsWithComments(numToilets = 5)

    fun getToiletById(id: Int): Toilet? {
        return toilets.find { it.id == id }
    }
}