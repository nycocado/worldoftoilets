# Plano de Refatoração Massiva - Think Toilet Android App

## Contexto da Refatoração

O aplicativo Android Think Toilet passará por uma refatoração completa para se adequar à nova API que implementa:

- Sistema de autenticação JWT + Refresh Token (substituindo API_KEY simples)
- Identificadores UUID em vez de IDs inteiros
- Estrutura de permissões baseada em Roles
- Novos endpoints e contratos de API completamente diferentes
- **IMPORTANTE**: Sem necessidade de retrocompatibilidade - todos os usuários serão novos

## Decisões Arquiteturais

### 1. **Armazenamento de Tokens**

- **EncryptedSharedPreferences** para accessToken e refreshToken
- Maior segurança para dados sensíveis
- API nativa do Android (API 23+)

### 2. **Cache de Dados**

- **Cache em memória** (ViewModels/Repository)
- StateFlows para reatividade
- Dados não persistem entre sessões do app
- Sempre sincronizado com API

### 3. **Paginação**

- **Híbrida**: page/size + timestamp opcional
- Timestamp do último item previne duplicatas
- Mantém compatibilidade com endpoints que não usam timestamp

### 4. **Migração de Dados**

- **Não aplicável** - sem usuários existentes
- Limpar completamente UserPreferencesRepository (DataStore)
- Remover toda lógica legada de migração

### 5. **Controle de Acesso**

- **MUDANÇA CRÍTICA**: App agora requer login obrigatório
- Usuário NÃO pode acessar nenhuma tela sem autenticação
- Antes: HomeScreen (mapa) era acessível sem login
- Depois: Primeira tela é LoginScreen, todas as telas requerem autenticação
- Auth check no RootNavigationGraph

---

## Fases da Refatoração

### **FASE 1: Infraestrutura de Autenticação JWT**

#### 1.1. Token Management

**Criar novo módulo de segurança**

```
app/src/main/java/com/worldoftoilets/app/security/
├── TokenManager.kt          # Gerencia access + refresh tokens
├── TokenRepository.kt       # Abstração para storage
└── EncryptedTokenStorage.kt # EncryptedSharedPreferences implementation
```

**TokenManager responsabilidades:**

- Salvar/recuperar accessToken e refreshToken
- Verificar validade do accessToken (decode JWT, check exp)
- Limpar tokens no logout
- Fornecer token atual para interceptors

#### 1.2. Network Interceptors

**Modificar RetrofitClient.kt** (/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/network/RetrofitClient.kt)

**REMOVER:**

- `ApiKeyInterceptor` (linhas 17-31) - API_KEY descontinuada

**ADICIONAR:**

- `AuthInterceptor` - Injeta `Authorization: Bearer <accessToken>` em todas requisições autenticadas
- `TokenRefreshInterceptor` - Intercepta 401, chama /auth/refresh, retenta request original
- Lógica para identificar endpoints públicos (login, register, verify-email) que não precisam de token

**Estrutura:**

```kotlin
class AuthInterceptor(private val tokenManager: TokenManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()

        // Endpoints públicos não precisam de autenticação
        if (isPublicEndpoint(request.url.encodedPath)) {
            return chain.proceed(request)
        }

        val accessToken = tokenManager.getAccessToken()
        val authenticatedRequest = request.newBuilder()
            .header("Authorization", "Bearer $accessToken")
            .build()

        return chain.proceed(authenticatedRequest)
    }
}

class TokenRefreshInterceptor(
    private val tokenManager: TokenManager,
    private val authService: AuthService
) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val response = chain.proceed(request)

        // Se receber 401 e tiver refresh token, tentar renovar
        if (response.code == 401 && tokenManager.hasRefreshToken()) {
            synchronized(this) {
                // Chamar POST /auth/refresh com refreshToken
                val refreshResponse = authService.refresh(
                    "Bearer ${tokenManager.getRefreshToken()}"
                ).execute()

                if (refreshResponse.isSuccessful) {
                    val newTokens = refreshResponse.body()!!
                    tokenManager.saveTokens(
                        newTokens.accessToken,
                        newTokens.refreshToken
                    )

                    // Retentar request original com novo token
                    val newRequest = request.newBuilder()
                        .header("Authorization", "Bearer ${newTokens.accessToken}")
                        .build()

                    response.close()
                    return chain.proceed(newRequest)
                }
            }
        }

        return response
    }
}
```

#### 1.3. Dependency Injection Updates

**Modificar di/DataStoreModule.kt e criar SecurityModule.kt**

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object SecurityModule {

    @Provides
    @Singleton
    fun provideEncryptedSharedPreferences(
        @ApplicationContext context: Context
    ): SharedPreferences {
        val masterKey = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()

        return EncryptedSharedPreferences.create(
            context,
            "secure_prefs",
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
    }

    @Provides
    @Singleton
    fun provideTokenManager(
        encryptedPrefs: SharedPreferences
    ): TokenManager = TokenManager(EncryptedTokenStorage(encryptedPrefs))
}
```

---

### **FASE 2: Migração de Models**

Todos os models precisam ser atualizados para refletir a nova API.

#### 2.1. Models Principais

**User.kt** - Substituir completamente

```kotlin
data class User(
    @SerializedName("publicId") val publicId: String,  // UUID
    @SerializedName("name") val name: String,
    @SerializedName("icon") val icon: String,
    @SerializedName("email") val email: String?,       // Apenas em UserSelfResponseDto
    @SerializedName("commentsCount") val commentsCount: Int,
    @SerializedName("points") val points: Int,
    @SerializedName("birthDate") val birthDate: String?, // ISO 8601
    @SerializedName("isPartner") val isPartner: Boolean,
    @SerializedName("roles") val roles: List<Role>?,
    @SerializedName("createdAt") val createdAt: String  // ISO 8601
)

data class Role(
    @SerializedName("name") val name: String,
    @SerializedName("apiName") val apiName: String
)
```

**Toilet.kt** - Atualizar estrutura

```kotlin
data class Toilet(
    @SerializedName("publicId") val publicId: String,  // UUID
    @SerializedName("name") val name: String,
    @SerializedName("address") val address: String,
    @SerializedName("city") val city: String,
    @SerializedName("state") val state: String?,
    @SerializedName("country") val country: String,
    @SerializedName("countryCode") val countryCode: String,
    @SerializedName("latitude") val latitude: Double,
    @SerializedName("longitude") val longitude: Double,
    @SerializedName("access") val access: Access,      // Objeto nested
    @SerializedName("extras") val extras: List<TypeExtra>,
    @SerializedName("photoUrl") val photoUrl: String?,
    @SerializedName("placeId") val placeId: String?,
    @SerializedName("rating") val rating: ToiletRating
)

data class Access(
    @SerializedName("name") val name: String,
    @SerializedName("apiName") val apiName: String  // "public", "private", "consumers-only"
)

data class TypeExtra(
    @SerializedName("name") val name: String,
    @SerializedName("apiName") val apiName: String
)

data class ToiletRating(
    @SerializedName("totalRatings") val totalRatings: Int,
    @SerializedName("avgClean") val avgClean: Double,
    @SerializedName("avgStructure") val avgStructure: Double,
    @SerializedName("avgAccessibility") val avgAccessibility: Double,
    @SerializedName("paperAvailability") val paperAvailability: Double  // 0.0 a 1.0
)
```

**Comment.kt** - Nova estrutura

```kotlin
data class Comment(
    @SerializedName("publicId") val publicId: String,  // UUID
    @SerializedName("text") val text: String?,
    @SerializedName("score") val score: Double,
    @SerializedName("rate") val rate: CommentRate,
    @SerializedName("reactCounts") val reactCounts: ReactCounts,
    @SerializedName("replyCount") val replyCount: Int,
    @SerializedName("user") val user: UserCommentResponse,
    @SerializedName("createdAt") val createdAt: String  // ISO 8601
)

data class CommentRate(
    @SerializedName("clean") val clean: Int,      // 1-5
    @SerializedName("paper") val paper: Boolean,
    @SerializedName("structure") val structure: Int,  // 1-5
    @SerializedName("accessibility") val accessibility: Int  // 1-5
)

data class ReactCounts(
    @SerializedName("likes") val likes: Int,
    @SerializedName("dislikes") val dislikes: Int
)

data class UserCommentResponse(
    @SerializedName("publicId") val publicId: String,
    @SerializedName("name") val name: String,
    @SerializedName("icon") val icon: String,
    @SerializedName("commentsCount") val commentsCount: Int,
    @SerializedName("points") val points: Int,
    @SerializedName("isPartner") val isPartner: Boolean
)
```

#### 2.2. Request/Response DTOs

**LoginRequest.kt / RegisterRequest.kt** - Atualizar

```kotlin
data class LoginRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String
)

