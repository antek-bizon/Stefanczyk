package com.example.photoapp.data.dto.response

import com.google.gson.Gson

data class ErrorResponse(
    val title: String,
    val status: Int,
    val details: String
)

fun getError(body: String?): String {
    if (body != null) {
        val error = Gson().fromJson(body, ErrorResponse::class.java)
        return "Http error: ${error.title} (${error.details})"
    }
    return "Http error: Unknown error"
}