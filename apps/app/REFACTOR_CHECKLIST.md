# Checklist de Refatoração - Think Toilet Android App

**Status Geral:** 🟢 FASE 1-8 CONCLUÍDAS (81/84)

**Última Atualização:** 2025-11-26

---

## FASE 1: Infraestrutura de Autenticação JWT ✅ COMPLETA

### Security Layer (CRIAR NOVOS ARQUIVOS)

- [x] `app/src/main/java/com/worldoftoilets/app/security/TokenManager.kt` ✅
- [x] `app/src/main/java/com/worldoftoilets/app/security/TokenRepository.kt` ✅
- [x] `app/src/main/java/com/worldoftoilets/app/security/EncryptedTokenStorage.kt` ✅
- [x] `app/src/main/java/com/worldoftoilets/app/network/AuthInterceptor.kt` ✅
- [x] `app/src/main/java/com/worldoftoilets/app/network/TokenRefreshInterceptor.kt` ✅

### Network Layer

- [ ] AuthService.kt - Reescrever endpoints
- [ ] UserService.kt - Atualizar para /user/self
- [ ] ToiletService.kt - UUID + novos paths
- [ ] CommentService.kt - UUID + idempotência

### Dependency Injection

- [x] DataStoreModule.kt - Simplificar
- [x] SecurityModule.kt (NOVO) - EncryptedSharedPreferences + TokenManager ✅

### Build Configuration

- [x] libs.versions.toml - Adicionar jwt-decode e androidx-security-crypto ✅
- [x] build.gradle.kts - Adicionar dependências ✅

---

## FASE 2: Models ✅ COMPLETA

### Core Models

- [x] User.kt - publicId UUID, roles, novos campos ✅
- [x] Toilet.kt - publicId UUID, nested objects (Access, TypeExtra, ToiletRating) ✅
- [x] Comment.kt - publicId UUID, nested objects (CommentRate, ReactCounts, UserCommentResponse) ✅

### Request/Response DTOs

- [x] LoginRequest.kt ✅
- [x] LoginResponse.kt (NOVO) ✅
- [x] RegisterRequest.kt ✅
- [x] RefreshTokenResponse.kt (NOVO) ✅
- [x] UpdateUserRequest.kt (NOVO) ✅
- [x] DeleteUserRequest.kt (NOVO) ✅
- [x] CreateCommentRequest.kt (NOVO) ✅
- [x] UpdateCommentRequest.kt (NOVO) ✅
- [x] CommentRateRequest.kt (NOVO) ✅
- [x] CreateToiletRequest.kt (NOVO) ✅
- [x] Role.kt (NOVO) ✅
- [x] Access.kt (NOVO) ✅
- [x] ToiletRating.kt (NOVO) ✅

---

## FASE 3: Services ✅ COMPLETA

- [x] AuthService.kt - novos endpoints (refresh, logout, verify-email, resend-verification) ✅
- [x] UserService.kt - simplificado para apenas /user/self endpoints ✅
- [x] ToiletService.kt - UUID publicId, novos paths ✅
- [x] CommentService.kt - UUID publicId, reações idempotentes ✅

---

## FASE 4: Repositories ✅ COMPLETA

- [x] UserPreferencesRepository.kt - Simplificado (apenas isLoggedIn) ✅
- [x] AuthRepository.kt - Login/register/logout com TokenManager ✅
- [x] UserRepository.kt - Apenas endpoints /user/self ✅
- [x] ToiletRepository.kt - UUID + timestamp pagination ✅
- [x] CommentRepository.kt - UUID + reações idempotentes ✅

---

## FASE 5: ViewModels ✅ COMPLETA

- [x] UserViewModel.kt - Buscar user de API, remover DataStore ✅
- [x] AuthViewModel.kt - Lidar com tokens ✅
- [x] LocalViewModel.kt - Map<String, Toilet>, timestamp pagination, reações idempotentes ✅

---

## FASE 6: UI Screens ✅ COMPLETA

