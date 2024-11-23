package pt.iade.ei.thinktoilet.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.models.CommentItem
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.repositories.ToiletRepository
import pt.iade.ei.thinktoilet.repositories.UserRepository
import pt.iade.ei.thinktoilet.tests.generateUserMain
import pt.iade.ei.thinktoilet.tests.generateUsers

class LocalViewModel: ViewModel() {
    private val toiletRepository = ToiletRepository()
    private val userRepository = UserRepository()

    private val _toilets = MutableLiveData<List<Toilet>>(emptyList())
    val toilets: LiveData<List<Toilet>> get() = _toilets

    private val _userMain = MutableLiveData<UserMain>()
    val userMain: LiveData<UserMain> get() = _userMain

    private val _users = MutableLiveData<List<User>>()
    val users: LiveData<List<User>> get() = _users

    private val _commentsToilet = MutableLiveData<List<CommentItem>>()
    val commentsToilet: LiveData<List<CommentItem>> get() = _commentsToilet

    private val _commentsUser = MutableLiveData<List<CommentItem>>()
    val commentsUser: LiveData<List<CommentItem>> get() = _commentsUser

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

    private fun loadUser(userId: Int) {
        viewModelScope.launch {
            try {
                val fetchedUser = userRepository.getUserById(userId)
                _users.value = _users.value?.plus(fetchedUser)
            } catch (e: Exception) {
                _error.value = "Erro ao carregar usuário: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar usuário", e)
            }
        }
    }

    fun getToiletComment(toiletId: Int) {
        viewModelScope.launch {
            try {
                val fetchedComments = toiletRepository.getToiletComment(toiletId)
                fetchedComments.forEach {
                    _users.value?.find { user -> user.id == it.userId } ?: loadUser(it.userId)
                }
                _commentsToilet.value = fetchedComments
            } catch (e: Exception) {
                _error.value = "Erro ao carregar comentários: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar comentários", e)
            }
        }
    }
}