package com.worldoftoilets.app.security

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CsrfTokenManager @Inject constructor() {
    private var csrfToken: String? = null

    fun setCsrfToken(token: String) {
        this.csrfToken = token
    }

    fun getCsrfToken(): String? {
        return csrfToken
    }

    fun clearCsrfToken() {
        csrfToken = null
    }
}
