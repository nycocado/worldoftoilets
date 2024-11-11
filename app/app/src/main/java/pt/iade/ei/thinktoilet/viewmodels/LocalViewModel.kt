package pt.iade.ei.thinktoilet.viewmodels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.ToiletDetailed
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.tests.generateRandomToiletsDetailed
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.tests.generateUsers

class LocalViewModel : ViewModel() {
    private val _user = MutableLiveData<UserMain>()
    val user: LiveData<UserMain> get() = _user

    private val _users = MutableLiveData<HashMap<Int, User>>()
    val users: LiveData<HashMap<Int, User>> get() = _users

    private val _toiletsDetailed = MutableLiveData<HashMap<Int, ToiletDetailed>>()
    val toiletsDetailed: LiveData<HashMap<Int, ToiletDetailed>> get() = _toiletsDetailed

    private val _selectedToiletDetailedId = MutableLiveData<Int?>()
    val selectedToiletDetailedId: LiveData<Int?> get() = _selectedToiletDetailedId

    private val _fromOutside = MutableLiveData<Boolean>()
    val fromOutside: LiveData<Boolean> get() = _fromOutside

    init {
        _fromOutside.value = false
        _user.value = generateUserMain()
        _users.value = generateUsers(10)
        _toiletsDetailed.value = generateRandomToiletsDetailed(20)
    }

    fun getUser(): UserMain {
        return _user.value!!
    }

    fun getUserById(id: Int): User? {
        return _users.value?.get(id)
    }

    fun getToiletDetailedById(id: Int): ToiletDetailed? {
        return _toiletsDetailed.value?.get(id)
    }

    fun getToiletById(id: Int): Toilet? {
        return getToiletDetailedById(id)?.toilet
    }

    fun getToiletsDetailed(): List<ToiletDetailed> {
        return _toiletsDetailed.value?.values?.toList() ?: emptyList()
    }

    fun getSelectedToilet(): ToiletDetailed? {
        return _selectedToiletDetailedId.value?.let { getToiletDetailedById(it) }
    }

    fun setSelectedToiletDetailed(toiletDetailedId: Int) {
        _selectedToiletDetailedId.value = toiletDetailedId
    }

    fun clearSelectedToilet() {
        _selectedToiletDetailedId.value = null
    }

    fun setFromOutside(value: Boolean) {
        _fromOutside.value = value
    }

    fun getFromOutside(): Boolean {
        return _fromOutside.value!!
    }
}
