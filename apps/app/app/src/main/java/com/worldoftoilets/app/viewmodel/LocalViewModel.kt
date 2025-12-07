package com.worldoftoilets.app.viewmodel

import android.location.Location
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.worldoftoilets.app.models.Comment
import com.worldoftoilets.app.models.Page
import com.worldoftoilets.app.models.Reply
import com.worldoftoilets.app.models.Toilet
import com.worldoftoilets.app.models.ToiletFilter
import com.worldoftoilets.app.models.UiState
import com.worldoftoilets.app.models.responses.PageResponse
import com.worldoftoilets.app.models.responses.RouteResponse
import com.worldoftoilets.app.repositories.CommentRepository
import com.worldoftoilets.app.repositories.LocationRepository
import com.worldoftoilets.app.repositories.ReplyRepository
import com.worldoftoilets.app.repositories.ReportRepository
import com.worldoftoilets.app.repositories.RouteRepository
import com.worldoftoilets.app.repositories.ToiletRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LocalViewModel @Inject constructor(
    private val toiletRepository: ToiletRepository,
    private val commentRepository: CommentRepository,
    private val locationRepository: LocationRepository,
    private val reportRepository: ReportRepository,
    private val replyRepository: ReplyRepository,
    private val routeRepository: RouteRepository
) : ViewModel() {
    private val _toiletsCache = MutableStateFlow<Map<String, Toilet>>(emptyMap())
    val toiletsCache: StateFlow<Map<String, Toilet>> = _toiletsCache.asStateFlow()

    private val _toiletsSearch = MutableStateFlow<List<Toilet>>(emptyList())
    val toiletsSearch: StateFlow<List<Toilet>> = _toiletsSearch.asStateFlow()

    private val _toiletsNearbyIds = MutableStateFlow<UiState<PageResponse<String>>>(UiState.Idle)
    val toiletsNearbyIds: StateFlow<UiState<PageResponse<String>>> = _toiletsNearbyIds.asStateFlow()

    private val _toiletsBoundingBoxIds = MutableStateFlow<List<String>>(emptyList())
    val toiletsBoundingBoxIds: StateFlow<List<String>> = _toiletsBoundingBoxIds.asStateFlow()

    private val _toiletFilter = MutableStateFlow(ToiletFilter())
    val toiletFilter: StateFlow<ToiletFilter> = _toiletFilter.asStateFlow()

    private val _commentsCache = MutableStateFlow<Map<String, List<Comment>>>(emptyMap())
    val commentsCache: StateFlow<Map<String, List<Comment>>> = _commentsCache.asStateFlow()

    private val _isLoadingCommentsToilet = MutableStateFlow(false)
    val isLoadingCommentsToilet: StateFlow<Boolean> = _isLoadingCommentsToilet.asStateFlow()

    private val _myComments = MutableStateFlow<List<Comment>>(emptyList())
    val myComments: StateFlow<List<Comment>> = _myComments.asStateFlow()

    private val _isLoadingCommentsUser = MutableStateFlow(false)
    val isLoadingCommentsUser: StateFlow<Boolean> = _isLoadingCommentsUser.asStateFlow()

    private val _repliesCache = MutableStateFlow<Map<String, List<Reply>>>(emptyMap())
    val repliesCache: StateFlow<Map<String, List<Reply>>> = _repliesCache.asStateFlow()

    private val _loadingReplies = MutableStateFlow<Set<String>>(emptySet())
    val loadingReplies: StateFlow<Set<String>> = _loadingReplies.asStateFlow()

    private val _ratingState = MutableStateFlow<Result<Comment>?>(null)
    val ratingState: StateFlow<Result<Comment>?> = _ratingState.asStateFlow()

    private val _reportState = MutableStateFlow<Result<Unit>?>(null)
    val reportState: StateFlow<Result<Unit>?> = _reportState.asStateFlow()

    private val _routeState = MutableStateFlow<UiState<RouteResponse>>(UiState.Idle)
    val routeState: StateFlow<UiState<RouteResponse>> = _routeState.asStateFlow()

    private val _location = MutableStateFlow<Location?>(null)
    val location: StateFlow<Location?> = _location.asStateFlow()

    private val _error = MutableStateFlow("")
    val error: StateFlow<String> = _error.asStateFlow()

    private var nearbyLastTimestamp: String? = null
    private var commentsLastTimestamp: String? = null

    // Pagination Control
    private val _exhaustedToiletIds = mutableSetOf<String>()
    private var _isMyCommentsExhausted = false

    companion object {
        private const val PAGE_SIZE = 20
    }

    fun loadLocation(onlyLocation: Boolean = false) {
        viewModelScope.launch {
            locationRepository.getLocationUpdates().collect { loc ->
                _location.value = loc
                if (!onlyLocation && _toiletsNearbyIds.value is UiState.Idle) {
                    loadToiletsNearby(loc.latitude, loc.longitude)
                }
            }
        }
    }

    fun loadToiletsNearby(latitude: Double, longitude: Double) {
        viewModelScope.launch {
            _toiletsNearbyIds.value = UiState.Loading
            val currentFilter = _toiletFilter.value
            val result = toiletRepository.getToiletsByProximity(
                latitude, longitude, 0, PAGE_SIZE, null,
                currentFilter.access?.technicalValue,
                currentFilter.extras.map { it.technicalValue }.takeIf { it.isNotEmpty() }
            )

            result.onSuccess { toilets ->
                _toiletsCache.value += toilets.associateBy { it.publicId }

                _toiletsNearbyIds.value = UiState.Success(
                    PageResponse(
                        content = toilets.map { it.publicId },
                        page = Page(number = 0, size = PAGE_SIZE, isLast = toilets.size < PAGE_SIZE)
                    )
                )
            }.onFailure { e ->
                _error.value = e.message ?: "Erro ao carregar banheiros próximos"
                _toiletsNearbyIds.value = UiState.Error(_error.value)
                Log.e("LocalViewModel", "Erro ao carregar banheiros próximos", e)
            }
        }
    }

    fun loadMoreToiletsNearby(latitude: Double, longitude: Double) {
        viewModelScope.launch {
            try {
                val currentState = _toiletsNearbyIds.value
                if (currentState !is UiState.Success) return@launch
                if (currentState.data.page?.isLast == true) return@launch

                val nextPage = (currentState.data.page?.number ?: 0) + 1
                val currentFilter = _toiletFilter.value
                val result = toiletRepository.getToiletsByProximity(
                    latitude, longitude, nextPage, PAGE_SIZE, nearbyLastTimestamp,
                    currentFilter.access?.technicalValue,
                    currentFilter.extras.map { it.technicalValue }.takeIf { it.isNotEmpty() }
                )

                result.onSuccess { toilets ->
                    _toiletsCache.value += toilets.associateBy { it.publicId }

                    val currentIds = currentState.data.content
                    val newIds = toilets.map { it.publicId }
                    _toiletsNearbyIds.value = UiState.Success(
                        PageResponse(
                            content = (currentIds + newIds).distinct(),
                            page = Page(
                                number = nextPage,
                                size = PAGE_SIZE,
                                isLast = toilets.size < PAGE_SIZE
                            )
                        )
                    )
                }.onFailure { e ->
                    _error.value = e.message ?: "Erro ao carregar mais banheiros"
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Erro ao carregar mais banheiros"
                Log.e("LocalViewModel", "Erro ao carregar mais banheiros", e)
            }
        }
    }

    fun loadToiletComments(toiletPublicId: String) {
        _isLoadingCommentsToilet.value = true
        _exhaustedToiletIds.remove(toiletPublicId) // Reset pagination
        viewModelScope.launch {
            try {
                val result = commentRepository.getCommentsByToilet(
                    toiletPublicId, 0, PAGE_SIZE, null
                )

                result.onSuccess { comments ->
                    _commentsCache.value += (toiletPublicId to comments)
                    commentsLastTimestamp = comments.lastOrNull()?.createdAt
                    if (comments.size < PAGE_SIZE) {
                        _exhaustedToiletIds.add(toiletPublicId)
                    }
                    _isLoadingCommentsToilet.value = false
                }.onFailure { e ->
                    _error.value = e.message ?: "Erro ao carregar comentários"
                    _isLoadingCommentsToilet.value = false
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Erro ao carregar comentários"
                _isLoadingCommentsToilet.value = false
                Log.e("LocalViewModel", "Erro ao carregar comentários", e)
            }
        }
    }

    fun loadMoreToiletComments(toiletPublicId: String) {
        if (_isLoadingCommentsToilet.value || _exhaustedToiletIds.contains(toiletPublicId)) return

        viewModelScope.launch {
            try {
                val currentComments = _commentsCache.value[toiletPublicId] ?: emptyList()
                if (currentComments.isEmpty()) return@launch

                val lastTimestamp = currentComments.last().createdAt
                val nextPage = currentComments.size / PAGE_SIZE
                _isLoadingCommentsToilet.value = true

                val result = commentRepository.getCommentsByToilet(
                    toiletPublicId, nextPage, PAGE_SIZE, lastTimestamp
                )

                result.onSuccess { newComments ->
                    if (newComments.isNotEmpty()) {
                        val updatedList = (currentComments + newComments).distinctBy { it.publicId }
                        _commentsCache.value += (toiletPublicId to updatedList)
                    }
                    if (newComments.size < PAGE_SIZE) {
                        _exhaustedToiletIds.add(toiletPublicId)
                    }
                    _isLoadingCommentsToilet.value = false
                }.onFailure {
                    _isLoadingCommentsToilet.value = false
                }
            } catch (e: Exception) {
                _isLoadingCommentsToilet.value = false
                Log.e("LocalViewModel", "Erro ao carregar mais comentários", e)
            }
        }
    }

    fun loadMyComments() {
        _isLoadingCommentsUser.value = true
        _isMyCommentsExhausted = false // Reset pagination
        viewModelScope.launch {
            try {
                val result = commentRepository.getMyComments(0, PAGE_SIZE, null)

                result.onSuccess { comments ->
                    _myComments.value = comments
                    if (comments.size < PAGE_SIZE) {
                        _isMyCommentsExhausted = true
                    }
                    _isLoadingCommentsUser.value = false
                }.onFailure { e ->
                    _error.value = e.message ?: "Erro ao carregar meus comentários"
                    _isLoadingCommentsUser.value = false
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Erro ao carregar meus comentários"
                _isLoadingCommentsUser.value = false
                Log.e("LocalViewModel", "Erro ao carregar meus comentários", e)
            }
        }
    }

    fun loadMoreMyComments() {
        if (_isLoadingCommentsUser.value || _isMyCommentsExhausted) return

        viewModelScope.launch {
            try {
                val currentComments = _myComments.value
                if (currentComments.isEmpty()) return@launch

                val lastTimestamp = currentComments.last().createdAt
                val nextPage = currentComments.size / PAGE_SIZE
                _isLoadingCommentsUser.value = true

                val result = commentRepository.getMyComments(nextPage, PAGE_SIZE, lastTimestamp)

                result.onSuccess { newComments ->
                    if (newComments.isNotEmpty()) {
                        _myComments.value =
                            (currentComments + newComments).distinctBy { it.publicId }
                    }
                    if (newComments.size < PAGE_SIZE) {
                        _isMyCommentsExhausted = true
                    }
                    _isLoadingCommentsUser.value = false
                }.onFailure {
                    _isLoadingCommentsUser.value = false
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Erro ao carregar mais comentários meus"
                _isLoadingCommentsUser.value = false
                Log.e("LocalViewModel", "Erro ao carregar mais comentários meus", e)
            }
        }
    }

    fun loadToiletsBoundingBox(minLat: Double, minLng: Double, maxLat: Double, maxLng: Double) {
        viewModelScope.launch {
            try {
                val currentFilter = _toiletFilter.value
                val result =
                    toiletRepository.getToiletsByBoundingBox(
                        minLat, minLng, maxLat, maxLng,
                        currentFilter.access?.technicalValue,
                        currentFilter.extras.map { it.technicalValue }.takeIf { it.isNotEmpty() }
                    )

                result.onSuccess { toilets ->
                    _toiletsCache.value += toilets.associateBy { it.publicId }
                    _toiletsBoundingBoxIds.value = toilets.map { it.publicId }
                }.onFailure { e ->
                    _error.value = e.message ?: "Erro ao carregar banheiros"
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Erro ao carregar banheiros"
                Log.e("LocalViewModel", "Erro ao carregar banheiros", e)
            }
        }
    }

    fun updateFilter(filter: ToiletFilter) {
        _toiletFilter.value = filter
        // Reload data with new filter
        // Limpar cache de listagens que dependem do filtro
        _toiletsNearbyIds.value = UiState.Idle
        _toiletsBoundingBoxIds.value = emptyList()
        
        // Reload location-based data if location is available
        _location.value?.let { loc ->
            loadToiletsNearby(loc.latitude, loc.longitude)
            // Note: Bounding box reload usually happens via Map movement callback, 
            // but we clear the current list to force map to request again if needed or just rely on map movement
        }
    }

    fun reactToComment(toiletId: String, commentPublicId: String, react: String) {
        viewModelScope.launch {
            try {
                val result = commentRepository.reactToComment(commentPublicId, react)

                result.onSuccess { updatedComment ->
                    val currentList = _commentsCache.value[toiletId] ?: emptyList()
                    val updatedList = currentList.map {
                        if (it.publicId == updatedComment.publicId) updatedComment else it
                    }
                    _commentsCache.value += (toiletId to updatedList)
                }.onFailure { e ->
                    _error.value = e.message ?: "Erro ao reagir ao comentário"
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Erro ao reagir ao comentário"
                Log.e("LocalViewModel", "Erro ao reagir", e)
            }
        }
    }

    fun submitRating(
        toiletPublicId: String,
        text: String?,
        clean: Int,
        paper: Boolean,
        structure: Int,
        accessibility: Int
    ) {
        viewModelScope.launch {
            try {
                _ratingState.value = commentRepository.createComment(
                    toiletPublicId, text, clean, paper, structure, accessibility
                )
            } catch (e: Exception) {
                _error.value = e.message ?: "Erro ao fazer comentário"
                Log.e("LocalViewModel", "Erro ao fazer comentário", e)
            }
        }
    }

    fun viewToilet(publicId: String) {
        viewModelScope.launch {
            try {
                toiletRepository.viewToilet(publicId)
            } catch (e: Exception) {
                Log.e("LocalViewModel", "Erro ao registrar visualização", e)
            }
        }
    }

    fun clearRatingState() {
        _ratingState.value = null
    }

    fun clearReportState() {
        _reportState.value = null
    }

    fun clearError() {
        _error.value = ""
    }

    fun searchToilets(query: String) {
        viewModelScope.launch {
            if (query.isBlank()) {
                _toiletsSearch.value = emptyList()
                return@launch
            }
            toiletRepository.searchToilets(query).onSuccess {
                _toiletsSearch.value = it
            }.onFailure {
                _toiletsSearch.value = emptyList()
            }
        }
    }

    fun removeToiletFromCache(toiletId: String) {
        // Remove from main cache
        _toiletsCache.value = _toiletsCache.value.filterKeys { it != toiletId }

        // Remove from nearby list if present
        val currentNearby = _toiletsNearbyIds.value
        if (currentNearby is UiState.Success) {
            val newContent = currentNearby.data.content.filter { it != toiletId }
            _toiletsNearbyIds.value = UiState.Success(
                currentNearby.data.copy(content = newContent)
            )
        }

        // Remove from bounding box list
        _toiletsBoundingBoxIds.value = _toiletsBoundingBoxIds.value.filter { it != toiletId }

        // Remove from search results
        _toiletsSearch.value = _toiletsSearch.value.filter { it.publicId != toiletId }
    }

    fun reportToilet(toiletPublicId: String, typeReport: String) {
        viewModelScope.launch {
            val result = reportRepository.reportToilet(toiletPublicId, typeReport)
            _reportState.value = result
            result.onSuccess {
                removeToiletFromCache(toiletPublicId)
            }.onFailure { e ->
                _error.value = e.message ?: "Erro ao denunciar"
            }
        }
    }

    fun reportComment(commentPublicId: String, typeReport: String) {
        viewModelScope.launch {
            val result = reportRepository.reportComment(commentPublicId, typeReport)
            _reportState.value = result
            result.onFailure { e ->
                _error.value = e.message ?: "Erro ao denunciar"
            }
        }
    }

    fun reportReply(replyPublicId: String, typeReport: String) {
        viewModelScope.launch {
            val result = reportRepository.reportReply(replyPublicId, typeReport)
            _reportState.value = result
            result.onFailure { e ->
                _error.value = e.message ?: "Erro ao denunciar"
            }
        }
    }

    fun reportUser(userPublicId: String, typeReport: String) {
        viewModelScope.launch {
            val result = reportRepository.reportUser(userPublicId, typeReport)
            _reportState.value = result
            result.onFailure { e ->
                _error.value = e.message ?: "Erro ao denunciar"
            }
        }
    }

    fun loadReplies(commentPublicId: String) {
        if (_loadingReplies.value.contains(commentPublicId)) return

        _loadingReplies.value += commentPublicId

        // Calculate next page
        val currentReplies = _repliesCache.value[commentPublicId] ?: emptyList()
        val page = currentReplies.size / PAGE_SIZE

        viewModelScope.launch {
            val result = replyRepository.getRepliesByComment(commentPublicId, page = page)
            result.onSuccess { replies ->
                if (replies.isNotEmpty()) {
                    // If page 0, replace. If page > 0, append.
                    // But current cache logic in other methods suggests we might want to be careful.
                    // For simplicity with "load more", we usually append.
                    // But if we re-click "View Replies" (toggle), we might just want to fetch missing?
                    // The UI logic calls this when expanding.
                    // Let's assume we append if distinct.

                    val combined = (currentReplies + replies).distinctBy { it.publicId }
                    _repliesCache.value += (commentPublicId to combined)
                }
                _loadingReplies.value -= commentPublicId
            }.onFailure { e ->
                _error.value = e.message ?: "Erro ao carregar respostas"
                _loadingReplies.value -= commentPublicId
            }
        }
    }

    fun createReply(commentPublicId: String, text: String) {
        viewModelScope.launch {
            val result = replyRepository.createReply(commentPublicId, text)
            result.onSuccess { reply ->
                val currentReplies = _repliesCache.value[commentPublicId] ?: emptyList()
                _repliesCache.value += (commentPublicId to (currentReplies + reply))

                val updatedCommentsCache = _commentsCache.value.mapValues { entry ->
                    entry.value.map { comment ->
                        if (comment.publicId == commentPublicId) {
                            comment.copy(replyCount = comment.replyCount + 1)
                        } else {
                            comment
                        }
                    }
                }
                _commentsCache.value = updatedCommentsCache

            }.onFailure { e ->
                _error.value = e.message ?: "Erro ao criar resposta"
            }
        }
    }

    fun updateReply(replyId: String, commentId: String, text: String) {
        viewModelScope.launch {
            replyRepository.updateReply(replyId, text).onSuccess { updatedReply ->
                val currentReplies = _repliesCache.value[commentId] ?: emptyList()
                val updatedList = currentReplies.map {
                    if (it.publicId == replyId) updatedReply else it
                }
                _repliesCache.value += (commentId to updatedList)
            }.onFailure { e ->
                _error.value = e.message ?: "Erro ao atualizar resposta"
            }
        }
    }

    fun deleteReply(replyId: String, commentId: String) {
        viewModelScope.launch {
            replyRepository.deleteReply(replyId).onSuccess {
                val currentReplies = _repliesCache.value[commentId] ?: emptyList()
                val updatedList = currentReplies.filter { it.publicId != replyId }
                _repliesCache.value += (commentId to updatedList)

                // Decrement reply count
                val updatedCommentsCache = _commentsCache.value.mapValues { entry ->
                    entry.value.map { comment ->
                        if (comment.publicId == commentId) {
                            comment.copy(replyCount = (comment.replyCount - 1).coerceAtLeast(0))
                        } else {
                            comment
                        }
                    }
                }
                _commentsCache.value = updatedCommentsCache
            }.onFailure { e ->
                _error.value = e.message ?: "Erro ao deletar resposta"
            }
        }
    }

    fun getCommentById(commentId: String): Comment? {
        return _myComments.value.find { it.publicId == commentId }
            ?: _commentsCache.value.values.flatten().find { it.publicId == commentId }
    }

    fun updateComment(
        commentId: String,
        toiletId: String,
        text: String?,
        clean: Int?,
        paper: Boolean?,
        structure: Int?,
        accessibility: Int?
    ) {
        viewModelScope.launch {
            commentRepository.updateComment(commentId, text, clean, paper, structure, accessibility)
                .onSuccess { updatedComment ->
                    val currentList = _commentsCache.value[toiletId] ?: emptyList()
                    val updatedList = currentList.map {
                        if (it.publicId == commentId) updatedComment else it
                    }
                    _commentsCache.value += (toiletId to updatedList)

                    // Also update myComments if present
                    val myCurrentList = _myComments.value
                    if (myCurrentList.any { it.publicId == commentId }) {
                        _myComments.value = myCurrentList.map {
                            if (it.publicId == commentId) updatedComment else it
                        }
                    }

                    // Clear rating state to trigger success callback if observing
                    _ratingState.value = Result.success(updatedComment)

                }.onFailure { e ->
                _error.value = e.message ?: "Erro ao atualizar comentário"
                _ratingState.value = Result.failure(e)
            }
        }
    }

    fun deleteComment(commentId: String, toiletId: String) {
        viewModelScope.launch {
            commentRepository.deleteComment(commentId).onSuccess {
                val currentList = _commentsCache.value[toiletId] ?: emptyList()
                val updatedList = currentList.filter { it.publicId != commentId }
                _commentsCache.value += (toiletId to updatedList)
            }.onFailure { e ->
                _error.value = e.message ?: "Erro ao deletar comentário"
            }
        }
    }

    fun calculateRoute(toiletId: String) {
        val loc = _location.value
        if (loc == null) {
            val errorMessage = "Localização não disponível"
            _routeState.value = UiState.Error(errorMessage)
            _error.value = errorMessage
            return
        }

        viewModelScope.launch {
            _routeState.value = UiState.Loading
            val result = routeRepository.calculateRouteToToilet(toiletId, loc.latitude, loc.longitude)
            result.onSuccess { route ->
                _routeState.value = UiState.Success(route)
            }.onFailure { e ->
                val errorMessage = e.message ?: "Erro ao calcular rota"
                _routeState.value = UiState.Error(errorMessage)
                _error.value = errorMessage
            }
        }
    }

    fun clearRoute() {
        _routeState.value = UiState.Idle
    }
}