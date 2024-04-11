package com.example.photoapp.data.repositories

import com.example.photoapp.data.api.UserApi
import com.example.photoapp.data.dto.request.ConfirmRequest
import com.example.photoapp.data.dto.request.LoginRequest
import com.example.photoapp.data.dto.request.RegisterRequest
import com.example.photoapp.data.dto.response.ConfirmResponse
import com.example.photoapp.data.dto.response.LoginResponse
import com.example.photoapp.data.dto.response.RegisterResponse
import retrofit2.Response

class UserRepository {
    suspend fun loginUser(request: LoginRequest) : Response<LoginResponse>? {
        return UserApi.getApi()?.loginUser(request)
    }

    suspend fun registerUser(request: RegisterRequest) : Response<RegisterResponse>? {
        return UserApi.getApi()?.registerUser(request)
    }

    suspend fun confirmUser(request: ConfirmRequest) : Response<ConfirmResponse>? {
        return UserApi.getApi()?.confirmUser(request)
    }
}