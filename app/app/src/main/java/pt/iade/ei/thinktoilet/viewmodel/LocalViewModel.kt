package pt.iade.ei.thinktoilet.viewmodel

import android.location.Location
import android.util.Log
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.models.responses.ApiResponse
import pt.iade.ei.thinktoilet.models.Comment
import pt.iade.ei.thinktoilet.models.Reaction
import pt.iade.ei.thinktoilet.models.Toilet
import pt.iade.ei.thinktoilet.models.TypeReaction
import pt.iade.ei.thinktoilet.models.UiState
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.repositories.AuthRepository
import pt.iade.ei.thinktoilet.repositories.CommentRepository
import pt.iade.ei.thinktoilet.repositories.LocationRepository
import pt.iade.ei.thinktoilet.repositories.ToiletRepository
import pt.iade.ei.thinktoilet.repositories.UserPreferencesRepository
import pt.iade.ei.thinktoilet.repositories.UserRepository
import javax.inject.Inject

@HiltViewModel
class LocalViewModel @Inject constructor(
    private val toiletRepository: ToiletRepository,
    private val userRepository: UserRepository,
    private val commentRepository: CommentRepository,
    private val locationRepository: LocationRepository
) : ViewModel() {
    private val _toiletsCache = MutableStateFlow<Map<Int, Toilet>>(emptyMap())
    val toiletsCache: StateFlow<Map<Int, Toilet>> get() = _toiletsCache

    private val _toiletsNearbyIds = MutableStateFlow<UiState<List<Int>>>(UiState.Loading)
    val toiletsNearbyIds: StateFlow<UiState<List<Int>>> get() = _toiletsNearbyIds

    private val _toiletsHistoryIds = MutableStateFlow<UiState<List<Int>>>(UiState.Loading)
    val toiletsHistoryIds: StateFlow<UiState<List<Int>>> get() = _toiletsHistoryIds

    private val _users = MutableStateFlow<Map<Int, User>>(emptyMap())
    val users: StateFlow<Map<Int, User>> get() = _users

    private val _commentsToilet = MutableStateFlow<List<Comment>>(emptyList())
    val commentsToilet: StateFlow<List<Comment>> get() = _commentsToilet

    private val _commentsUser = MutableStateFlow<List<Comment>>(emptyList())
    val commentsUser: StateFlow<List<Comment>> get() = _commentsUser

    private val _reactions = MutableStateFlow<Map<Int, Reaction>>(emptyMap())
    val reactions: StateFlow<Map<Int, Reaction>> get() = _reactions

    private val _ratingState = MutableStateFlow<Result<Comment>?>(null)
    val ratingState: StateFlow<Result<Comment>?> get() = _ratingState

    private val _location = MutableStateFlow<Location>(Location(""))
    val location: StateFlow<Location> get() = _location

    private val _error = MutableStateFlow<String>("")
    val error: StateFlow<String> get() = _error

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

    fun loadToiletsHistory(userId: Int) {
        viewModelScope.launch {
            if (!_toiletHistoryLoaded.value)
                _toiletsHistoryIds.emit(UiState.Loading)
            try {
                val fetchedToilets = toiletRepository.getToiletsByUserId(userId)

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

    fun loadToiletComments(toiletId: Int, userId: Int) {
        viewModelScope.launch {
            try {
                val fetchedComments = commentRepository.getCommentsByToiletId(toiletId)

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
                if(fetchedComments.isNotEmpty()) {
                    val commentIds = fetchedComments.map { it.id!! }
                    loadReactions(userId, commentIds)
                }
            } catch (e: Exception) {
                _error.value = "Erro ao carregar comentários: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar comentários para toiletId=$toiletId", e)
            }
        }
    }

    fun loadUserComments(userId: Int) {
        viewModelScope.launch {
            try {
                val fetchedComments = commentRepository.getCommentsByUserId(userId)
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

    private fun loadReactions(userId: Int, commentIds: List<Int>) {
        viewModelScope.launch {
            try {
                val fetchedReactions = commentRepository.getReactionsByUserId(userId, commentIds)
                _reactions.value = _reactions.value.toMutableMap().apply {
                    for (id in commentIds) {
                        this[id] = fetchedReactions.find { it.commentId == id } ?: Reaction(id, TypeReaction.NONE)
                    }
                }
            } catch (e: Exception) {
                _error.value = "Erro ao carregar reações: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar reações para userId=$userId", e)
            }
        }
    }

    fun updateReaction(commentId: Int, typeReaction: TypeReaction, userId: Int) {
        viewModelScope.launch {
            try {
                val initialReaction = _reactions.value[commentId]
                val reaction = Reaction(commentId, typeReaction)
                _reactions.value = _reactions.value.toMutableMap().apply {
                    this[commentId] = reaction
                }
                _commentsToilet.value = _commentsToilet.value.toMutableList().apply {
                    val comment = this.find { it.id == commentId }
                    if (comment != null) {
                        when (typeReaction) {
                            TypeReaction.LIKE -> {
                                comment.like++
                                if (initialReaction?.typeReaction == TypeReaction.DISLIKE) {
                                    comment.dislike--
                                }
                                commentRepository.postReaction(commentId, userId, typeReaction.value)
                            }
                            TypeReaction.DISLIKE -> {
                                comment.dislike++
                                if (initialReaction?.typeReaction == TypeReaction.LIKE) {
                                    comment.like--
                                }
                                commentRepository.postReaction(commentId, userId, typeReaction.value)
                            }
                            TypeReaction.NONE -> {
                                if (initialReaction?.typeReaction == TypeReaction.LIKE) {
                                    comment.like--
                                } else if (initialReaction?.typeReaction == TypeReaction.DISLIKE) {
                                    comment.dislike--
                                }
                                commentRepository.deleteReaction(commentId, userId)
                            }
                        }
                    }
                }
            } catch (e: Exception) {
                _error.value = "Erro ao atualizar reações: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao atualizar reações para commentId=$commentId", e)
            }
        }
    }

    fun requestComment(
        toiletId: Int,
        userId: Int,
        text: String,
        ratingClean: Int,
        ratingPaper: Boolean,
        ratingStructure: Int,
        ratingAccessibility: Int
    ) {
        viewModelScope.launch {
            try {
                val result = commentRepository.postComment(
                    toiletId,
                    userId,
                    text,
                    ratingClean,
                    ratingPaper,
                    ratingStructure,
                    ratingAccessibility
                )
                _ratingState.value = result
            } catch (e: Exception) {
                _error.value = "Erro ao fazer comentário: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao fazer comentário", e)
            }
        }
    }

    fun clearRatingState() {
        _ratingState.value = null
    }
}