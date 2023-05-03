import { createSlice } from "@reduxjs/toolkit"

export const formSlice = createSlice({
    name: 'counter slice',
    initialState: {
        value: 'simple form'
    },
    reducers: {
        update: (state, action) => {
            console.log(action.payload)
            state.value = action.payload
        }
    }
})

export const { update } = formSlice.actions
export default formSlice.reducer