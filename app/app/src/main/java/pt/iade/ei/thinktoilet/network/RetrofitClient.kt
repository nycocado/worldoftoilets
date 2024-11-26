package pt.iade.ei.thinktoilet.network

import okhttp3.HttpUrl
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.logging.HttpLoggingInterceptor
import pt.iade.ei.thinktoilet.BuildConfig
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient{
    private const val BASE_URL = "https://think-toilet-production.up.railway.app/api/"
    private val API_KEY = BuildConfig.API_KEY

    class ApiKeyInterceptor(private val apiKey: String) : Interceptor {
        override fun intercept(chain: Interceptor.Chain): Response {
            val originalRequest: Request = chain.request()

            val url: HttpUrl = originalRequest.url.newBuilder()
                .addQueryParameter("API_KEY", apiKey)
                .build()

            val newRequest: Request = originalRequest.newBuilder()
                .url(url)
                .build()

            return chain.proceed(newRequest)
        }
    }

    private val httpClient = OkHttpClient.Builder()
        .addInterceptor(ApiKeyInterceptor(API_KEY))
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .build()

    val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .client(httpClient)
        .build()
}