import { configureStore } from "@reduxjs/toolkit"
import counterReducer from './slices/CounterSlice'

export default configureStore({
    reducer: {
        counter: counterReducer
    }
})