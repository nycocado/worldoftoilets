package com.worldoftoilets.app.network

import com.worldoftoilets.app.security.CsrfTokenManager
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject

class CsrfInterceptor @Inject constructor(
    private val csrfTokenManager: CsrfTokenManager
) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val method = request.method
        if (method == "POST" || method == "PUT" || method == "PATCH" || method == "DELETE") {
            val token = csrfTokenManager.getCsrfToken()
            if (token != null) {
                val newRequest = request.newBuilder()
                    .header("x-csrf-token", token)
                    .build()
                return chain.proceed(newRequest)
            }
        }
        return chain.proceed(request)
    }
}
