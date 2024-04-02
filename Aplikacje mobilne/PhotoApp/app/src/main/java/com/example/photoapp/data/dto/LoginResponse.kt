package com.example.photoapp.data.dto

import com.google.gson.annotations.SerializedName

data class LoginResponse(
    @SerializedName("message")
    var message: String,
    @SerializedName("jwt")
    var jwt: String
)
