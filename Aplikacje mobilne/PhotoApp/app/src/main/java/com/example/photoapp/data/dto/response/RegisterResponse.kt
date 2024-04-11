package com.example.photoapp.data.dto.response

import com.google.gson.annotations.SerializedName

data class RegisterResponse(
    @SerializedName("token") val token: String,
)
