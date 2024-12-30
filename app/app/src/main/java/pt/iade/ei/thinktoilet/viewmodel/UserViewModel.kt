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
import pt.iade.ei.thinktoilet.repositories.UserRepository
import javax.inject.Inject

@HiltViewModel
class UserViewModel @Inject constructor(
    private val userRepository: UserRepository,
    private val userPreferencesRepository: UserPreferencesRepository
): ViewModel() {
    val user: StateFlow<User?> = userPreferencesRepository.userStateFlow

    private val _editUser = MutableStateFlow<Result<User>?>(null)
    val editUser: StateFlow<Result<User>?> get() = _editUser

    val isUserLoggedIn: StateFlow<Boolean> = userPreferencesRepository.isUserLoggedIn()

    private val _error = MutableStateFlow("")
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

    fun editName(id: Int, name: String, password: String) {
        viewModelScope.launch {
            try {
                val result = userRepository.editName(id, name, password)
                _editUser.value = result
            } catch (e: Exception) {
                _error.value = "Erro ao editar nome: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao editar nome", e)
            }
        }
    }

    fun editEmail(id: Int, email: String, password: String) {
        viewModelScope.launch {
            try {
                val result = userRepository.editEmail(id, email, password)
                _editUser.value = result
            } catch (e: Exception) {
                _error.value = "Erro ao editar email: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao editar email", e)
            }
        }
    }

    fun editPassword(id: Int, password: String, newPassword: String) {
        viewModelScope.launch {
            try {
                val result = userRepository.editPassword(id, password, newPassword)
                _editUser.value = result
            } catch (e: Exception) {
                _error.value = "Erro ao editar senha: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao editar senha", e)
            }
        }
    }

    fun editIcon(id: Int, iconId: String) {
        viewModelScope.launch {
            try {
                val result = userRepository.editIcon(id, iconId)
                _editUser.value = result
            } catch (e: Exception) {
                _error.value = "Erro ao editar ícone: ${e.message}"
                Log.e("ToiletViewModel", "Erro ao editar ícone", e)
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

    fun clearEditUser() {
        _editUser.value = null
    }
}