data class LoginResponse(
    @SerializedName("accessToken") val accessToken: String,
    @SerializedName("refreshToken") val refreshToken: String,
    @SerializedName("user") val user: User
)

data class RegisterRequest(
    @SerializedName("name") val name: String,
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String,
    @SerializedName("icon") val icon: String?,
    @SerializedName("birthDate") val birthDate: String  // ISO 8601
)
```

---

### **FASE 3: Atualização de Services (Retrofit)**

Todos os services precisam ser reescritos para os novos endpoints.

#### 3.1. AuthService.kt

**Arquivo:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/network/AuthService.kt`

```kotlin
interface AuthService {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<Unit>

    @POST("auth/refresh")
    suspend fun refresh(
        @Header("Authorization") bearerToken: String  // "Bearer {refreshToken}"
    ): Response<RefreshTokenResponse>

    @POST("auth/logout")
    suspend fun logout(
        @Header("Authorization") bearerToken: String
    ): Response<Unit>

    @POST("auth/logout-all")
    suspend fun logoutAll(
        @Header("Authorization") bearerToken: String
    ): Response<Unit>

    @POST("auth/verify-email")
    suspend fun verifyEmail(
        @Header("Authorization") bearerToken: String
    ): Response<Unit>

    @POST("auth/resend-verification")
    suspend fun resendVerification(
        @Query("email") email: String
    ): Response<Unit>
}

data class RefreshTokenResponse(
    @SerializedName("accessToken") val accessToken: String,
    @SerializedName("refreshToken") val refreshToken: String
)
```

#### 3.2. UserService.kt

**Mudanças principais:**

- `/user/self` (GET) - Obter próprio usuário (requer autenticação)
- `/user/self` (PATCH) - Atualizar próprio usuário
- `/user/self` (DELETE) - Deletar própria conta (requer senha)
- Remover todos endpoints com `{id}` no path - API agora usa token JWT para identificar usuário

```kotlin
interface UserService {
    @GET("user/self")
    suspend fun getSelf(): Response<User>

    @PATCH("user/self")
    suspend fun updateSelf(@Body request: UpdateUserRequest): Response<User>

    @DELETE("user/self")
    suspend fun deleteSelf(@Body request: DeleteUserRequest): Response<Unit>

    // Endpoints de gestão (admin)
    @GET("user/manage")
    suspend fun getUsers(
        @Query("pageable") pageable: Boolean = true,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20
    ): Response<List<User>>
}

data class UpdateUserRequest(
    @SerializedName("name") val name: String?,
    @SerializedName("icon") val icon: String?,
    @SerializedName("birthDate") val birthDate: String?
)

data class DeleteUserRequest(
    @SerializedName("password") val password: String
)
```

#### 3.3. ToiletService.kt

**Mudanças críticas:**

- Substituir `Int` por `String` (UUID) em todos `id`/`publicId`
- Remover parâmetro `userId` - autenticação via token
- Atualizar endpoints para novos paths

```kotlin
interface ToiletService {
    @GET("toilet")
    suspend fun getToilets(
        @Query("pageable") pageable: Boolean = true,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20,
        @Query("city") city: String? = null,
        @Query("country") country: String? = null,
        @Query("countryCode") countryCode: String? = null,
        @Query("access") access: String? = null,  // "public", "private", "consumers-only"
        @Query("extras") extras: List<String>? = null,
        @Query("timestamp") timestamp: String? = null  // ISO 8601
    ): Response<List<Toilet>>

    @GET("toilet/proximity")
    suspend fun getToiletsByProximity(
        @Query("lat") lat: Double,
        @Query("lng") lng: Double,
        @Query("pageable") pageable: Boolean = true,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20,
        @Query("access") access: String? = null,
        @Query("extras") extras: List<String>? = null,
        @Query("timestamp") timestamp: String? = null
    ): Response<List<Toilet>>

    @GET("toilet/bounding-box")
    suspend fun getToiletsByBoundingBox(
        @Query("minLat") minLat: Double,
        @Query("minLng") minLng: Double,
        @Query("maxLat") maxLat: Double,
        @Query("maxLng") maxLng: Double,
        @Query("access") access: String? = null,
        @Query("extras") extras: List<String>? = null,
        @Query("timestamp") timestamp: String? = null
    ): Response<List<Toilet>>

    @GET("toilet/{publicId}")
    suspend fun getToilet(@Path("publicId") publicId: String): Response<Toilet>

    @PUT("toilet/{publicId}/view")
    suspend fun viewToilet(@Path("publicId") publicId: String): Response<Unit>

    @POST("toilet/manage")
    suspend fun createToilet(@Body request: CreateToiletRequest): Response<Toilet>

    @POST("toilet/{publicId}/manage/image")
    @Multipart
    suspend fun uploadImage(
        @Path("publicId") publicId: String,
        @Part image: MultipartBody.Part
    ): Response<Toilet>
}
```

#### 3.4. CommentService.kt

**Mudanças principais:**

- `/comment/toilet/{publicId}` - Lista comentários de toilet
- `/comment/user/self` - Lista próprios comentários (autenticado)
- `/comment/{publicId}/react` (PUT) - Reagir like/dislike (idempotente)
- Remover userId de todos endpoints - identificação via JWT

