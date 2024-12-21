package pt.iade.ei.thinktoilet.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.repositories.UserPreferencesRepository
import javax.inject.Inject

@HiltViewModel
class UserViewModel @Inject constructor(
    private val userPreferencesRepository: UserPreferencesRepository
): ViewModel() {
    val user: StateFlow<User?> = userPreferencesRepository.userStateFlow
    val isUserLoggedIn: StateFlow<Boolean> = userPreferencesRepository.isUserLoggedIn()

    private val _error = MutableStateFlow<String>("")
    val error: StateFlow<String> get() = _error

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