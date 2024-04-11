package com.example.photoapp.data.dto.response

import com.google.gson.annotations.SerializedName

data class LoginResponse(
    @SerializedName("token")
    var token: String
)
