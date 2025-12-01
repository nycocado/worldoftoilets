package com.worldoftoilets.app.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.worldoftoilets.app.models.User
import com.worldoftoilets.app.repositories.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {
    private val _loginState = MutableStateFlow<Result<User>?>(null)
    val loginState: StateFlow<Result<User>?> = _loginState.asStateFlow()

    private val _registerState = MutableStateFlow<Result<Unit>?>(null)
    val registerState: StateFlow<Result<Unit>?> = _registerState.asStateFlow()

    private val _error = MutableStateFlow("")
    val error: StateFlow<String> = _error.asStateFlow()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            try {
                val result = authRepository.login(email, password)
                _loginState.value = result
            } catch (e: Exception) {
                _error.value = e.message ?: "Erro ao fazer login"
                Log.e("AuthViewModel", "Erro ao fazer login", e)
            }
        }
    }

    fun register(
        name: String,
        email: String,
        password: String,
        icon: String?,
        birthDate: String
    ) {
        viewModelScope.launch {
            try {
                val result = authRepository.register(name, email, password, icon, birthDate)
                _registerState.value = result
            } catch (e: Exception) {
                _error.value = e.message ?: "Erro ao fazer registro"
                Log.e("AuthViewModel", "Erro ao fazer registro", e)
            }
        }
    }

    private val _resendVerificationState = MutableStateFlow<Result<Unit>?>(null)
    val resendVerificationState: StateFlow<Result<Unit>?> = _resendVerificationState.asStateFlow()

    fun resendVerification(email: String) {
        viewModelScope.launch {
            try {
                val result = authRepository.resendVerification(email)
                _resendVerificationState.value = result
            } catch (e: Exception) {
                _error.value = e.message ?: "Erro ao reenviar verificação"
                Log.e("AuthViewModel", "Erro ao reenviar verificação", e)
            }
        }
    }

    private val _forgotPasswordState = MutableStateFlow<Result<Unit>?>(null)
    val forgotPasswordState: StateFlow<Result<Unit>?> = _forgotPasswordState.asStateFlow()

    fun forgotPassword(email: String) {
        viewModelScope.launch {
            try {
                val result = authRepository.forgotPassword(email)
                _forgotPasswordState.value = result
            } catch (e: Exception) {
                _error.value = e.message ?: "Erro ao recuperar senha"
                Log.e("AuthViewModel", "Erro ao recuperar senha", e)
            }
        }
    }

    fun clearForgotPasswordState() {
        _forgotPasswordState.value = null
    }

    fun clearResendVerificationState() {
        _resendVerificationState.value = null
    }

    fun clearLoginState() {
        _loginState.value = null
    }

    fun clearRegisterState() {
        _registerState.value = null
    }
}