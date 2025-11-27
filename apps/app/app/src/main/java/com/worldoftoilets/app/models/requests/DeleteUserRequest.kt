package com.worldoftoilets.app.models.requests

import com.google.gson.annotations.SerializedName

data class DeleteUserRequest(
    @SerializedName("password") val password: String
)
