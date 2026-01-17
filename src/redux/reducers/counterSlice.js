
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getAllUsers = createAsyncThunk("getAllUSers", async ({ url }) => {
  try {
    const res = await axios.get(url, {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    });
    return res;
  } catch (error) {
    return error?.response?.data;;
  }
});

const counterSlice = createSlice({
  name: "CounterSlice",
  initialState: {
    value: 0,
    loader: false,
    userData: null,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    reset: (state, action) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loader = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loader = false;
        state.userData = action.payload.data;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.loader = false;
      });
  },
});

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;