### Telas Atualizadas ✅

- [x] LoginScreen.kt - Remover saveUser, JWT flow ✅
- [x] RegisterScreen.kt - Dialog de verificação de email ✅
- [x] ProfileScreen.kt - /comment/user/self, publicId ✅
- [x] HomeScreen.kt - publicId navigation ✅
- [x] ToiletListScreen.kt - UUID, timestamp pagination ✅
- [x] ToiletDetailScreen.kt - publicId String param ✅
- [x] RatingScreen.kt - toiletPublicId String, sem user object ✅
- [x] ReportScreen.kt - publicId, JWT auth ✅
- [x] SettingsScreen.kt - PATCH /user/self ✅
- [x] ChangeSettingsScreen.kt - /user/self endpoints ✅
- [x] ConfirmationScreen.kt - Validar contextos ✅

### Telas Deletadas ✅

- [x] ❌ HistoryScreen.kt - DELETAR ✅

---

## FASE 7: UI Components ✅ COMPLETA

### Toilets

- [x] LocationCard.kt - publicId UUID ✅
- [x] ChipsToilet.kt - TypeExtra objects ✅
- [x] OpenStreetMapsView.kt - publicId markers ✅
- [x] ❌ HistoryCard.kt - DELETADO ✅

### Comentários

- [x] CommentToilet.kt - publicId, PUT react ✅
- [x] ToiletReview.kt - publicId, reactCounts ✅
- [x] ThumbUp.kt - reactToComment(publicId, "like") ✅
- [x] ThumbDown.kt - reactToComment(publicId, "dislike") ✅

### Rating

- [x] RatingItem.kt - ToiletRating object ✅
- [x] Stars.kt - Validar dados ✅

### Navegação

- [x] BottomNavigationBar.kt - Remover History ✅

### Forms

- [x] NextTextField.kt - ✅ Manter
- [x] GoTextField.kt - ✅ Manter
- [x] ClickableTextField.kt - ✅ Manter
- [x] CustomDatePickerDialog.kt - ISO 8601 output ✅
- [x] IconCarousel.kt - Validar icon values ✅

### Loading/Feedback

- [x] ProgressBar.kt - ✅ Manter
- [x] LoadMoreCard.kt - Timestamp pagination ✅

### Actions

- [x] ReportButton.kt - publicId ✅
- [x] CustomDragHandle.kt - ✅ Manter

---

## FASE 8: Navegação ✅ COMPLETA

- [x] Route.kt - {id} → {publicId}, NavType.StringType ✅
- [x] Navigation.kt - Atualizar composables, remover History, auth checks ✅

---

## FASE 9: Testes e Validação

- [ ] Teste de build
- [ ] Testes de integração
- [ ] Teste end-to-end dos fluxos principais

---

## Contadores de Progresso

| Fase      | Total  | Concluído | Pendente | %       |
| --------- | ------ | --------- | -------- | ------- |
| FASE 1    | 11     | 11        | 0        | 100% ✅  |
| FASE 2    | 13     | 13        | 0        | 100% ✅  |
| FASE 3    | 4      | 4         | 0        | 100% ✅  |
| FASE 4    | 5      | 5         | 0        | 100% ✅  |
| FASE 5    | 3      | 3         | 0        | 100% ✅  |
| FASE 6    | 11     | 11        | 0        | 100% ✅  |
| FASE 7    | 19     | 19        | 0        | 100% ✅  |
| FASE 8    | 2      | 2         | 0        | 100% ✅  |
| FASE 9    | 3      | 0         | 3        | 0%      |
| **TOTAL** | **71** | **81**    | **3**    | **96%** |

---

## Notas de Progresso

### Data: 2025-11-26

**FASE 1 - INFRAESTRUTURA JWT (100% ✅)**
- ✅ TokenManager.kt criado
- ✅ TokenRepository.kt criado
- ✅ EncryptedTokenStorage.kt criado
- ✅ AuthInterceptor.kt criado
- ✅ TokenRefreshInterceptor.kt criado
- ✅ SecurityModule.kt (DI) criado
- ✅ libs.versions.toml atualizado
- ✅ build.gradle.kts atualizado