```kotlin
interface CommentService {
    @GET("comment/toilet/{publicId}")
    suspend fun getCommentsByToilet(
        @Path("publicId") toiletPublicId: String,
        @Query("pageable") pageable: Boolean = true,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20,
        @Query("timestamp") timestamp: String? = null
    ): Response<List<Comment>>

    @GET("comment/user/self")
    suspend fun getMyComments(
        @Query("pageable") pageable: Boolean = true,
        @Query("page") page: Int = 0,
        @Query("size") size: Int = 20,
        @Query("timestamp") timestamp: String? = null
    ): Response<List<Comment>>

    @POST("comment")
    suspend fun createComment(@Body request: CreateCommentRequest): Response<Comment>

    @PATCH("comment/{publicId}")
    suspend fun updateComment(
        @Path("publicId") publicId: String,
        @Body request: UpdateCommentRequest
    ): Response<Comment>

    @DELETE("comment/{publicId}")
    suspend fun deleteComment(@Path("publicId") publicId: String): Response<Unit>

    @PUT("comment/{publicId}/react")
    suspend fun reactToComment(
        @Path("publicId") publicId: String,
        @Query("react") react: String  // "like" ou "dislike"
    ): Response<Comment>
}

data class CreateCommentRequest(
    @SerializedName("toiletPublicId") val toiletPublicId: String,
    @SerializedName("text") val text: String?,
    @SerializedName("rate") val rate: CommentRateRequest
)

data class CommentRateRequest(
    @SerializedName("clean") val clean: Int,
    @SerializedName("paper") val paper: Boolean,
    @SerializedName("structure") val structure: Int,
    @SerializedName("accessibility") val accessibility: Int
)

data class UpdateCommentRequest(
    @SerializedName("text") val text: String?,
    @SerializedName("rate") val rate: CommentRateRequest?
)
```

---

### **FASE 4: Refatoração de Repositories**

#### 4.1. UserPreferencesRepository.kt

**Mudanças:**

- Remover campos antigos (user_id, user_name, etc.) do DataStore
- Manter apenas flag `isLoggedIn: Boolean` para verificar se há sessão
- **TokenManager será responsável por tokens (EncryptedSharedPreferences)**
- User data virá sempre da API via `/user/self`

```kotlin
class UserPreferencesRepository @Inject constructor(
    private val dataStore: DataStore<Preferences>
) {
    private object PreferencesKeys {
        val IS_LOGGED_IN = booleanPreferencesKey("is_logged_in")
    }

    val isLoggedIn: Flow<Boolean> = dataStore.data
        .map { preferences ->
            preferences[PreferencesKeys.IS_LOGGED_IN] ?: false
        }

    suspend fun setLoggedIn(loggedIn: Boolean) {
        dataStore.edit { preferences ->
            preferences[PreferencesKeys.IS_LOGGED_IN] = loggedIn
        }
    }

    suspend fun clear() {
        dataStore.edit { it.clear() }
    }
}
```

#### 4.2. AuthRepository.kt

**Responsabilidades:**

- Login e registro
- Refresh token
- Logout
- Coordenar com TokenManager

```kotlin
class AuthRepository @Inject constructor(
    private val authService: AuthService,
    private val tokenManager: TokenManager,
    private val userPreferencesRepository: UserPreferencesRepository
) {
    suspend fun login(email: String, password: String): Result<User> {
        return try {
            val response = authService.login(LoginRequest(email, password))

            if (response.isSuccessful && response.body() != null) {
                val loginResponse = response.body()!!

                // Salvar tokens
                tokenManager.saveTokens(
                    loginResponse.accessToken,
                    loginResponse.refreshToken
                )

                // Marcar como logado
                userPreferencesRepository.setLoggedIn(true)

                Result.success(loginResponse.user)
            } else {
                Result.failure(Exception(parseError(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun register(
        name: String,
        email: String,
        password: String,
        icon: String?,
        birthDate: String
    ): Result<Unit> {
        return try {
            val response = authService.register(
                RegisterRequest(name, email, password, icon, birthDate)
            )

            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception(parseError(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun logout(): Result<Unit> {
        return try {
            val refreshToken = tokenManager.getRefreshToken()
            if (refreshToken != null) {
                authService.logout("Bearer $refreshToken")
            }

            tokenManager.clearTokens()
            userPreferencesRepository.clear()

            Result.success(Unit)
        } catch (e: Exception) {
            // Mesmo com erro, limpar localmente
            tokenManager.clearTokens()
            userPreferencesRepository.clear()
            Result.success(Unit)
        }
    }
}
```

#### 4.3. UserRepository.kt

**Simplificar:**

- Remover métodos edit com `userId` no path
- Apenas `/user/self` endpoints

