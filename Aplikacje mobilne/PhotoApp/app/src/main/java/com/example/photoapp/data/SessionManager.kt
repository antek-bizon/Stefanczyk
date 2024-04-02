package com.example.photoapp.data

import android.content.Context
import android.content.SharedPreferences
import com.example.photoapp.R

object SessionManager {
    private const val TOKEN_ENTRY = "user_token"

    fun saveString(context: Context, key: String, value: String) {
        val prefs: SharedPreferences = context.getSharedPreferences(
            context.getString(R.string.app_name), Context.MODE_PRIVATE
        )
        val editor = prefs.edit()
        editor.putString(key, value)
        editor.apply()
    }

    fun saveAuthToken(context: Context, token: String) {
        saveString(context, TOKEN_ENTRY, token)
    }

    fun getString(context: Context, key: String): String? {
        val prefs: SharedPreferences = context.getSharedPreferences(
            context.getString(R.string.app_name), Context.MODE_PRIVATE
        )
        return prefs.getString(this.TOKEN_ENTRY, null)
    }

    fun getToken(context: Context): String? {
        return getString(context, TOKEN_ENTRY)
    }

    fun clearData(context: Context) {
        val editor = context.getSharedPreferences(context.getString(
            R.string.app_name), Context.MODE_PRIVATE
        ).edit()
        editor.clear()
        editor.apply()
    }
}