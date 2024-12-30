package pt.iade.ei.thinktoilet.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import pt.iade.ei.thinktoilet.models.User
import pt.iade.ei.thinktoilet.models.responses.ApiResponse
import pt.iade.ei.thinktoilet.repositories.AuthRepository
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
): ViewModel() {
    private val _loginState = MutableStateFlow<Result<User>?>(null)
    val loginState: StateFlow<Result<User>?> get() = _loginState

    private val _registerState = MutableStateFlow<Result<ApiResponse>?>(null)
    val registerState: StateFlow<Result<ApiResponse>?> get() = _registerState

    private val _error = MutableStateFlow("")
    val error: StateFlow<String> get() = _error

    fun requestLogin(email: String, password: String) {
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

    fun requestRegister(
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
}