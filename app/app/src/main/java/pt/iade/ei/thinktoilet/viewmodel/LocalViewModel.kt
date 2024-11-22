package pt.iade.ei.thinktoilet.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.repositories.ToiletRepository
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.tests.generateUsers

class LocalViewModel: ViewModel() {
    private val toiletRepository = ToiletRepository()

    private val _toilets = MutableLiveData<List<Toilet>>(emptyList())
    val toilets: LiveData<List<Toilet>> get() = _toilets

    private val _userMain = MutableLiveData<UserMain>()
    val userMain: LiveData<UserMain> get() = _userMain

    private val _users = MutableLiveData<List<User>>()
    val users: LiveData<List<User>> get() = _users

    private val _commentsToilet = MutableLiveData<List<Comment>>()
    val commentsToilet: LiveData<List<Comment>> get() = _commentsToilet

    private val _commentsUser = MutableLiveData<List<Comment>>()
    val commentsUser: LiveData<List<Comment>> get() = _commentsUser

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> get() = _error

    init {
        _userMain.value = generateUserMain()
        _users.value = generateUsers(10)
        loadToilets()

    }

    private fun loadToiletsNearby(lat: Double, lon: Double) {
        viewModelScope.launch {
            try {
                val fetchedToilets = toiletRepository.getToiletsNearby(lat, lon)
                _toilets.value = fetchedToilets
            } catch (e: Exception) {
                _error.value = "Erro ao carregar banheiros próximos: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar banheiros próximos", e)
            }
        }
    }

    private fun loadToilets() {
        viewModelScope.launch {
            try {
                val fetchedToilets = toiletRepository.getToilets()
                _toilets.value = fetchedToilets
            } catch (e: Exception) {
                _error.value = "Erro ao carregar banheiros: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar banheiros", e)
            }
        }
    }

    fun getToiletComment(toiletId: Int) {
        viewModelScope.launch {
            try {
                val fetchedComments = toiletRepository.getToiletComment(toiletId)
                _commentsToilet.value = fetchedComments
            } catch (e: Exception) {
                _error.value = "Erro ao carregar comentários: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar comentários", e)
            }
        }
    }
}