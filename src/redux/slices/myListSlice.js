import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    list: {},
    err: null
}

const mylist = createSlice({
    name: 'mylist',
    initialState,
    reducers: {
        addMovie(state, action) {
            const tempState = state.list || {}
            if (tempState && !(action.payload.id.toString() in tempState)) {
                tempState[action.payload.id.toString()] = action.payload;
                state.list = tempState
            }
            else if (!tempState) {
                tempState[action.payload.id.toString()] = action.payload;
                state.list = tempState
            }
        },
        removeMovie(state, action) {
            const tempState = state.list
            if (tempState && action.payload in tempState) {
                delete tempState[action.payload]
                state.list = tempState
            }
        },
        errList(state, action) {
            state.err = action.payload
        }
    }
})

export const { addMovie, removeMovie, errList } = mylist.actions;
export default mylist.reducer;