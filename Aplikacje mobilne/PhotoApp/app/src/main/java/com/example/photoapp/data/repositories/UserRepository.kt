package com.example.photoapp.data.repositories

import com.example.photoapp.data.api.UserApi
import com.example.photoapp.data.dto.LoginRequest
import com.example.photoapp.data.dto.LoginResponse
import retrofit2.Response

class UserRepository {
    suspend fun loginUser(loginRequest: LoginRequest) : Response<LoginResponse>? {
        return UserApi.getApi()?.loginUser(loginRequest)
    }
}