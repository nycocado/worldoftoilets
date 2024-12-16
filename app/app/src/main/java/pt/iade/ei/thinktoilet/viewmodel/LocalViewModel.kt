package pt.iade.ei.thinktoilet.viewmodel

import android.location.Location
import android.util.Log
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.models.ApiResponse
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.UiState
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.repositories.AuthRepository
import pt.iade.ei.thinktoilet.repositories.LocationRepository
import pt.iade.ei.thinktoilet.repositories.ToiletRepository
import pt.iade.ei.thinktoilet.repositories.UserPreferencesRepository
import pt.iade.ei.thinktoilet.repositories.UserRepository
import java.time.LocalDate
import javax.inject.Inject

@HiltViewModel
class LocalViewModel @Inject constructor(
    private val toiletRepository: ToiletRepository,
    private val userRepository: UserRepository,
    private val authRepository: AuthRepository,
    private val locationRepository: LocationRepository,
    private val userPreferencesRepository: UserPreferencesRepository
) : ViewModel() {
    private val _toiletsCache = MutableStateFlow<Map<Int, Toilet>>(emptyMap())
    val toiletsCache: StateFlow<Map<Int, Toilet>> get() = _toiletsCache

    private val _toiletsNearbyIds = MutableStateFlow<UiState<List<Int>>>(UiState.Loading)
    val toiletsNearbyIds: StateFlow<UiState<List<Int>>> get() = _toiletsNearbyIds

    private val _toiletsHistoryIds = MutableStateFlow<UiState<List<Int>>>(UiState.Loading)
    val toiletsHistoryIds: StateFlow<UiState<List<Int>>> get() = _toiletsHistoryIds

    val userMain: StateFlow<User?> = userPreferencesRepository.userStateFlow

    val isUserLoggedIn: StateFlow<Boolean> = userPreferencesRepository.isUserLoggedIn()

    private val _users = MutableStateFlow<Map<Int, User>>(emptyMap())
    val users: StateFlow<Map<Int, User>> get() = _users

    private val _commentsToilet = MutableStateFlow<List<Comment>>(emptyList())
    val commentsToilet: StateFlow<List<Comment>> get() = _commentsToilet

    private val _commentsUser = MutableStateFlow<List<Comment>>(emptyList())
    val commentsUser: StateFlow<List<Comment>> get() = _commentsUser

    private val _location = MutableStateFlow<Location>(Location(""))
    val location: StateFlow<Location> get() = _location

    private val _error = MutableStateFlow<String>("")
    val error: StateFlow<String> get() = _error

    private val _loginState = MutableStateFlow<Result<User>?>(null)
    val loginState: StateFlow<Result<User>?> get() = _loginState

    private val _registerState = MutableStateFlow<Result<ApiResponse>?>(null)
    val registerState: StateFlow<Result<ApiResponse>?> get() = _registerState

    private val _toiletNearbyLoaded = mutableStateOf(false)
    private val _toiletHistoryLoaded = mutableStateOf(false)

    fun loadLocation(onlyLocation: Boolean = false) {
        locationRepository.getCurrentLocation().observeForever {
            if (it != null) {
                _location.value = it
            }
            if(!onlyLocation) {
                it?.let { location ->
                    loadToiletsNearby(location.latitude, location.longitude)
                }
            }
        }
    }

    private fun loadToiletsNearby(latitude: Double, longitude: Double) {
        viewModelScope.launch {
            if (!_toiletNearbyLoaded.value)
                _toiletsNearbyIds.emit(UiState.Loading)
            try {
                val fetchedToilets = toiletRepository.getToiletsNearby(latitude, longitude)

                _toiletsCache.value = _toiletsCache.value.toMutableMap().apply {
                    fetchedToilets.forEach { toilet ->
                        toilet.id.let { id -> this[id] = toilet }
                    }
                }

                _toiletsNearbyIds.value = UiState.Success(fetchedToilets.map { it.id })
                _toiletNearbyLoaded.value = true
            } catch (e: Exception) {
                _toiletsNearbyIds.value =
                    UiState.Error("Erro ao carregar banheiros próximos: ${e.message}")
                Log.e("ToiletViewModel", "Erro ao carregar banheiros próximos", e)
            }
        }
    }

    fun loadToiletsHistory() {
        viewModelScope.launch {
            if (!_toiletHistoryLoaded.value)
                _toiletsHistoryIds.emit(UiState.Loading)
            try {
                val fetchedToilets = toiletRepository.getToiletsByUserId(userMain.value?.id!!)

                _toiletsCache.value = _toiletsCache.value.toMutableMap().apply {
                    fetchedToilets.forEach { toilet ->
                        toilet.id.let { id -> this[id] = toilet }
                    }
                }

                _toiletsHistoryIds.value = UiState.Success(fetchedToilets.map { it.id })
                _toiletHistoryLoaded.value = true
            } catch (e: Exception) {
                _toiletsHistoryIds.value =
                    UiState.Error("Erro ao carregar histórico de banheiros: ${e.message}")
                Log.e("ToiletViewModel", "Erro ao carregar histórico de banheiros", e)
            }
        }
    }

    private fun loadToilets() {
        viewModelScope.launch {
            try {
                val fetchedToilets = toiletRepository.getToilets()
                _toiletsCache.value = _toiletsCache.value.toMutableMap().apply {
                    fetchedToilets.forEach { toilet ->
                        toilet.id.let { id -> this[id] = toilet }
                    }
                }
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
                _users.value = _users.value.toMutableMap().apply {
                    this[userId] = fetchedUser
                }
            } catch (e: Exception) {
                _error.value = "Erro ao carregar usuário: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar usuário", e)
            }
        }
    }

    fun loadToiletComments(toiletId: Int) {
        viewModelScope.launch {
            try {
                val fetchedComments = toiletRepository.getToiletComment(toiletId)

                val userIds = fetchedComments
                    .filter { comment -> _users.value.none { user -> user.key == comment.userId } }
                    .map { it.userId }
                    .distinct()
                if (userIds.isNotEmpty()) {
                    val fetchedUsers = userRepository.getUsers(userIds)
                    _users.value = _users.value.toMutableMap().apply {
                        fetchedUsers.forEach { user ->
                            this[user.id!!] = user
                        }
                    }
                }
                _toiletsCache.value = _toiletsCache.value.toMutableMap().apply {
                    fetchedComments.forEach { comment ->
                        this[comment.toiletId]
                    }
                }
                _commentsToilet.value = fetchedComments
            } catch (e: Exception) {
                _error.value = "Erro ao carregar comentários: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar comentários para toiletId=$toiletId", e)
            }
        }
    }

    fun loadUserComments(userId: Int) {
        viewModelScope.launch {
            try {
                val fetchedComments = userRepository.getUserComments(userId)
                val toiletIds = fetchedComments
                    .filter { comment -> _toiletsCache.value.none { toilet -> toilet.value.id == comment.toiletId } }
                    .map { it.toiletId }
                    .distinct()
                if (toiletIds.isNotEmpty()) {
                    val fetchedToilets = toiletRepository.getToilets(toiletIds)
                    _toiletsCache.value = _toiletsCache.value.toMutableMap().apply {
                        fetchedToilets.forEach { toilet ->
                            toilet.id.let { id -> this[id] = toilet }
                        }
                    }
                }
                _toiletsCache.value = _toiletsCache.value.toMutableMap().apply {
                    fetchedComments.forEach { comment ->
                        this[comment.toiletId]
                    }
                }
                _commentsUser.value = fetchedComments
            } catch (e: Exception) {
                _error.value = "Erro ao carregar comentários: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar comentários para userId=$userId", e)
            }
        }
    }

    fun login(email: String, password: String) {
        viewModelScope.launch {
            try {
                val result = authRepository.login(email, password)
                _loginState.value = result
            } catch (e: Exception) {
                _error.value = "Erro ao fazer login: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao fazer login", e)
            }
        }
    }

    fun register(
        name: String,
        email: String,
        password: String,
        iconId: String?,
        birthDate: String?
    ) {
        viewModelScope.launch {
            try {
                val result = authRepository.register(name, email, password, iconId, birthDate)
                _registerState.value = result
            } catch (e: Exception) {
                _error.value = "Erro ao fazer registro: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao fazer registro", e)
            }
        }
    }

    fun clearLoginState() {
        _loginState.value = null
    }

    fun clearRegisterState() {
        _registerState.value = null
    }

    fun saveUser(user: User) {
        viewModelScope.launch {
            try {
                userPreferencesRepository.saveUser(user)
            } catch (e: Exception) {
                _error.value = "Erro ao salvar usuário: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao salvar usuário", e)
            }
        }
    }

    fun clearUser() {
        viewModelScope.launch {
            try {
                userPreferencesRepository.clearUser()
            } catch (e: Exception) {
                _error.value = "Erro ao limpar usuário: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao limpar usuário", e)
            }
        }
    }
}