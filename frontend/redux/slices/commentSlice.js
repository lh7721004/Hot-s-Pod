import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

// 댓글 작성
export const createComment = createAsyncThunk('comment/createComment', async (commentData) => {
    const response = await axios.post(`${API_BASE}/comment/`, commentData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
});

const commentSlice = createSlice({
    name: 'comment',
    initialState: {
        comments: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.loading = false;
                state.comments.push(action.payload);
            })
            .addCase(createComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default commentSlice.reducer;