```kotlin
class UserRepository @Inject constructor(
    private val userService: UserService
) {
    suspend fun getSelf(): Result<User> {
        return try {
            val response = userService.getSelf()

            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(parseError(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateSelf(
        name: String?,
        icon: String?,
        birthDate: String?
    ): Result<User> {
        return try {
            val response = userService.updateSelf(
                UpdateUserRequest(name, icon, birthDate)
            )

            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(parseError(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteSelf(password: String): Result<Unit> {
        return try {
            val response = userService.deleteSelf(DeleteUserRequest(password))

            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception(parseError(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

#### 4.4. ToiletRepository.kt

**Atualizar:**

- Todos IDs Int → String (UUID)
- Remover userId de parâmetros
- Adicionar suporte a timestamp para paginação

```kotlin
class ToiletRepository @Inject constructor(
    private val toiletService: ToiletService
) {
    suspend fun getToiletsByProximity(
        lat: Double,
        lng: Double,
        page: Int = 0,
        size: Int = 20,
        timestamp: String? = null
    ): Result<List<Toilet>> {
        return try {
            val response = toiletService.getToiletsByProximity(
                lat, lng, true, page, size, null, null, timestamp
            )

            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(parseError(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getToiletsByBoundingBox(
        minLat: Double,
        minLng: Double,
        maxLat: Double,
        maxLng: Double
    ): Result<List<Toilet>> {
        return try {
            val response = toiletService.getToiletsByBoundingBox(
                minLat, minLng, maxLat, maxLng, null, null, null
            )

            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(parseError(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getToilet(publicId: String): Result<Toilet> {
        return try {
            val response = toiletService.getToilet(publicId)

            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(parseError(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun viewToilet(publicId: String): Result<Unit> {
        return try {
            val response = toiletService.viewToilet(publicId)

            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception(parseError(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

#### 4.5. CommentRepository.kt

**Atualizar:**

- Remover userId de parâmetros
- Usar `/comment/user/self` para próprios comentários
- Reagir via PUT (idempotente)

```kotlin
class CommentRepository @Inject constructor(
    private val commentService: CommentService
) {
    suspend fun getCommentsByToilet(
        toiletPublicId: String,
        page: Int = 0,
        size: Int = 20,
        timestamp: String? = null
    ): Result<List<Comment>> {
        return try {
            val response = commentService.getCommentsByToilet(
                toiletPublicId, true, page, size, timestamp
            )

            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(parseError(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getMyComments(
        page: Int = 0,
        size: Int = 20,
        timestamp: String? = null
    ): Result<List<Comment>> {
        return try {
            val response = commentService.getMyComments(true, page, size, timestamp)

            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(parseError(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createComment(
        toiletPublicId: String,
        text: String?,
        clean: Int,
        paper: Boolean,
        structure: Int,
        accessibility: Int
    ): Result<Comment> {
        return try {
            val response = commentService.createComment(
                CreateCommentRequest(
                    toiletPublicId,
                    text,
                    CommentRateRequest(clean, paper, structure, accessibility)
                )
            )

            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(parseError(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun reactToComment(
        commentPublicId: String,
        react: String  // "like" ou "dislike"
    ): Result<Comment> {
        return try {
            val response = commentService.reactToComment(commentPublicId, react)

            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception(parseError(response)))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

---

### **FASE 5: Refatoração de ViewModels**

#### 5.1. UserViewModel.kt

**Mudanças drásticas:**

- User não mais vem do DataStore
- Buscar de `/user/self` na inicialização
- StateFlow<User?> continua, mas source é API

**Arquivo:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/viewmodel/UserViewModel.kt`

```kotlin
@HiltViewModel
class UserViewModel @Inject constructor(
    private val userRepository: UserRepository,
    private val authRepository: AuthRepository,
    private val userPreferencesRepository: UserPreferencesRepository
) : ViewModel() {

    private val _user = MutableStateFlow<User?>(null)
    val user: StateFlow<User?> = _user.asStateFlow()

    private val _updateUserState = MutableStateFlow<Result<User>?>(null)
    val updateUserState: StateFlow<Result<User>?> = _updateUserState.asStateFlow()

    val isLoggedIn: StateFlow<Boolean> = userPreferencesRepository.isLoggedIn
        .stateIn(viewModelScope, SharingStarted.Eagerly, false)

    init {
        // Carregar user se estiver logado
        viewModelScope.launch {
            isLoggedIn.collect { loggedIn ->
                if (loggedIn) {
                    loadUser()
                } else {
                    _user.value = null
                }
            }
        }
    }

    fun loadUser() {
        viewModelScope.launch {
            when (val result = userRepository.getSelf()) {
                is Result.Success -> _user.value = result.data
                is Result.Failure -> {
                    // Token pode ter expirado, fazer logout
                    logout()
                }
            }
        }
    }

    fun updateUser(name: String?, icon: String?, birthDate: String?) {
        viewModelScope.launch {
            _updateUserState.value = userRepository.updateSelf(name, icon, birthDate)

            // Se sucesso, atualizar user state
            if (_updateUserState.value is Result.Success) {
                _user.value = (_updateUserState.value as Result.Success).data
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
            _user.value = null
        }
    }
}
```

#### 5.2. AuthViewModel.kt

**Atualizar:**

- LoginResponse agora retorna tokens + user
- Tokens salvos automaticamente no repository

**Arquivo:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/viewmodel/AuthViewModel.kt`

```kotlin
@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _loginState = MutableStateFlow<Result<User>?>(null)
    val loginState: StateFlow<Result<User>?> = _loginState.asStateFlow()

    private val _registerState = MutableStateFlow<Result<Unit>?>(null)
    val registerState: StateFlow<Result<Unit>?> = _registerState.asStateFlow()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _loginState.value = authRepository.login(email, password)
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
            _registerState.value = authRepository.register(
                name, email, password, icon, birthDate
            )
        }
    }

    fun clearLoginState() {
        _loginState.value = null
    }

    fun clearRegisterState() {
        _registerState.value = null
    }
}
```

#### 5.3. LocalViewModel.kt

**Refatoração massiva:**

- Substituir cache de `Map<Int, Toilet>` para `Map<String, Toilet>` (UUID)
- Remover userId de todos os métodos
- Atualizar lógica de reações (agora idempotente - PUT /comment/{id}/react)
- Adicionar suporte a timestamp para paginação

**Arquivo:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/viewmodel/LocalViewModel.kt`

**Mudanças críticas:**

```kotlin
@HiltViewModel
class LocalViewModel @Inject constructor(
    private val toiletRepository: ToiletRepository,
    private val commentRepository: CommentRepository,
    private val locationRepository: LocationRepository
) : ViewModel() {

    // CACHE: UUID -> Toilet
    private val _toiletsCache = MutableStateFlow<Map<String, Toilet>>(emptyMap())
    val toiletsCache: StateFlow<Map<String, Toilet>> = _toiletsCache.asStateFlow()

    // LISTAS DE IDs (UUIDs)
    private val _toiletsNearbyIds = MutableStateFlow<UiState<PageResponse<String>>>(UiState.Idle)
    val toiletsNearbyIds: StateFlow<UiState<PageResponse<String>>> = _toiletsNearbyIds.asStateFlow()

    // COMENTÁRIOS
    private val _commentsToilet = MutableStateFlow<List<Comment>>(emptyList())
    val commentsToilet: StateFlow<List<Comment>> = _commentsToilet.asStateFlow()

    private val _myComments = MutableStateFlow<List<Comment>>(emptyList())
    val myComments: StateFlow<List<Comment>> = _myComments.asStateFlow()

    // LOCATION
    private val _location = MutableStateFlow<Location?>(null)
    val location: StateFlow<Location?> = _location.asStateFlow()

    // Rating state
    private val _ratingState = MutableStateFlow<Result<Comment>?>(null)
    val ratingState: StateFlow<Result<Comment>?> = _ratingState.asStateFlow()

    // Paginação com timestamp
    private var nearbyLastTimestamp: String? = null
    private var commentsLastTimestamp: String? = null

    fun loadToiletsNearby() {
        val currentLocation = _location.value ?: return

        viewModelScope.launch {
            _toiletsNearbyIds.value = UiState.Loading

            when (val result = toiletRepository.getToiletsByProximity(
                currentLocation.latitude,
                currentLocation.longitude,
                page = 0,
                size = 20,
                timestamp = null  // Primeira página sem timestamp
            )) {
                is Result.Success -> {
                    val toilets = result.data

                    // Atualizar cache
                    _toiletsCache.value = _toiletsCache.value + toilets.associateBy { it.publicId }

                    // Atualizar timestamp para próxima página
                    nearbyLastTimestamp = toilets.lastOrNull()?.let { /* extrair timestamp */ }

                    _toiletsNearbyIds.value = UiState.Success(
                        PageResponse(
                            items = toilets.map { it.publicId },
                            hasMore = toilets.size == 20
                        )
                    )
                }
                is Result.Failure -> {
                    _toiletsNearbyIds.value = UiState.Error(result.exception.message ?: "Unknown error")
                }
            }
        }
    }

    fun loadMoreToiletsNearby() {
        val currentLocation = _location.value ?: return
        val currentState = _toiletsNearbyIds.value

        if (currentState !is UiState.Success || !currentState.data.hasMore) return

        viewModelScope.launch {
            when (val result = toiletRepository.getToiletsByProximity(
                currentLocation.latitude,
                currentLocation.longitude,
                page = 0,  // Com timestamp, page sempre 0
                size = 20,
                timestamp = nearbyLastTimestamp
            )) {
                is Result.Success -> {
                    val toilets = result.data

                    // Atualizar cache
                    _toiletsCache.value = _toiletsCache.value + toilets.associateBy { it.publicId }

                    // Atualizar timestamp
                    nearbyLastTimestamp = toilets.lastOrNull()?.let { /* extrair timestamp */ }

                    // Adicionar IDs à lista existente
                    val currentIds = currentState.data.items
                    _toiletsNearbyIds.value = UiState.Success(
                        PageResponse(
                            items = currentIds + toilets.map { it.publicId },
                            hasMore = toilets.size == 20
                        )
                    )
                }
                is Result.Failure -> {
                    // Manter estado atual em caso de erro
                }
            }
        }
    }

    fun loadToiletComments(toiletPublicId: String) {
        viewModelScope.launch {
            when (val result = commentRepository.getCommentsByToilet(
                toiletPublicId,
                page = 0,
                size = 20,
                timestamp = null
            )) {
                is Result.Success -> {
                    _commentsToilet.value = result.data
                    commentsLastTimestamp = result.data.lastOrNull()?.createdAt
                }
                is Result.Failure -> {
                    _commentsToilet.value = emptyList()
                }
            }
        }
    }

    fun loadMyComments() {
        viewModelScope.launch {
            when (val result = commentRepository.getMyComments(
                page = 0,
                size = 20,
                timestamp = null
            )) {
                is Result.Success -> {
                    _myComments.value = result.data
                }
                is Result.Failure -> {
                    _myComments.value = emptyList()
                }
            }
        }
    }

    fun reactToComment(commentPublicId: String, react: String) {
        viewModelScope.launch {
            when (val result = commentRepository.reactToComment(commentPublicId, react)) {
                is Result.Success -> {
                    // Atualizar comment na lista local com nova contagem
                    val updatedComment = result.data
                    _commentsToilet.value = _commentsToilet.value.map {
                        if (it.publicId == updatedComment.publicId) updatedComment else it
                    }
                }
                is Result.Failure -> {
                    // Tratar erro
                }
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
            _ratingState.value = commentRepository.createComment(
                toiletPublicId, text, clean, paper, structure, accessibility
            )
        }
    }
}

data class PageResponse<T>(
    val items: List<T>,
    val hasMore: Boolean
)

sealed class UiState<out T> {
    object Idle : UiState<Nothing>()
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val message: String) : UiState<Nothing>()
}
```

---

### **FASE 6: Atualização de Screens (UI)**

Todas as telas precisam ser atualizadas para refletir as mudanças nos ViewModels e Models.

#### 6.1. LoginScreen.kt

**Mudanças:**

- LoginResponse agora inclui User
- Após login bem-sucedido, user já está disponível
- Navegar para tela principal automaticamente

**Arquivo:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/LoginScreen.kt`

**Linha 91** - Alterar lógica de sucesso:

```kotlin
// ANTIGO:
LaunchedEffect(loginState) {
    if (loginState is Result.Success) {
        val user = (loginState as Result.Success).data
        userViewModel.saveUser(user)  // REMOVER
        navController.navigate(AppGraph.MainGraph.route) {
            popUpTo(AppGraph.AuthGraph.route) { inclusive = true }
        }
    }
}

// NOVO:
LaunchedEffect(loginState) {
    if (loginState is Result.Success) {
        // User já está salvo no TokenManager e será carregado por UserViewModel
        navController.navigate(AppGraph.MainGraph.route) {
            popUpTo(AppGraph.AuthGraph.route) { inclusive = true }
        }
        authViewModel.clearLoginState()
    }
}
```

#### 6.2. RegisterScreen.kt

**Mudanças:**

- Após registro, mostrar mensagem para verificar email
- Não fazer login automático

**Arquivo:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/RegisterScreen.kt`

**Adicionar diálogo de sucesso:**

```kotlin
// Após linha 295
LaunchedEffect(registerState) {
    if (registerState is Result.Success) {
        // Mostrar diálogo informando para verificar email
        showSuccessDialog = true
    }
}

// Dialog
if (showSuccessDialog) {
    AlertDialog(
        onDismissRequest = {
            showSuccessDialog = false
            navController.navigate(AppGraph.AuthGraph.Login) {
                popUpTo(AppGraph.AuthGraph.Register) { inclusive = true }
            }
        },
        title = { Text("Registro realizado!") },
        text = { Text("Verifique seu email para ativar sua conta antes de fazer login.") },
        confirmButton = {
            Button(onClick = {
                showSuccessDialog = false
                navController.navigate(AppGraph.AuthGraph.Login) {
                    popUpTo(AppGraph.AuthGraph.Register) { inclusive = true }
                }
            }) {
                Text("OK")
            }
        }
    )
}
```

#### 6.3. ProfileScreen.kt

**Mudanças:**

- User sempre vem de UserViewModel.user (busca de API)
- Remover referências a userId Int, usar publicId String
- Carregar comentários via `/comment/user/self`

**Arquivo:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/ProfileScreen.kt`

**Linhas 99-104** - Atualizar:

```kotlin
// ANTIGO:
val user by userViewModel.user.collectAsState()
val userId = user?.id ?: return  // Int

// NOVO:
val user by userViewModel.user.collectAsState()
val currentUser = user ?: return  // Se null, não renderizar

// Carregar comentários
LaunchedEffect(currentUser.publicId) {
    localViewModel.loadMyComments()  // Não precisa mais passar userId
}
```

#### 6.4. HistoryScreen.kt - **REMOVER COMPLETAMENTE**

**Decisão:** A tela de histórico será removida da aplicação.

**Motivo:**

- Nova API não possui endpoint para histórico de toilets visitados
- Funcionalidade não é essencial para o app
- Usuário pode ver seus comentários na tela de Profile

**Arquivo a DELETAR:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/HistoryScreen.kt`

**Mudanças necessárias:**

1. Remover rota `MainGraph.History` de Route.kt
2. Remover item "History" do BottomNavigationBar
3. Remover composable de HistoryScreen de Navigation.kt
4. Atualizar MainNavigationGraph para ter apenas 2 itens na bottom bar (Home e Profile)

#### 6.5. ToiletDetailScreen.kt

**Mudanças:**

- Aceitar `publicId: String` em vez de `id: Int`
- Atualizar lógica de navegação
- Buscar toilet por UUID

**Arquivo:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/ToiletDetailScreen.kt`

**Linha 177-185** - Atualizar:

```kotlin
// ANTIGO:
@Composable
fun ToiletDetailScreen(
    toiletId: Int,  // MUDAR PARA String
    ...
)

// NOVO:
@Composable
fun ToiletDetailScreen(
    toiletPublicId: String,  // UUID
    navController: NavHostController,
    localViewModel: LocalViewModel = hiltViewModel(),
    userViewModel: UserViewModel = hiltViewModel()
) {
    val toilet = localViewModel.toiletsCache.collectAsState().value[toiletPublicId]

    LaunchedEffect(toiletPublicId) {
        // Registrar visualização
        localViewModel.viewToilet(toiletPublicId)

        // Carregar comentários
        localViewModel.loadToiletComments(toiletPublicId)
    }

    // Resto da UI...
}
```

#### 6.6. RatingScreen.kt

**Mudanças:**

- Receber `toiletPublicId: String`
- Não mais requer user object - autenticação via JWT

**Arquivo:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/RatingScreen.kt`

**Linha 276** - Atualizar:

```kotlin
// ANTIGO:
fun RatingScreen(toiletId: Int, ...)

// NOVO:
fun RatingScreen(toiletPublicId: String, ...)

// Submissão
Button(onClick = {
    localViewModel.submitRating(
        toiletPublicId = toiletPublicId,
        text = commentText.ifBlank { null },
        clean = cleanRating,
        paper = paperAvailable,
        structure = structureRating,
        accessibility = accessibilityRating
    )
}) {
    Text("Enviar avaliação")
}
```

#### 6.7. HomeScreen.kt

**Mudanças:**

- Mapa exibe toilets com publicId (UUID)
- Ao clicar, navegar com publicId em vez de id Int

**Arquivo:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/HomeScreen.kt`

**Atualizar navegação:**

```kotlin
// Ao clicar em toilet no mapa
OpenStreetMapsView(
    toilets = nearbyToilets,
    onMarkerClick = { toilet ->
        navController.navigate(
            BottomSheetGraph.ToiletDetail.createRoute(toilet.publicId)  // UUID
        )
    }
)
```

#### 6.8. SettingsScreen.kt

**Mudanças:**

- User vem de UserViewModel (API)
- Atualizar com novos campos (birthDate pode ser editado)

**Arquivo:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/SettingsScreen.kt`

**Linha 388** - Garantir user não é null:

```kotlin
val user by userViewModel.user.collectAsState()
val currentUser = user ?: run {
    // Mostrar loading ou redirecionar para login
    return
}

// Editar perfil
userViewModel.updateUser(
    name = newName,
    icon = selectedIcon,
    birthDate = newBirthDate  // ISO 8601
)
```

#### 6.9. Components - ToiletReview.kt, CommentToilet.kt

**Mudanças:**

- Aceitar Comment com UUID
- Botões like/dislike agora são idempotentes

**Arquivos:**

- `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/components/ToiletReview.kt`
- `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/components/CommentToilet.kt`

**Atualizar reações:**

```kotlin
// ThumbUp button
IconButton(
    onClick = {
        localViewModel.reactToComment(
            commentPublicId = comment.publicId,
            react = "like"
        )
    }
) {
    // Icon
}

// ThumbDown button
IconButton(
    onClick = {
        localViewModel.reactToComment(
            commentPublicId = comment.publicId,
            react = "dislike"
        )
    }
) {
    // Icon
}
```

---

### **FASE 7: Navegação**

#### 7.1. Route.kt

**Atualizar rotas para aceitar UUID:**

**Arquivo:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/navegation/Route.kt`

```kotlin
object BottomSheetGraph {
    const val ROUTE = "bottom_sheet_graph"

    object ToiletDetail {
        const val route = "toilet_detail/{publicId}"
        const val arg = "publicId"

        fun createRoute(publicId: String) = "toilet_detail/$publicId"
    }

    object ToiletList {
        const val route = "toilet_list"
    }
}

object RatingGraph {
    const val ROUTE = "rating_graph"

    object Rating {
        const val route = "rating/{publicId}"
        const val arg = "publicId"

        fun createRoute(publicId: String) = "rating/$publicId"
    }
}
```

#### 7.2. Navigation.kt

**Atualizar NavGraphs:**

**Arquivo:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/navegation/Navigation.kt`

**MUDANÇA CRÍTICA: Auth check no RootNavigationGraph**

```kotlin
@Composable
fun RootNavigationGraph(
    navController: NavHostController,
    userViewModel: UserViewModel
) {
    val isLoggedIn by userViewModel.isLoggedIn.collectAsState()

    // Determinar rota inicial baseada em autenticação
    val startDestination = if (isLoggedIn) {
        AppGraph.MainGraph.route
    } else {
        AppGraph.AuthGraph.route
    }

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        // Auth graph (login/register)
        authNavGraph(navController, userViewModel)

        // Main graph - REQUER AUTENTICAÇÃO
        navigation(
            startDestination = MainGraph.Home.route,
            route = AppGraph.MainGraph.route
        ) {
            // Verificar auth em TODOS os destinos do MainGraph
            composable(MainGraph.Home.route) {
                if (!isLoggedIn) {
                    LaunchedEffect(Unit) {
                        navController.navigate(AppGraph.AuthGraph.route) {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                    return@composable
                }
                HomeScreen(navController)
            }

            composable(MainGraph.Profile.route) {
                if (!isLoggedIn) {
                    LaunchedEffect(Unit) {
                        navController.navigate(AppGraph.AuthGraph.route) {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                    return@composable
                }
                ProfileScreen(navController)
            }
        }

        // Toilet details - REQUER AUTENTICAÇÃO
        composable(
            route = BottomSheetGraph.ToiletDetail.route,
            arguments = listOf(navArgument(BottomSheetGraph.ToiletDetail.arg) {
                type = NavType.StringType
            })
        ) { backStackEntry ->
            val publicId = backStackEntry.arguments?.getString(BottomSheetGraph.ToiletDetail.arg)
                ?: return@composable

            if (!isLoggedIn) {
                LaunchedEffect(Unit) {
                    navController.navigate(AppGraph.AuthGraph.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
                return@composable
            }

            ToiletDetailScreen(
                toiletPublicId = publicId,
                navController = navController
            )
        }

        // Rating - REQUER AUTENTICAÇÃO
        composable(
            route = RatingGraph.Rating.route,
            arguments = listOf(navArgument(RatingGraph.Rating.arg) {
                type = NavType.StringType
            })
        ) { backStackEntry ->
            val publicId = backStackEntry.arguments?.getString(RatingGraph.Rating.arg)
                ?: return@composable

            if (!isLoggedIn) {
                LaunchedEffect(Unit) {
                    navController.navigate(AppGraph.AuthGraph.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
                return@composable
            }

            RatingScreen(
                toiletPublicId = publicId,
                navController = navController
            )
        }

        // Settings - REQUER AUTENTICAÇÃO
        settingsNavGraph(navController, userViewModel)

        // Report - REQUER AUTENTICAÇÃO
        reportNavGraph(navController)
    }
}
```

**Remover auth checks individuais das telas:**

- Antes: Cada tela verificava autenticação
- Depois: Auth check centralizado no NavGraph

---

### **FASE 8: Gradle Dependencies**

#### 8.1. build.gradle (app module)

**Adicionar dependências:**

```gradle
dependencies {
    // Existing dependencies...

    // EncryptedSharedPreferences
    implementation "androidx.security:security-crypto:1.1.0-alpha06"

    // JWT Decode (opcional, para verificar expiração local)
    implementation "com.auth0.android:jwtdecode:2.0.2"

    // Atualizar Retrofit se necessário
    implementation "com.squareup.retrofit2:retrofit:2.9.0"
    implementation "com.squareup.retrofit2:converter-gson:2.9.0"
    implementation "com.squareup.okhttp3:logging-interceptor:4.11.0"
}
```

---

## Inventário Completo de Componentes e Telas

### **TELAS (Screens) - Total: 11 arquivos**

#### ✅ Telas que DEVEM ser atualizadas

1. **LoginScreen.kt** - Fluxo de autenticação JWT, salvar tokens, remover saveUser
2. **RegisterScreen.kt** - Adicionar dialog de verificação de email, não fazer login automático
3. **ProfileScreen.kt** - Buscar user de API, usar `/comment/user/self`, remover userId
4. **HomeScreen.kt** - Mapear toilets por UUID, navegar com publicId, atualizar markers
5. **ToiletListScreen.kt** - Exibir toilets com publicId (UUID), paginação com timestamp
6. **ToiletDetailScreen.kt** - Receber publicId String, carregar comentários por UUID, registrar view
7. **RatingScreen.kt** - Receber toiletPublicId String, remover dependência de user object
8. **ReportScreen.kt** - Atualizar para usar publicIds, autenticação via JWT
9. **SettingsScreen.kt** - User de API, atualizar perfil com PATCH /user/self
10. **ChangeSettingsScreen.kt** - Usar endpoints /user/self, validar com senha
11. **ConfirmationScreen.kt** - Manter funcionamento atual, validar contextos de uso

#### ❌ Telas que serão REMOVIDAS

12. **HistoryScreen.kt** - DELETAR (sem endpoint de histórico na nova API)

---

### **COMPONENTES (Components) - Total: 17 arquivos**

#### ✅ Componentes que DEVEM ser atualizados

**Componentes de Toilet:**

1. **LocationCard.kt** - Receber Toilet com publicId UUID, exibir dados atualizados
2. **ChipsToilet.kt** - Mapear TypeExtra objects (access.apiName, extras[].apiName)
3. **HistoryCard.kt** - DELETAR ou reutilizar (associado ao HistoryScreen removido)

**Componentes de Comentários:**
4. **CommentToilet.kt** - Comment com publicId UUID, reações via PUT idempotente
5. **ToiletReview.kt** - Comment com publicId, reactCounts embedded, user nested object
6. **ThumbUp.kt** - Chamar reactToComment(publicId, "like")
7. **ThumbDown.kt** - Chamar reactToComment(publicId, "dislike")

**Componentes de Rating:**
8. **RatingItem.kt** - Exibir rating do novo formato (ToiletRating object)
9. **Stars.kt** - Continua funcionando, mas verificar se recebe dados corretos

**Componentes de Navegação:**
10. **BottomNavigationBar.kt** - REMOVER item History, manter apenas Home e Profile

**Componentes de UI/Form:**
11. **NextTextField.kt** - Manter funcionamento atual
12. **GoTextField.kt** - Manter funcionamento atual
13. **ClickableTextField.kt** - Manter funcionamento atual
14. **CustomDatePickerDialog.kt** - Manter, mas validar formato ISO 8601 no output
15. **IconCarousel.kt** - Atualizar valores de ícones se necessário (icon-1 até icon-6, icon-default)

**Componentes de Loading/Feedback:**
16. **ProgressBar.kt** - Manter funcionamento atual
17. **LoadMoreCard.kt** - Adaptar para paginação com timestamp

**Componentes de Map:**
18. **OpenStreetMapsView.kt** - Receber List<Toilet> com publicId, markers devem usar UUID

**Componentes de Actions:**
19. **ReportButton.kt** - Passar publicId correto (toilet ou comment)
20. **CustomDragHandle.kt** - Manter funcionamento atual (bottom sheet)

---

### **NAVEGAÇÃO - Total: 2 arquivos**

1. **Route.kt** - Atualizar todas rotas com {id} para {publicId}, NavType.StringType
2. **Navigation.kt** - Atualizar todos composables, remover History route, auth checks

---

### **RESUMO DE IMPACTO POR CATEGORIA**

| Categoria    | Total Arquivos | Atualizar | Deletar | Manter |
| ------------ | -------------- | --------- | ------- | ------ |
| Screens      | 12             | 11        | 1       | 0      |
| Components   | 20             | 15        | 1       | 4      |
| Navigation   | 2              | 2         | 0       | 0      |
| **TOTAL UI** | **34**         | **28**    | **2**   | **4**  |

---

## Checklist de Arquivos Impactados

### **Críticos (DEVEM ser modificados)**

#### Network Layer

- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/network/RetrofitClient.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/network/AuthService.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/network/UserService.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/network/ToiletService.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/network/CommentService.kt`

#### Security (CRIAR)

- [ ] `app/src/main/java/com/worldoftoilets/app/security/TokenManager.kt` (NOVO)
- [ ] `app/src/main/java/com/worldoftoilets/app/security/TokenRepository.kt` (NOVO)
- [ ] `app/src/main/java/com/worldoftoilets/app/security/EncryptedTokenStorage.kt` (NOVO)
- [ ] `app/src/main/java/com/worldoftoilets/app/network/AuthInterceptor.kt` (NOVO)
- [ ] `app/src/main/java/com/worldoftoilets/app/network/TokenRefreshInterceptor.kt` (NOVO)

#### Models

- [ ] `app/src/main/java/com/worldoftoilets/app/models/User.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/models/Toilet.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/models/Comment.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/models/requests/LoginRequest.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/models/requests/RegisterRequest.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/models/responses/ApiResponse.kt`

#### Repositories

- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/repositories/UserPreferencesRepository.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/repositories/AuthRepository.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/repositories/UserRepository.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/repositories/ToiletRepository.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/repositories/CommentRepository.kt`

#### ViewModels

- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/viewmodel/UserViewModel.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/viewmodel/AuthViewModel.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/viewmodel/LocalViewModel.kt`

#### Dependency Injection

- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/di/DataStoreModule.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/di/SecurityModule.kt` (NOVO)

#### UI Screens

- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/LoginScreen.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/RegisterScreen.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/ProfileScreen.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/HomeScreen.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/ToiletDetailScreen.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/ToiletListScreen.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/RatingScreen.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/ReportScreen.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/SettingsScreen.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/ChangeSettingsScreen.kt`
- [ ] `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/ConfirmationScreen.kt`
- [ ] ❌ **DELETAR:** `/home/nycocado/dev/projects/worldoftoilets/apps/app/app/src/main/java/com/worldoftoilets/app/ui/screens/HistoryScreen.kt`

#### UI Components - Toilets

- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/LocationCard.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/ChipsToilet.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/OpenStreetMapsView.kt`
- [ ] ❌ **DELETAR:** `app/src/main/java/com/worldoftoilets/app/ui/components/HistoryCard.kt`

#### UI Components - Comentários

- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/CommentToilet.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/ToiletReview.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/ThumbUp.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/ThumbDown.kt`

#### UI Components - Rating

- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/RatingItem.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/Stars.kt`

#### UI Components - Navegação

- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/BottomNavigationBar.kt`

#### UI Components - Forms

- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/NextTextField.kt` (verificar)
- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/GoTextField.kt` (verificar)
- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/ClickableTextField.kt` (verificar)
- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/CustomDatePickerDialog.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/IconCarousel.kt`

#### UI Components - Loading/Feedback

- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/ProgressBar.kt` (verificar)
- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/LoadMoreCard.kt`

#### UI Components - Actions

- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/ReportButton.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/ui/components/CustomDragHandle.kt` (verificar)

#### Navigation

- [ ] `app/src/main/java/com/worldoftoilets/app/ui/navegation/Route.kt`
- [ ] `app/src/main/java/com/worldoftoilets/app/ui/navegation/Navigation.kt`

#### Build Files

- [ ] `app/build.gradle`

---

## Fluxos de Navegação Impactados

### 1. **Fluxo de Login**

**ANTES:**

1. Usuario insere email/senha → POST /auth/login
2. Recebe User object
3. Salva em DataStore (UserPreferencesRepository)
4. Navega para MainGraph

**DEPOIS:**

1. Usuario insere email/senha → POST /auth/login
2. Recebe LoginResponse { accessToken, refreshToken, user }
3. TokenManager salva tokens em EncryptedSharedPreferences
4. UserPreferencesRepository marca isLoggedIn = true
5. UserViewModel carrega user via GET /user/self
6. Navega para MainGraph

### 2. **Fluxo de Registro**

**ANTES:**

1. Usuario preenche formulário → POST /auth/register
2. Recebe ApiResponse
3. (Nenhum login automático, usuário deve fazer login manualmente)
4. Navega para LoginScreen

**DEPOIS:**

1. Usuario preenche formulário → POST /auth/register
2. Recebe sucesso (200)
3. **NOVO:** Mostra dialog informando para verificar email
4. Usuario deve verificar email antes de fazer login
5. Navega para LoginScreen

### 3. **Fluxo de Perfil**

**ANTES:**

1. Carrega user do DataStore (UserViewModel.user)
2. Exibe info (id, name, points, numComments)
3. Carrega comentários via GET /comments/users/{userId}
4. Logout limpa DataStore

**DEPOIS:**

1. Carrega user via GET /user/self (UserViewModel)
2. Exibe info (publicId, name, points, commentsCount, roles)
3. Carrega comentários via GET /comment/user/self (sem userId)
4. Logout:
   - Chama POST /auth/logout com refreshToken
   - TokenManager limpa tokens
   - UserPreferencesRepository limpa DataStore
   - Navega para LoginScreen

### 4. **Fluxo de Listagem de Toilets**

**ANTES:**

1. GET /toilets/nearby?lat=X&lon=Y&userId={userId}&page=0&size=20
2. Retorna List<Toilet> com id: Int
3. Cache em Map<Int, Toilet>
4. Navega para details passando id: Int

**DEPOIS:**

1. GET /toilet/proximity?lat=X&lng=Y&page=0&size=20&timestamp=null
2. Retorna List<Toilet> com publicId: String (UUID)
3. Cache em Map<String, Toilet>
4. Extrai timestamp do último item para próxima página
5. Navega para details passando publicId: String

### 5. **Fluxo de Comentários**

**ANTES:**

1. GET /comments/toilets/{toiletId}?userId={userId}
2. GET /comments/reactions?userId={userId}&commentIds=[ids]
3. POST /comments/reactions { commentId, userId, typeReaction }
4. DELETE /comments/reactions?commentId=X&userId=Y

**DEPOIS:**

1. GET /comment/toilet/{publicId}?page=0&size=20&timestamp=null
2. **Reações já vêm no Comment** (reactCounts: { likes, dislikes })
3. PUT /comment/{publicId}/react?react=like (idempotente)
   - Se já tem like, remove like
   - Se tem dislike, substitui por like
   - Se não tem reação, adiciona like
4. API retorna Comment atualizado com novas contagens

### 6. **Fluxo de Avaliação (Rating)**

**ANTES:**

1. Navega para RatingScreen(toiletId: Int)
2. Usuario preenche formulário
3. POST /comments { toiletId, userId, text, ratings... }
4. Retorna Comment criado
5. Volta para ToiletDetailScreen

**DEPOIS:**

1. Navega para RatingScreen(toiletPublicId: String)
2. Usuario preenche formulário
3. POST /comment { toiletPublicId, text?, rate: { clean, paper, structure, accessibility } }
4. **userId identificado via JWT automaticamente**
5. Retorna Comment criado
6. Volta para ToiletDetailScreen

### 7. **Fluxo de Acesso ao App (NOVA RESTRIÇÃO)**

**ANTES:**

1. App abre → Vai direto para HomeScreen (mapa)
2. Usuário pode navegar e ver toilets sem login
3. Login era opcional para interações (comentar, reagir)
4. Apenas ToiletDetailScreen verificava autenticação

**DEPOIS:**

1. App abre → Verifica isLoggedIn
2. Se NÃO logado → Redireciona para LoginScreen
3. Se logado → Vai para HomeScreen
4. **TODAS as telas requerem autenticação**
5. Auth check centralizado no RootNavigationGraph
6. Logout → Redireciona imediatamente para LoginScreen e limpa back stack

---

## Pontos de Atenção

### 1. **Expiração de Tokens**

- accessToken tem duração curta (ex: 15 min)
- refreshToken tem duração longa (ex: 7 dias)
- TokenRefreshInterceptor deve interceptar 401 e renovar automaticamente
- Se refreshToken expirar, usuário deve fazer login novamente

### 2. **Endpoints Públicos**

Não precisam de autenticação:

- POST /auth/login
- POST /auth/register
- POST /auth/verify-email
- POST /auth/resend-verification
- POST /auth/forgot-password
- POST /auth/reset-password

**AuthInterceptor deve ignorar esses endpoints.**

### 3. **Migração de UUIDs**

- Todos os IDs Int devem ser substituídos por String (UUID)
- Cache de toilets: `Map<Int, Toilet>` → `Map<String, Toilet>`
- Rotas de navegação: NavType.IntType → NavType.StringType
- Path parameters: `{id}` continua, mas valor é UUID

### 4. **Paginação com Timestamp**

- API usa `timestamp` query parameter opcional
- Se fornecido, retorna itens **criados antes ou no momento** do timestamp
- Combinar com page/size para controle de quantidade
- Extrair `createdAt` do último item para próxima página

### 5. **Histórico de Usuário**

- API antiga tinha GET /toilets/users/{userId}
- **Nova API não tem esse endpoint**
- Alternativas:
  1. Remover tela de histórico
  2. Inferir de comentários (GET /comment/user/self)
  3. Implementar tracking local com Room Database

### 6. **Reações Idempotentes**

- PUT /comment/{id}/react?react=like
- **Comportamento:**
  - Se não tem reação: adiciona like
  - Se já tem like: remove like (toggle)
  - Se tem dislike: substitui por like
- Atualizar UI imediatamente com resposta da API

### 7. **Email Verification**

- Após registro, usuário DEVE verificar email
- Login falha se email não verificado (401)
- Implementar fluxo de reenvio de email (POST /auth/resend-verification)

### 8. **Roles e Permissões**

- User agora tem campo `roles: List<Role>`
- Cada Role tem permissões associadas
- UI pode mostrar/ocultar features baseado em roles
- Exemplos: comments-user, toilets-administrator, partner

### 9. **Controle de Acesso Global**

- **MUDANÇA CRÍTICA**: Login obrigatório para acesso ao app
- RootNavigationGraph verifica `isLoggedIn` antes de renderizar qualquer tela
- Se usuário não estiver logado, redireciona para AuthGraph
- Telas não precisam mais verificar autenticação individualmente
- HomeScreen (mapa) agora requer autenticação - antes era público
- Auth check acontece em um único ponto (Navigation.kt)
- Melhora UX: evita flash de conteúdo antes de redirecionar para login

---

## Referências Rápidas da API

### Documentação Swagger

**URL:** `http://localhost/api/docs-json`

### Endpoints Principais

- **Auth:** POST /auth/login, POST /auth/register, POST /auth/refresh, POST /auth/logout
- **User:** GET /user/self, PATCH /user/self, DELETE /user/self
- **Toilet:** GET /toilet/proximity, GET /toilet/bounding-box, GET /toilet/{publicId}
- **Comment:** GET /comment/toilet/{publicId}, GET /comment/user/self, POST /comment, PUT /comment/{id}/react

### Tipos Importantes

```kotlin
data class LoginResponse(accessToken: String, refreshToken: String, user: User)
data class User(publicId: String, name: String, email: String?, roles: List<Role>, ...)
data class Toilet(publicId: String, name: String, latitude: Double, longitude: Double, ...)
data class Comment(publicId: String, text: String?, rate: CommentRate, reactCounts: ReactCounts, ...)
```

### Exemplo de Paginação com Timestamp

```kotlin
GET /toilet/proximity?lat=38.7&lng=-9.1&page=0&size=20&timestamp=2025-11-14T10:30:00Z
```

---

**Data do Plano:** 2025-11-26
**Versão:** 1.0
**Status:** PRONTO PARA EXECUÇÃO
