package pt.iade.ei.thinktoilet.repositories

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import pt.iade.ei.thinktoilet.models.User
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

    suspend fun saveUser(user: User) {
        dataStore.edit { prefs ->
            prefs[Keys.USER_ID] = user.id ?: 0
            prefs[Keys.USER_NAME] = user.name
            prefs[Keys.USER_EMAIL] = user.email ?: ""
            prefs[Keys.USER_ICON_ID] = user.iconId
            prefs[Keys.USER_NUM_COMMENTS] = user.numComments
            prefs[Keys.USER_POINTS] = user.points
        }
    }

    val userFlow: Flow<User?> = dataStore.data.map { prefs ->
        val id = prefs[Keys.USER_ID] ?: return@map null
        val name = prefs[Keys.USER_NAME] ?: return@map null
        val email = prefs[Keys.USER_EMAIL]
        val iconId = prefs[Keys.USER_ICON_ID] ?: return@map null
        val numComments = prefs[Keys.USER_NUM_COMMENTS] ?: 0
        val points = prefs[Keys.USER_POINTS] ?: 0

        User(id, name, email, iconId, numComments, points)
    }

    fun isUserLoggedIn(): Flow<Boolean> {
        return userFlow.map { it != null }
    }

    suspend fun clearUser() {
        dataStore.edit { it.clear() }
    }
}
