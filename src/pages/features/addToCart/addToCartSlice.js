import { act } from "react"

const { createSlice, createAsyncThunk} = require("@reduxjs/toolkit")
const axios = require("axios")

export const fetchCartProduct = createAsyncThunk("cart/fetchCartProduct", async () => {
    const response = await axios.get("https://mp1-be.vercel.app/cart/product")
    return response.data
})

export const postCartProduct = createAsyncThunk("cart/postCartProduct", async (newCartProduct, {rejectWithValue}) => {
    try {
        const cartWithQuantity = {...newCartProduct, quantity: 1}

        const response = await axios.post("https://mp1-be.vercel.app/cart/product", cartWithQuantity)

        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const deleteCartProduct = createAsyncThunk("cart/deleteCartProduct", async (cartId, {rejectWithValue}) => {
    try {
        await axios.delete(`https://mp1-be.vercel.app/cart/product/${cartId}`)
        return cartId
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const addToCartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: [],
        status: "idle",
        error: null
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartProduct.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fetchCartProduct.fulfilled, (state, action) => {
                state.status = "success";
                state.cart = action.payload
            })
            .addCase(fetchCartProduct.rejected, (state, action) => {
                state.status = "error";
                state.error = action.error.message
            })

            .addCase(postCartProduct.pending, (state) => {
                state.status = "posting"
            })
            .addCase(postCartProduct.fulfilled, (state, action) => {
                state.status = "success";
                state.cart = action.payload
            })
            .addCase(postCartProduct.rejected, (state, action) => {
                state.status = "error"
                state.status = action.error.message
            })

            .addCase(deleteCartProduct.pending, (state) => {
                state.status = "deleting";
            })
            .addCase(deleteCartProduct.fulfilled, (state, action) => {
                state.status = "success";
                state.cart = state.cart.filter((list) => list._id !== action.payload)
            })
            .addCase(deleteCartProduct.rejected, (state, action) => {
                state.status = "error";
                state.error = action.error.message
            })
    }
})

export default addToCartSlice.reducer;