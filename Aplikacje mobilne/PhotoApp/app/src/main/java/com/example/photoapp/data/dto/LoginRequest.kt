package com.example.photoapp.data.dto

import com.google.gson.annotations.SerializedName

data class LoginRequest(
    @SerializedName("email") var email: String,
    @SerializedName("password") var password: String,
)
