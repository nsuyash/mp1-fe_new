import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios";

export const fetchCartProduct = createAsyncThunk("cart/fetchCartProduct", async () => {
    const response = await axios.get("https://mp1-be-git-main-suyash-nandurkars-projects.vercel.app/cart/products")
    return response.data
})

export const postCartProduct = createAsyncThunk("cart/postCartProduct", async (newCartProduct, {rejectWithValue}) => {
    try {
        const response = await axios.post("https://mp1-be-git-main-suyash-nandurkars-projects.vercel.app/cart/product", newCartProduct)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const deleteCartProduct = createAsyncThunk("cart/deleteCartProduct", async (cartId, {rejectWithValue}) => {
    try {
        await axios.delete(`https://mp1-be-git-main-suyash-nandurkars-projects.vercel.app/cart/product/${cartId}`)
        return cartId
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const deleteCartProducts = createAsyncThunk("cart/deleteCartProducts", async ({rejectWithValue}) => {
    try {
        await axios.delete(`https://mp1-be-git-main-suyash-nandurkars-projects.vercel.app/cart/products/delete`)
        return []
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const updateProductQuantity = createAsyncThunk("cart/updateProductQuantity", async ({cartId, quantity}, {rejectWithValue}) => {
    try{
        await axios.put(`https://mp1-be-git-main-suyash-nandurkars-projects.vercel.app/cart/product/${cartId}`, {quantity})
        return {cartId, quantity}
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const addToCartSlice = createSlice({
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
                state.cart.push(action.payload)
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

            .addCase(deleteCartProducts.pending, (state) => {
                state.status = "deleting";
            })
            .addCase(deleteCartProducts.fulfilled, (state, action) => {
                state.status = "success";
                state.cart = action.payload
            })
            .addCase(deleteCartProducts.rejected, (state, action) => {
                state.status = "error";
                state.error = action.error.message
            })

            .addCase(updateProductQuantity.pending, (state) => {
                state.status = "Updating";
            })
            .addCase(updateProductQuantity.fulfilled, (state, action) => {
                state.status = "success";
                const cartIndex = state.cart.findIndex(item => item._id === action.payload.cartId)
                if(cartIndex !== -1){
                    state.cart[cartIndex].quantity = action.payload.quantity
                }
            })
            .addCase(updateProductQuantity.rejected, (state, action) => {
                state.status = "error";
                state.error = action.error.message;
            });
    }
})

export default addToCartSlice.reducer;