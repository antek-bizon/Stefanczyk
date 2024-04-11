package com.example.photoapp.ui.fragments

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.activityViewModels
import com.example.photoapp.data.dto.response.BaseResponse
import com.example.photoapp.data.dto.response.RegisterResponse
import com.example.photoapp.data.vm.UserViewModel
import com.example.photoapp.databinding.FragmentRegisterBinding
import com.google.android.material.snackbar.Snackbar

class RegisterFragment : Fragment() {
    private lateinit var binding: FragmentRegisterBinding
    private val viewModel by activityViewModels<UserViewModel>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentRegisterBinding.inflate(inflater, container, false)

        binding.btnRegister.setOnClickListener {
            doRegister()
        }

        return binding.root
    }

    private fun doRegister() {
        val username = binding.etName.text.toString()
        val email = binding.etEmail.text.toString()
        val password = binding.etPassword.text.toString()
        val confirmPassword = binding.etRePassword.text.toString()
        if (!isCorrect(username, email, password, confirmPassword)) {
            return
        }

        if (password != confirmPassword) {
            binding.etRePassword.error = "Passwords do not match"
            return
        }

        viewModel.registerUser(username, email, password)
    }

    private fun isCorrect(username: String, email: String, password: String, confirmPassword: String): Boolean {
        var isCorrect = true
        if (username.isBlank()) {
            binding.etName.error = "Username is required"
            isCorrect = false
        }
        if (email.isBlank()) {
            binding.etEmail.error = "Email is required"
            isCorrect = false
        }
        if (password.isBlank()) {
            binding.etPassword.error = "Password is required"
            isCorrect = false
        }
        if (confirmPassword.isBlank()) {
            binding.etRePassword.error = "Confirm the password"
            isCorrect = false
        }
        return isCorrect
    }
}