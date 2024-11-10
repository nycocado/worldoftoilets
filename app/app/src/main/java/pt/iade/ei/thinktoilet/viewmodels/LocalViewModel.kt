package pt.iade.ei.thinktoilet.viewmodels

import androidx.lifecycle.ViewModel
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.tests.generateRandomToiletsWithComments
import pt.iade.ei.thinktoilet.tests.generateUserMain

class LocalViewModel: ViewModel() {
    val user: UserMain = generateUserMain()
    val toilets: List<Toilet> = generateRandomToiletsWithComments(numToilets = 5)

    fun getToiletById(id: Int): Toilet? {
        return toilets.find { it.id == id }
    }
}