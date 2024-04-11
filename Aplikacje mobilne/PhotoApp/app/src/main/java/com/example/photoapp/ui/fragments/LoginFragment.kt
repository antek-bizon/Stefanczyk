package com.example.photoapp.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.example.photoapp.data.vm.UserViewModel
import com.example.photoapp.databinding.FragmentLoginBinding

class LoginFragment : Fragment() {
    private lateinit var binding: FragmentLoginBinding
    private val viewModel by activityViewModels<UserViewModel>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentLoginBinding.inflate(inflater, container, false)

        binding.btnLogin.setOnClickListener {
            doLogin()
        }

        return binding.root
    }

    private fun doLogin() {
        val username = binding.etName.text.toString()
        val password = binding.etPassword.text.toString()
        if (isCorrect(username, password)) {
            viewModel.loginUser(username, password)
        }
    }

    private fun isCorrect(username: String, password: String): Boolean {
        var isCorrect = true
        if (username.isBlank()) {
            binding.etName.error = "Username is required"
            isCorrect = false
        }
        if (password.isBlank()) {
            binding.etPassword.error = "Password is required"
            isCorrect = false
        }
        return isCorrect
    }
}