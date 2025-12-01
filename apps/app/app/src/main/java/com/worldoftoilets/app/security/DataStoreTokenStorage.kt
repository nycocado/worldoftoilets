package com.worldoftoilets.app.security

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.google.crypto.tink.Aead
import com.google.crypto.tink.KeyTemplates
import com.google.crypto.tink.aead.AeadConfig
import com.google.crypto.tink.integration.android.AndroidKeysetManager
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.runBlocking
import java.util.Base64
import javax.inject.Inject
import javax.inject.Singleton

// Extension property for DataStore
private val Context.dataStore by preferencesDataStore(name = "secure_tokens_datastore")

@Singleton
class DataStoreTokenStorage @Inject constructor(
    @param:ApplicationContext private val context: Context
) : TokenRepository {

    companion object {
        private val ACCESS_TOKEN_KEY = stringPreferencesKey("access_token")
        private val REFRESH_TOKEN_KEY = stringPreferencesKey("refresh_token")
        private const val KEYSET_NAME = "master_keyset"
        private const val PREF_FILE_NAME = "master_key_preference"
        private const val MASTER_KEY_URI = "android-keystore://master_key"
    }

    private val aead: Aead by lazy {
        AeadConfig.register()

        @Suppress("DEPRECATION") // getPrimitive is deprecated in Java but still the recommended way for Tink in Kotlin
        AndroidKeysetManager.Builder()
            .withSharedPref(context, KEYSET_NAME, PREF_FILE_NAME)
            .withKeyTemplate(KeyTemplates.get("AES256_GCM"))
            .withMasterKeyUri(MASTER_KEY_URI)
            .build()
            .keysetHandle
            .getPrimitive(Aead::class.java)
    }

    override fun saveAccessToken(token: String) {
        runBlocking {
            context.dataStore.edit { preferences ->
                preferences[ACCESS_TOKEN_KEY] = encrypt(token)
            }
        }
    }

    override fun getAccessToken(): String? {
        return runBlocking {
            context.dataStore.data.map { preferences ->
                preferences[ACCESS_TOKEN_KEY]?.let { decrypt(it) }
            }.first()
        }
    }

    override fun clearAccessToken() {
        runBlocking {
            context.dataStore.edit { preferences ->
                preferences.remove(ACCESS_TOKEN_KEY)
            }
        }
    }

    override fun saveRefreshToken(token: String) {
        runBlocking {
            context.dataStore.edit { preferences ->
                preferences[REFRESH_TOKEN_KEY] = encrypt(token)
            }
        }
    }

    override fun getRefreshToken(): String? {
        return runBlocking {
            context.dataStore.data.map { preferences ->
                preferences[REFRESH_TOKEN_KEY]?.let { decrypt(it) }
            }.first()
        }
    }

    override fun clearRefreshToken() {
        runBlocking {
            context.dataStore.edit { preferences ->
                preferences.remove(REFRESH_TOKEN_KEY)
            }
        }
    }

    // Helper method used by TokenManager if needed, though not in interface explicitly
    fun saveTokens(accessToken: String, refreshToken: String) {
        saveAccessToken(accessToken)
        saveRefreshToken(refreshToken)
    }

    fun clearTokens() {
        clearAccessToken()
        clearRefreshToken()
    }

    private fun encrypt(data: String): String {
        val bytes = aead.encrypt(data.toByteArray(), null)
        return Base64.getEncoder().encodeToString(bytes)
    }

    private fun decrypt(encryptedData: String): String {
        val bytes = Base64.getDecoder().decode(encryptedData)
        val decrypted = aead.decrypt(bytes, null)
        return String(decrypted)
    }
}
