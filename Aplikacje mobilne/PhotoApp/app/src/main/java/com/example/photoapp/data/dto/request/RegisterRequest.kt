package com.example.photoapp.data.dto.request

import com.google.gson.annotations.SerializedName

data class RegisterRequest(
    @SerializedName("username") var username: String,
    @SerializedName("email") var email: String,
    @SerializedName("password") var password: String,
)
