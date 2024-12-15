package pt.iade.ei.thinktoilet.repositories

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import pt.iade.ei.thinktoilet.models.User
import java.lang.Thread.State
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class UserPreferencesRepository @Inject constructor(
    private val dataStore: DataStore<Preferences>
) {
    private object Keys {
        val USER_ID = intPreferencesKey("user_id")
        val USER_NAME = stringPreferencesKey("user_name")
        val USER_EMAIL = stringPreferencesKey("user_email")
        val USER_ICON_ID = stringPreferencesKey("user_icon_id")
        val USER_NUM_COMMENTS = intPreferencesKey("user_num_comments")
        val USER_POINTS = intPreferencesKey("user_points")
    }

    private val _userStateFlow = MutableStateFlow<User?>(null)
    val userStateFlow: StateFlow<User?> = _userStateFlow

    suspend fun saveUser(user: User) {
        dataStore.edit { prefs ->
            prefs[Keys.USER_ID] = user.id ?: 0
            prefs[Keys.USER_NAME] = user.name
            prefs[Keys.USER_EMAIL] = user.email ?: ""
            prefs[Keys.USER_ICON_ID] = user.iconId
            prefs[Keys.USER_NUM_COMMENTS] = user.numComments
            prefs[Keys.USER_POINTS] = user.points
        }

        _userStateFlow.value = user
    }

    init {
        dataStore.data.map { prefs ->
            val id = prefs[Keys.USER_ID] ?: return@map null
            val name = prefs[Keys.USER_NAME] ?: return@map null
            val email = prefs[Keys.USER_EMAIL]
            val iconId = prefs[Keys.USER_ICON_ID] ?: return@map null
            val numComments = prefs[Keys.USER_NUM_COMMENTS] ?: 0
            val points = prefs[Keys.USER_POINTS] ?: 0

            User(id, name, email, iconId, numComments, points)
        }.map { user ->
            _userStateFlow.value = user
        }.launchIn(CoroutineScope(Dispatchers.Default))
    }

    fun isUserLoggedIn(): StateFlow<Boolean> {
        return userStateFlow.map { it != null }
            .stateIn(
                CoroutineScope(Dispatchers.Default),
                SharingStarted.WhileSubscribed(),
                initialValue = false
            )
    }

    suspend fun clearUser() {
        dataStore.edit { it.clear() }
        _userStateFlow.value = null
    }
}
