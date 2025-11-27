package com.worldoftoilets.app.di

import android.content.Context
import android.content.SharedPreferences
import com.worldoftoilets.app.BuildConfig
import com.worldoftoilets.app.network.AuthInterceptor
import com.worldoftoilets.app.network.AuthService
import com.worldoftoilets.app.network.CommentService
import com.worldoftoilets.app.network.ToiletService
import com.worldoftoilets.app.network.TokenRefreshInterceptor
import com.worldoftoilets.app.network.UserService
import com.worldoftoilets.app.security.EncryptedTokenStorage
import com.worldoftoilets.app.security.TokenManager
import com.worldoftoilets.app.security.TokenRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Provider
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object SecurityModule {

    @Provides
    @Singleton
    fun provideSharedPreferences(
        @ApplicationContext context: Context
    ): SharedPreferences {
        return context.getSharedPreferences("secure_prefs", Context.MODE_PRIVATE)
    }

    @Provides
    @Singleton
    fun provideTokenRepository(
        @ApplicationContext context: Context,
        sharedPreferences: SharedPreferences
    ): TokenRepository = EncryptedTokenStorage(context, sharedPreferences)

    @Provides
    @Singleton
    fun provideTokenManager(
        tokenRepository: TokenRepository
    ): TokenManager = TokenManager(tokenRepository)

    @Provides
    @Singleton
    fun provideAuthInterceptor(tokenManager: TokenManager): AuthInterceptor {
        return AuthInterceptor(tokenManager)
    }

    @Provides
    @Singleton
    fun provideTokenRefreshInterceptor(
        tokenManager: TokenManager,
        authServiceProvider: Provider<AuthService>
    ): TokenRefreshInterceptor {
        return TokenRefreshInterceptor(tokenManager, authServiceProvider)
    }

    @Provides
    @Singleton
    fun provideOkHttpClient(
        authInterceptor: AuthInterceptor,
        tokenRefreshInterceptor: TokenRefreshInterceptor
    ): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(tokenRefreshInterceptor)
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BuildConfig.API_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .client(okHttpClient)
            .build()
    }

    @Provides
    @Singleton
    fun provideAuthService(retrofit: Retrofit): AuthService {
        return retrofit.create(AuthService::class.java)
    }

    @Provides
    @Singleton
    fun provideUserService(retrofit: Retrofit): UserService {
        return retrofit.create(UserService::class.java)
    }

    @Provides
    @Singleton
    fun provideToiletService(retrofit: Retrofit): ToiletService {
        return retrofit.create(ToiletService::class.java)
    }

    @Provides
    @Singleton
    fun provideCommentService(retrofit: Retrofit): CommentService {
        return retrofit.create(CommentService::class.java)
    }
}
