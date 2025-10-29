package com.worldoftoilets.app.viewmodel

import android.location.Location
import android.util.Log
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.worldoftoilets.app.models.Comment
import com.worldoftoilets.app.models.Page
import com.worldoftoilets.app.models.Reaction
import com.worldoftoilets.app.models.SearchToilet
import com.worldoftoilets.app.models.Toilet
import com.worldoftoilets.app.models.UiState
import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.models.enums.TypeReaction
import com.worldoftoilets.app.models.enums.TypeReport
import com.worldoftoilets.app.models.responses.ApiResponse
import com.worldoftoilets.app.models.responses.PageResponse
import com.worldoftoilets.app.repositories.CommentRepository
import com.worldoftoilets.app.repositories.LocationRepository
import com.worldoftoilets.app.repositories.ToiletRepository
import com.worldoftoilets.app.repositories.UserRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
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

    private val _toiletsNearbyIds = MutableStateFlow<UiState<PageResponse<Int>>>(UiState.Loading)
    val toiletsNearbyIds: StateFlow<UiState<PageResponse<Int>>> get() = _toiletsNearbyIds

    private val _toiletsHistoryIds = MutableStateFlow<UiState<PageResponse<Int>>>(UiState.Loading)
    val toiletsHistoryIds: StateFlow<UiState<PageResponse<Int>>> get() = _toiletsHistoryIds

    private val _toiletsBoundingBoxIds = MutableStateFlow<List<Int>>(emptyList())
    val toiletsBoundingBoxIds: StateFlow<List<Int>> get() = _toiletsBoundingBoxIds

    private val _toiletsSearch = MutableStateFlow<List<SearchToilet>>(emptyList())
    val toiletsSearch: StateFlow<List<SearchToilet>> get() = _toiletsSearch

    private val _toiletSearchSelected = MutableStateFlow<Result<Toilet>?>(null)
    val toiletSearchSelected: StateFlow<Result<Toilet>?> get() = _toiletSearchSelected

    private val _users = MutableStateFlow<Map<Int, User>>(emptyMap())
    val users: StateFlow<Map<Int, User>> get() = _users

    private val _commentsToilet = MutableStateFlow<List<Comment>>(emptyList())
    val commentsToilet: StateFlow<List<Comment>> get() = _commentsToilet

    private val _isLoadingCommentsToilet = MutableStateFlow(false)
    val isLoadingCommentsToilet get() = _isLoadingCommentsToilet

    private val _commentsUser = MutableStateFlow<List<Comment>>(emptyList())
    val commentsUser: StateFlow<List<Comment>> get() = _commentsUser

    private val _isLoadingCommentsUser = MutableStateFlow(false)
    val isLoadingCommentsUser get() = _isLoadingCommentsUser

    private val _reactions = MutableStateFlow<Map<Int, Reaction>>(emptyMap())
    val reactions: StateFlow<Map<Int, Reaction>> get() = _reactions

    private val _ratingState = MutableStateFlow<Result<Comment>?>(null)
    val ratingState: StateFlow<Result<Comment>?> get() = _ratingState

    private val _reportState = MutableStateFlow<Result<ApiResponse>?>(null)
    val reportState: StateFlow<Result<ApiResponse>?> get() = _reportState

    private val _location = MutableStateFlow(Location(""))
    val location: StateFlow<Location> get() = _location

    private val _error = MutableStateFlow("")
    val error: StateFlow<String> get() = _error

    private val _toiletNearbyLoaded = mutableStateOf(false)
    private val _toiletHistoryLoaded = mutableStateOf(false)

    fun loadLocation(
        onlyLocation: Boolean = false,
        userId: Int? = null
    ) {
        locationRepository.getCurrentLocation().observeForever {
            if (it != null) {
                _location.value = it
            }
            if (!onlyLocation) {
                it?.let { location ->
                    loadToiletsNearby(location.latitude, location.longitude, userId)
                }
            }
        }
    }

    private fun loadToiletsNearby(
        latitude: Double,
        longitude: Double,
        userId: Int? = null
    ) {
        viewModelScope.launch {
            if (!_toiletNearbyLoaded.value)
                _toiletsNearbyIds.emit(UiState.Loading)
            try {
                val page = Page(0, 5, false)
                val fetchedToilets = toiletRepository.getToiletsNearby(
                    latitude,
                    longitude,
                    userId,
                    true,
                    page.number,
                    page.size
                )

                _toiletsCache.value = _toiletsCache.value.toMutableMap().apply {
                    fetchedToilets.forEach { toilet ->
                        toilet.id.let { id -> this[id] = toilet }
                    }
                }

                _toiletsNearbyIds.value = UiState.Success(
                    PageResponse(
                        fetchedToilets.map { it.id },
                        Page(
                            page.number,
                            page.size,
                            fetchedToilets.size < page.size
                        )
                    )
                )
                _toiletNearbyLoaded.value = true
            } catch (e: Exception) {
                _toiletsNearbyIds.value =
                    UiState.Error("Erro ao carregar banheiros próximos: ${e.message}")
                Log.e("ToiletViewModel", "Erro ao carregar banheiros próximos", e)
                _toiletNearbyLoaded.value = false
            }
        }
    }

    fun loadMoreToiletsNearby(
        latitude: Double,
        longitude: Double,
        userId: Int? = null,
        pageResponse: PageResponse<Int>
    ) {
        viewModelScope.launch {
            try {
                val fetchedToilets =
                    toiletRepository.getToiletsNearby(
                        latitude,
                        longitude,
                        userId,
                        true,
                        pageResponse.page.number + 1,
                        pageResponse.page.size
                    )

                _toiletsCache.value = _toiletsCache.value.toMutableMap().apply {
                    fetchedToilets.forEach { toilet ->
                        toilet.id.let { id -> this[id] = toilet }
                    }
                }

                _toiletsNearbyIds.value = UiState.Success(
                    PageResponse(
                        pageResponse.content + fetchedToilets.map { it.id },
                        Page(
                            pageResponse.page.number + 1,
                            pageResponse.page.size,
                            fetchedToilets.size < pageResponse.page.size
                        )
                    )
                )
            } catch (e: Exception) {
                _toiletsNearbyIds.value =
                    UiState.Error("Erro ao carregar mais banheiros próximos: ${e.message}")
                Log.e("ToiletViewModel", "Erro ao carregar mais banheiros próximos", e)
            }
        }
    }

    fun loadToiletsHistory(userId: Int) {
        viewModelScope.launch {
            if (!_toiletHistoryLoaded.value)
                _toiletsHistoryIds.emit(UiState.Loading)
            try {
                val page = Page(0, 10, false)
                val fetchedToilets =
                    toiletRepository.getToiletsByUserId(userId, true, page.number, page.size)

                _toiletsCache.value = _toiletsCache.value.toMutableMap().apply {
                    fetchedToilets.forEach { toilet ->
                        toilet.id.let { id -> this[id] = toilet }
                    }
                }

                _toiletsHistoryIds.value = UiState.Success(
                    PageResponse(
                        fetchedToilets.map { it.id },
                        Page(
                            page.number,
                            page.size,
                            fetchedToilets.size < page.size
                        )
                    )
                )
                _toiletHistoryLoaded.value = true
            } catch (e: Exception) {
                _toiletsHistoryIds.value =
                    UiState.Error("Erro ao carregar histórico de banheiros: ${e.message}")
                Log.e("ToiletViewModel", "Erro ao carregar histórico de banheiros", e)
                _toiletHistoryLoaded.value = false
            }
        }
    }

    fun loadMoreToiletsHistory(
        userId: Int,
        pageResponse: PageResponse<Int>
    ) {
        viewModelScope.launch {
            try {
                val fetchedToilets =
                    toiletRepository.getToiletsByUserId(
                        userId,
                        true,
                        pageResponse.page.number + 1,
                        pageResponse.page.size
                    )

                _toiletsCache.value = _toiletsCache.value.toMutableMap().apply {
                    fetchedToilets.forEach { toilet ->
                        toilet.id.let { id -> this[id] = toilet }
                    }
                }

                _toiletsHistoryIds.value = UiState.Success(
                    PageResponse(
                        pageResponse.content + fetchedToilets.map { it.id },
                        Page(
                            pageResponse.page.number + 1,
                            pageResponse.page.size,
                            fetchedToilets.size < pageResponse.page.size
                        )
                    )
                )
            } catch (e: Exception) {
                _toiletsHistoryIds.value =
                    UiState.Error("Erro ao carregar mais histórico de banheiros: ${e.message}")
                Log.e("ToiletViewModel", "Erro ao carregar mais histórico de banheiros", e)
            }
        }
    }

    fun loadToiletComments(
        toiletId: Int,
        userId: Int
    ) {
        _isLoadingCommentsToilet.value = true
        viewModelScope.launch {
            try {
                val fetchedComments = commentRepository.getCommentsByToiletId(toiletId, userId)

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
                if (fetchedComments.isNotEmpty()) {
                    val commentIds = fetchedComments.map { it.id }
                    loadReactions(userId, commentIds)
                }
                _isLoadingCommentsToilet.value = false
            } catch (e: Exception) {
                _error.value = "Erro ao carregar comentários: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar comentários para toiletId=$toiletId", e)
            }
        }
    }


    fun loadUserComments(userId: Int) {
        _isLoadingCommentsUser.value = true
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
                _isLoadingCommentsUser.value = false
            } catch (e: Exception) {
                _error.value = "Erro ao carregar comentários: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar comentários para userId=$userId", e)
            }
        }
    }

    fun loadToiletsSearch(query: String) {
        viewModelScope.launch {
            try {
                val fetchedToilets = toiletRepository.searchToilets(query)
                _toiletsSearch.value = fetchedToilets
            } catch (e: Exception) {
                _error.value = "Erro ao carregar banheiros: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar banheiros", e)
            }
        }
    }

    fun loadToiletSearchSelected(toiletId: Int) {
        viewModelScope.launch {
            try {
                val result = toiletRepository.getToiletById(toiletId)
                result.isSuccess.let {
                    _toiletsCache.value = _toiletsCache.value.toMutableMap().apply {
                        result.getOrNull()?.let { toilet ->
                            this[toilet.id] = toilet
                        }
                    }
                }
                _toiletSearchSelected.value = result
            } catch (e: Exception) {
                _error.value = "Erro ao carregar banheiro: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar banheiro", e)
            }
        }
    }

    fun loadToiletsBoundingBox(
        minLat: Double,
        maxLat: Double,
        minLon: Double,
        maxLon: Double
    ) {
        viewModelScope.launch {
            try {
                val fetchedToilets = toiletRepository.getToiletsInBoundingBox(
                    minLat,
                    maxLat,
                    minLon,
                    maxLon
                )

                _toiletsCache.value = _toiletsCache.value.toMutableMap().apply {
                    fetchedToilets.forEach { toilet ->
                        toilet.id.let { id -> this[id] = toilet }
                    }
                }

                _toiletsBoundingBoxIds.value = fetchedToilets.map { it.id }
            } catch (e: Exception) {
                _error.value = "Erro ao carregar banheiros no bounding box: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar banheiros no bounding box", e)
            }
        }
    }

    private fun loadReactions(
        userId: Int,
        commentIds: List<Int>
    ) {
        viewModelScope.launch {
            try {
                val fetchedReactions = commentRepository.getReactionsByUserId(userId, commentIds)
                _reactions.value = _reactions.value.toMutableMap().apply {
                    for (id in commentIds) {
                        this[id] = fetchedReactions.find { it.commentId == id } ?: Reaction(
                            id,
                            TypeReaction.NONE
                        )
                    }
                }
            } catch (e: Exception) {
                _error.value = "Erro ao carregar reações: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao carregar reações para userId=$userId", e)
            }
        }
    }

    fun updateReport(
        toiletId: Int,
        userId: Int,
        typeReport: TypeReport
    ) {
        viewModelScope.launch {
            try {
                val result =
                    toiletRepository.postReport(toiletId, userId, typeReport.technicalValue)
                _toiletsCache.value = _toiletsCache.value.toMutableMap().apply {
                    remove(toiletId)
                }
                _reportState.value = result
            } catch (e: Exception) {
                _error.value = "Erro ao atualizar report: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao atualizar report para toiletId=$toiletId", e)
            }
        }
    }

    fun updateReaction(
        commentId: Int,
        userId: Int,
        typeReaction: TypeReaction
    ) {
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
                                commentRepository.postReaction(
                                    commentId,
                                    userId,
                                    typeReaction.technicalValue
                                )
                            }

                            TypeReaction.DISLIKE -> {
                                comment.dislike++
                                if (initialReaction?.typeReaction == TypeReaction.LIKE) {
                                    comment.like--
                                }
                                commentRepository.postReaction(
                                    commentId,
                                    userId,
                                    typeReaction.technicalValue
                                )
                            }

                            TypeReaction.NONE -> {
                                if (initialReaction?.typeReaction == TypeReaction.LIKE) {
                                    comment.like--
                                } else if (initialReaction?.typeReaction == TypeReaction.DISLIKE) {
                                    comment.dislike--
                                }
                                commentRepository.deleteReaction(commentId, userId)
                            }

                            else -> {
                                remove(comment)
                                val result = commentRepository.postReaction(
                                    commentId,
                                    userId,
                                    typeReaction.technicalValue
                                )
                                _reportState.value = result
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

    fun clearReportState() {
        _reportState.value = null
    }

    fun clearSearchToilets() {
        _toiletsSearch.value = emptyList()
    }

    fun clearToiletSearchSelected() {
        _toiletSearchSelected.value = null
    }
}