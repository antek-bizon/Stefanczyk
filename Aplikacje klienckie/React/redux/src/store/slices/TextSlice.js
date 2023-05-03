import { createSlice } from "@reduxjs/toolkit"

export const textSlice = createSlice({
    name: 'counter slice',
    initialState: {
        value: 'test'
    },
    reducers: {
        add: state => {
            const letters = (Math.random() + 1).toString(36).substring(7);
            state.value += letters[0]
        },
        removeFromStart: state => {
            state.value = state.value.slice(1)
        },
        removeFromBack: state => {
            state.value = state.value.slice(0, state.value.length - 1)
        }
    }
})

export const { add, removeFromStart, removeFromBack } = textSlice.actions
export default textSlice.reducer