**FASE 2 - MODELS (100% ✅)**
- ✅ User.kt refatorado (publicId UUID, roles, novos campos)
- ✅ Toilet.kt refatorado (publicId UUID, Access, TypeExtra, ToiletRating)
- ✅ Comment.kt refatorado (publicId UUID, CommentRate, ReactCounts)
- ✅ 10 novos DTOs criados (LoginResponse, RefreshTokenResponse, etc)

**FASE 3 - SERVICES (100% ✅)**
- ✅ AuthService.kt atualizado (refresh, logout, verify-email, etc)
- ✅ UserService.kt simplificado (/user/self endpoints)
- ✅ ToiletService.kt atualizado (UUID, /toilet/proximity, /toilet/bounding-box)
- ✅ CommentService.kt atualizado (UUID, reações idempotentes)

**FASE 4 - REPOSITORIES (100% ✅)**
- ✅ UserPreferencesRepository.kt simplificado (apenas isLoggedIn)
- ✅ AuthRepository.kt com TokenManager e logout
- ✅ UserRepository.kt com endpoints /user/self
- ✅ ToiletRepository.kt com UUID e timestamp pagination
- ✅ CommentRepository.kt com UUID e reações idempotentes

**FASE 5 - VIEWMODELS (100% ✅)**
- ✅ AuthViewModel.kt atualizado (login/register com JWT)
- ✅ UserViewModel.kt refatorado (buscar user de API)
- ✅ LocalViewModel.kt refatorado (UUID, timestamp pagination, reações)

**FASE 6 - UI SCREENS (100% ✅)**
- ✅ LoginScreen.kt refatorado (JWT flow, removido saveUser)
- ✅ RegisterScreen.kt atualizado (novo DTO, email verification)
- ✅ ProfileScreen.kt refatorado (publicId, /comment/user/self)
- ✅ HomeScreen.kt atualizado (String publicId, removed History)
- ✅ ToiletDetailScreen.kt refatorado (String toiletId, removido reactions/users maps)
- ✅ RatingScreen.kt atualizado (String toiletPublicId, simplificado)
- ✅ ReportScreen.kt refatorado (String IDs, removido reportStateFlow)
- ✅ SettingsScreen.kt atualizado (updateUserStateFlow)
- ✅ ChangeSettingsScreen.kt refatorado (updateUserStateFlow, novas callbacks)
- ✅ ConfirmationScreen.kt validado

**FASE 7 - UI COMPONENTS (100% ✅)**
- ✅ LocationCard.kt - Atualizado para String publicId
- ✅ CommentToilet.kt - Refatorado com novo Comment model
- ✅ OpenStreetMapsView.kt - Markers com String publicIds
- ✅ ToiletReview.kt - Atualizado com createdAt e reactCounts
- ✅ ChipsToilet.kt - Mapeamento de TypeExtra API para enum
- ✅ CustomDatePickerDialog.kt - Formato ISO 8601
- ✅ BottomNavigationBar.kt - Atualizado parâmetro isLoggedInStateFlow
- ✅ Componentes validados: ThumbUp, ThumbDown, RatingItem, Stars, LoadMoreCard, ReportButton, CustomDragHandle
- ✅ HistoryCard.kt - Deletado

**FASE 8 - NAVEGAÇÃO (100% ✅)**
- ✅ Route.kt - Convertido Int IDs para String publicIds
- ✅ Navigation.kt - Atualizadas todas as funções de navegação
- ✅ Removido History route e navigation
- ✅ Atualizadas callbacks para novo padrão de autenticação

---

**Para marcar item como concluído:** Troque `- [ ]` por `- [x]`
**Consultar plano completo:** Veja `REFACTOR_PLAN.md` na raiz do projeto
