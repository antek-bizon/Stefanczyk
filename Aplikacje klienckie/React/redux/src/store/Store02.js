import { configureStore, createSlice } from '@reduxjs/toolkit'

export default configureStore({
    reducer: {
        arrayVal: createSlice({
            name: 'A',
            initialState: {
                value1: [1, 2, 3, 4]
            }
        }).reducer,
        objectVal: createSlice({
            name: 'B',
            initialState: {
                value1: { a: 1, b: 2, c: 3 }
            }
        }).reducer,
        arrayOfObjectsVal: createSlice({
            name: 'C',
            initialState: {
                value1: [{ id: 1 }, { id: 2 }, { id: 3 }]
            }
        }).reducer
    },
})