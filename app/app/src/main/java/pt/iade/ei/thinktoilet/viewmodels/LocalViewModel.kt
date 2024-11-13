package pt.iade.ei.thinktoilet.viewmodels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.tests.generateRandomToilets
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.tests.generateUsers

class LocalViewModel() : ViewModel() {
    private val _userMain = MutableLiveData<UserMain>()
    val userMain: LiveData<UserMain> get() = _userMain

    private val _users = MutableLiveData<List<User>>()
    val users: LiveData<List<User>> get() = _users

    private val _toilets = MutableLiveData<List<Toilet>>()
    val toilets: LiveData<List<Toilet>> get() = _toilets

    init {
        _userMain.value = generateUserMain()
        _users.value = generateUsers(10)
        _toilets.value = generateRandomToilets(20)
    }
}
