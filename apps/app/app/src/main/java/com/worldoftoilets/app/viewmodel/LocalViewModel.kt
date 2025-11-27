package com.worldoftoilets.app.viewmodel

import android.location.Location
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.asFlow
import androidx.lifecycle.viewModelScope
import com.worldoftoilets.app.models.Comment
import com.worldoftoilets.app.models.Page
import com.worldoftoilets.app.models.Toilet
import com.worldoftoilets.app.models.UiState
import com.worldoftoilets.app.models.responses.PageResponse
import com.worldoftoilets.app.repositories.CommentRepository
import com.worldoftoilets.app.repositories.LocationRepository
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
    private val locationRepository: LocationRepository
) : ViewModel() {
    // CACHE: UUID -> Toilet
    private val _toiletsCache = MutableStateFlow<Map<String, Toilet>>(emptyMap())
    val toiletsCache: StateFlow<Map<String, Toilet>> = _toiletsCache.asStateFlow()

    // LISTA DE UUIDs
    private val _toiletsNearbyIds = MutableStateFlow<UiState<PageResponse<String>>>(UiState.Idle)
    val toiletsNearbyIds: StateFlow<UiState<PageResponse<String>>> = _toiletsNearbyIds.asStateFlow()

    // BOUNDING BOX
    private val _toiletsBoundingBoxIds = MutableStateFlow<List<String>>(emptyList())
    val toiletsBoundingBoxIds: StateFlow<List<String>> = _toiletsBoundingBoxIds.asStateFlow()

    // COMENTÁRIOS CACHE: ToiletID -> List<Comment>
    private val _commentsCache = MutableStateFlow<Map<String, List<Comment>>>(emptyMap())
    val commentsCache: StateFlow<Map<String, List<Comment>>> = _commentsCache.asStateFlow()

    private val _isLoadingCommentsToilet = MutableStateFlow(false)
    val isLoadingCommentsToilet: StateFlow<Boolean> = _isLoadingCommentsToilet.asStateFlow()

    private val _myComments = MutableStateFlow<List<Comment>>(emptyList())
    val myComments: StateFlow<List<Comment>> = _myComments.asStateFlow()

    private val _isLoadingCommentsUser = MutableStateFlow(false)
    val isLoadingCommentsUser: StateFlow<Boolean> = _isLoadingCommentsUser.asStateFlow()

    // RATING
    private val _ratingState = MutableStateFlow<Result<Comment>?>(null)
    val ratingState: StateFlow<Result<Comment>?> = _ratingState.asStateFlow()

    // LOCATION
    private val _location = MutableStateFlow<Location?>(null)
    val location: StateFlow<Location?> = _location.asStateFlow()

    // ERROR
    private val _error = MutableStateFlow("")
    val error: StateFlow<String> = _error.asStateFlow()

    // PAGINAÇÃO COM TIMESTAMP
    private var nearbyLastTimestamp: String? = null
    private var commentsLastTimestamp: String? = null

    fun loadLocation(onlyLocation: Boolean = false) {
        viewModelScope.launch {
            locationRepository.getCurrentLocation().asFlow().collect { loc ->
                if (loc != null) {
                    _location.value = loc
                    if (!onlyLocation) {
                        loadToiletsNearby(loc.latitude, loc.longitude)
                    }
                }
            }
        }
    }

    fun loadToiletsNearby(latitude: Double, longitude: Double) {
        viewModelScope.launch {
            _toiletsNearbyIds.value = UiState.Loading
            val result = toiletRepository.getToiletsByProximity(
                latitude, longitude, 0, 20, null
            )

            result.onSuccess { toilets ->
                _toiletsCache.value += toilets.associateBy { it.publicId }

                _toiletsNearbyIds.value = UiState.Success(
                    PageResponse(
                        content = toilets.map { it.publicId },
                        page = Page(number = 0, size = 20, isLast = toilets.size < 20)
                    )
                )
            }.onFailure { e ->
                _error.value = "Erro ao carregar banheiros próximos: ${e.message}"
                _toiletsNearbyIds.value = UiState.Error(_error.value)
                Log.e("LocalViewModel", "Erro ao carregar banheiros próximos", e)
            }
        }
    }

    fun loadMoreToiletsNearby(latitude: Double, longitude: Double) {
        viewModelScope.launch {
            try {
                val currentState = _toiletsNearbyIds.value
                if (currentState !is UiState.Success || currentState.data.page.isLast) return@launch

                val result = toiletRepository.getToiletsByProximity(
                    latitude, longitude, 0, 20, nearbyLastTimestamp
                )

                result.onSuccess { toilets ->
                    _toiletsCache.value += toilets.associateBy { it.publicId }

                    val currentIds = currentState.data.content
                    _toiletsNearbyIds.value = UiState.Success(
                        PageResponse(
                            content = currentIds + toilets.map { it.publicId },
                            page = Page(number = 0, size = 20, isLast = toilets.size < 20)
                        )
                    )
                }.onFailure { e ->
                    _error.value = "Erro ao carregar mais banheiros: ${e.message}"
                }
            } catch (e: Exception) {
                _error.value = "Erro ao carregar mais banheiros: ${e.message}"
                Log.e("LocalViewModel", "Erro ao carregar mais banheiros", e)
            }
        }
    }

    fun loadToiletComments(toiletPublicId: String) {
        _isLoadingCommentsToilet.value = true
        viewModelScope.launch {
            try {
                val result = commentRepository.getCommentsByToilet(
                    toiletPublicId, 0, 20, null
                )

                result.onSuccess { comments ->
                    _commentsCache.value += (toiletPublicId to comments)
                    commentsLastTimestamp = comments.lastOrNull()?.createdAt
                    _isLoadingCommentsToilet.value = false
                }.onFailure { e ->
                    _error.value = "Erro ao carregar comentários: ${e.message}"
                    _isLoadingCommentsToilet.value = false
                }
            } catch (e: Exception) {
                _error.value = "Erro ao carregar comentários: ${e.message}"
                _isLoadingCommentsToilet.value = false
                Log.e("LocalViewModel", "Erro ao carregar comentários", e)
            }
        }
    }

    fun loadMyComments() {
        _isLoadingCommentsUser.value = true
        viewModelScope.launch {
            try {
                val result = commentRepository.getMyComments(0, 20, null)

                result.onSuccess { comments ->
                    _myComments.value = comments
                    _isLoadingCommentsUser.value = false
                }.onFailure { e ->
                    _error.value = "Erro ao carregar meus comentários: ${e.message}"
                    _isLoadingCommentsUser.value = false
                }
            } catch (e: Exception) {
                _error.value = "Erro ao carregar meus comentários: ${e.message}"
                _isLoadingCommentsUser.value = false
                Log.e("LocalViewModel", "Erro ao carregar meus comentários", e)
            }
        }
    }

    fun loadToiletsBoundingBox(minLat: Double, minLng: Double, maxLat: Double, maxLng: Double) {
        viewModelScope.launch {
            try {
                val result =
                    toiletRepository.getToiletsByBoundingBox(minLat, minLng, maxLat, maxLng)

                result.onSuccess { toilets ->
                    _toiletsCache.value += toilets.associateBy { it.publicId }
                    _toiletsBoundingBoxIds.value = toilets.map { it.publicId }
                }.onFailure { e ->
                    _error.value = "Erro ao carregar banheiros: ${e.message}"
                }
            } catch (e: Exception) {
                _error.value = "Erro ao carregar banheiros: ${e.message}"
                Log.e("LocalViewModel", "Erro ao carregar banheiros", e)
            }
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
                    _error.value = "Erro ao reagir ao comentário: ${e.message}"
                }
            } catch (e: Exception) {
                _error.value = "Erro ao reagir ao comentário: ${e.message}"
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
                _error.value = "Erro ao fazer comentário: ${e.message}"
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

    fun clearError() {
        _error.value = ""
    }
}
