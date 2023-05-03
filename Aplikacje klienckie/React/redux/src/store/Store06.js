import { configureStore } from "@reduxjs/toolkit"
import formSlice from './slices/FormSlice'

export default configureStore({
    reducer: {
        text: formSlice
    }
})