package com.worldoftoilets.app.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.repositories.AuthRepository
import com.worldoftoilets.app.repositories.UserPreferencesRepository
import com.worldoftoilets.app.repositories.UserRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class UserViewModel @Inject constructor(
    private val userRepository: UserRepository,
    private val authRepository: AuthRepository,
    userPreferencesRepository: UserPreferencesRepository
) : ViewModel() {
    private val _user = MutableStateFlow<User?>(null)
    val user: StateFlow<User?> = _user.asStateFlow()

    private val _updateUserState = MutableStateFlow<Result<User>?>(null)
    val updateUserState: StateFlow<Result<User>?> = _updateUserState.asStateFlow()

    val isLoggedIn: StateFlow<Boolean?> = userPreferencesRepository.isLoggedIn
        .map { it as Boolean? }
        .stateIn(viewModelScope, SharingStarted.Eagerly, null)

    private val _error = MutableStateFlow("")
    val error: StateFlow<String> = _error.asStateFlow()

    init {
        // Carregar user se estiver logado
        viewModelScope.launch {
            isLoggedIn.collect { loggedIn ->
                if (loggedIn == true) {
                    loadUser()
                } else {
                    _user.value = null
                }
            }
        }
    }

    fun loadUser() {
        viewModelScope.launch {
            try {
                userRepository.getSelf().onSuccess { data ->
                    _user.value = data
                }.onFailure { e ->
                    _error.value = e.message ?: "Erro ao carregar usuário"
                    logout()
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Erro ao carregar usuário"
                Log.e("UserViewModel", "Erro ao carregar usuário", e)
            }
        }
    }

    fun updateUser(name: String?, icon: String?, birthDate: String?) {
        // Reset state to ensure UI reacts to new events
        _updateUserState.value = null

        viewModelScope.launch {
            try {
                val result = userRepository.updateSelf(name, icon, birthDate)
                _updateUserState.value = result

                // Se sucesso, atualizar user state
                result.onSuccess { data ->
                    _user.value = data
                }.onFailure { e ->
                    _error.value = e.message ?: "Erro ao atualizar usuário"
                }
            } catch (e: Exception) {
                _error.value = e.message ?: "Erro ao atualizar usuário"
                Log.e("UserViewModel", "Erro ao atualizar usuário", e)
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            try {
                authRepository.logout()
                _user.value = null
            } catch (e: Exception) {
                _error.value = e.message ?: "Erro ao fazer logout"
                Log.e("UserViewModel", "Erro ao fazer logout", e)
            }
        }
    }

    fun clearUpdateState() {
        _updateUserState.value = null
    }

    fun clearError() {
        _error.value = ""
    }
}