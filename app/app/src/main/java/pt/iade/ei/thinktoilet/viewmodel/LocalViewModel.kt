package pt.iade.ei.thinktoilet.viewmodel

import android.location.Location
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.models.CommentItem
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.models.UserMain
import pt.iade.ei.thinktoilet.repositories.LocationRepository
import pt.iade.ei.thinktoilet.repositories.ToiletRepository
import pt.iade.ei.thinktoilet.repositories.UserRepository
import javax.inject.Inject

@HiltViewModel
class LocalViewModel @Inject constructor(
    private val toiletRepository: ToiletRepository,
    private val userRepository: UserRepository,
    private val locationRepository: LocationRepository
): ViewModel() {

    private val _toilets = MutableLiveData<List<Toilet>>(emptyList())
    val toilets: LiveData<List<Toilet>> get() = _toilets

    private val _userMain = MutableLiveData<UserMain>()
    val userMain: LiveData<UserMain> get() = _userMain

    private val _users = MutableLiveData<List<User>>(emptyList())
    val users: LiveData<List<User>> get() = _users

    private val _commentsToilet = MutableLiveData<List<CommentItem>>()
    val commentsToilet: LiveData<List<CommentItem>> get() = _commentsToilet

    private val _commentsUser = MutableLiveData<List<CommentItem>>()
    val commentsUser: LiveData<List<CommentItem>> get() = _commentsUser

    private val _location = MutableLiveData<Location>()
    val location: LiveData<Location> get() = _location

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> get() = _error

    init {
        _userMain.value = UserMain(
            user = User(
                id = 1,
                name = "Luan Ribeiro",
                iconId = "icon12",
                numComments = 11,
                points = 200
            ),
            email = "luan.ribeiro@gmail.com",
            password = "luan_pass",
        )
        loadLocation()
    }

    private fun loadLocation() {
        locationRepository.getCurrentLocation().observeForever {
            _location.value = it
            it?.let { location ->
                loadToiletsNearby(location.latitude, location.longitude)
            }
        }
    }

    private fun loadToiletsNearby(latitude: Double, longitude: Double) {
        viewModelScope.launch {
            try {
                val fetchedToilets = toiletRepository.getToiletsNearby(latitude, longitude)
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

    fun getToiletComments(toiletId: Int) {
        viewModelScope.launch {
            try {
                val fetchedComments = toiletRepository.getToiletComment(toiletId)
                val userIds = fetchedComments
                    .filter { comment -> _users.value?.none { user -> user.id == comment.userId } == true }
                    .map { it.userId }
                    .distinct()
                if (userIds.isNotEmpty()) {
                    val fetchedUsers = userRepository.getUsers(userIds)
                    _users.value = (_users.value.orEmpty() + fetchedUsers).distinctBy { it.id }
                }
                _commentsToilet.value = fetchedComments
            } catch (e: Exception) {
                _error.value = "Erro ao carregar comentários: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar comentários para toiletId=$toiletId", e)
            }
        }
    }

    fun getUserComments(userId: Int) {
        viewModelScope.launch {
            try {
                val fetchedComments = userRepository.getUserComments(userId)
                val toiletIds = fetchedComments
                    .filter { comment -> _toilets.value?.none { toilet -> toilet.id == comment.toiletId } == true }
                    .map { it.toiletId }
                    .distinct()
                if (toiletIds.isNotEmpty()) {
                    val fetchedToilets = toiletRepository.getToilets(toiletIds)
                    _toilets.value = (_toilets.value.orEmpty() + fetchedToilets).distinctBy { it.id }
                }
                _commentsUser.value = fetchedComments
            } catch (e: Exception) {
                _error.value = "Erro ao carregar comentários: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar comentários para userId=$userId", e)
            }
        }
    }

}