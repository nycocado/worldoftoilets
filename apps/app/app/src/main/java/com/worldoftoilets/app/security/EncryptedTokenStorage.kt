package com.worldoftoilets.app.security

import android.content.Context
import android.content.SharedPreferences
import com.google.crypto.tink.Aead
import com.google.crypto.tink.KeyTemplates
import com.google.crypto.tink.integration.android.AndroidKeysetManager
import java.io.IOException
import java.security.GeneralSecurityException
import java.util.Base64

import com.google.crypto.tink.aead.AeadConfig

/**
 * Implementação simplificada e moderna de armazenamento de tokens.
 * Combina SharedPreferences (para armazenamento síncrono simples) com Tink (para criptografia robusta).
 * 
 * Esta abordagem é superior ao DataStore para este caso de uso específico porque:
 * 1. Interceptors de rede precisam de acesso SÍNCRONO aos tokens.
 * 2. Evita a complexidade de gerenciar cache em memória + corrotinas + DataStore apenas para ler duas Strings.
 * 3. Mantém a segurança moderna do Tink (Android Keystore) sem a depreciação do EncryptedSharedPreferences.
 */
class EncryptedTokenStorage(
    context: Context,
    private val sharedPreferences: SharedPreferences
) : TokenRepository {

    companion object {
        private const val KEYSET_NAME = "master_keyset"
        private const val PREF_FILE_NAME = "master_key_preference"
        private const val MASTER_KEY_URI = "android-keystore://master_key"
        
        private const val ACCESS_TOKEN_KEY = "access_token"
        private const val REFRESH_TOKEN_KEY = "refresh_token"
    }

    init {
        try {
            AeadConfig.register()
        } catch (e: GeneralSecurityException) {
            e.printStackTrace()
        }
    }

    // Tink Aead primitive initialization
    private val aead: Aead by lazy {
        try {
            AndroidKeysetManager.Builder()
                .withSharedPref(context, KEYSET_NAME, PREF_FILE_NAME)
                .withKeyTemplate(KeyTemplates.get("AES256_GCM"))
                .withMasterKeyUri(MASTER_KEY_URI)
                .build()
                .keysetHandle
                .getPrimitive(Aead::class.java)
        } catch (e: GeneralSecurityException) {
            throw RuntimeException("Failed to initialize Tink Aead", e)
        } catch (e: IOException) {
            throw RuntimeException("Failed to initialize Tink Aead", e)
        }
    }

    private fun encrypt(data: String): String {
        try {
            val encryptedBytes = aead.encrypt(data.toByteArray(Charsets.UTF_8), null)
            return Base64.getEncoder().encodeToString(encryptedBytes)
        } catch (e: Exception) {
            e.printStackTrace()
            return ""
        }
    }

    private fun decrypt(encryptedData: String): String? {
        if (encryptedData.isEmpty()) return null
        return try {
            val decodedBytes = Base64.getDecoder().decode(encryptedData)
            val decryptedBytes = aead.decrypt(decodedBytes, null)
            String(decryptedBytes, Charsets.UTF_8)
        } catch (e: Exception) {
            // Token corrompido ou chave inválida (pode acontecer após reinstalação/limpeza de dados)
            e.printStackTrace()
            null
        }
    }

    override fun saveAccessToken(token: String) {
        val encrypted = encrypt(token)
        if (encrypted.isNotEmpty()) {
            sharedPreferences.edit().putString(ACCESS_TOKEN_KEY, encrypted).apply()
        }
    }

    override fun getAccessToken(): String? {
        val encrypted = sharedPreferences.getString(ACCESS_TOKEN_KEY, null) ?: return null
        return decrypt(encrypted)
    }

    override fun clearAccessToken() {
        sharedPreferences.edit().remove(ACCESS_TOKEN_KEY).apply()
    }

    override fun saveRefreshToken(token: String) {
        val encrypted = encrypt(token)
        if (encrypted.isNotEmpty()) {
            sharedPreferences.edit().putString(REFRESH_TOKEN_KEY, encrypted).apply()
        }
    }

    override fun getRefreshToken(): String? {
        val encrypted = sharedPreferences.getString(REFRESH_TOKEN_KEY, null) ?: return null
        return decrypt(encrypted)
    }

    override fun clearRefreshToken() {
        sharedPreferences.edit().remove(REFRESH_TOKEN_KEY).apply()
    }
}