import { configureStore, createSlice } from '@reduxjs/toolkit'

export default configureStore({
    reducer: {
        testValue: createSlice({
            name: 'value description',
            initialState: {
                value1: 1234
            }
        }).reducer
    },
})