import { configureStore } from "@reduxjs/toolkit"
import textSlice from './slices/TextSlice'

export default configureStore({
    reducer: {
        text: textSlice
    }
})