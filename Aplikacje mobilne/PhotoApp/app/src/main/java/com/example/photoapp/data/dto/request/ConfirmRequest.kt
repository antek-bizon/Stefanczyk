package com.example.photoapp.data.dto.request

import com.google.gson.annotations.SerializedName

data class ConfirmRequest(@SerializedName("token") val token: String)