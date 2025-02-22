import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios";


export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async () => {
    const response = await axios.get("https://mp1-be-git-main-suyash-nandurkars-projects.vercel.app/wishlist")
    return response.data;
})


export const postWishlist = createAsyncThunk("wishlist/postWishlist", async (newWishlist, {rejectWithValue}) => {
    try {
        const response = await axios.post("https://mp1-be-git-main-suyash-nandurkars-projects.vercel.app/wishlist/wishlistProduct", newWishlist)

        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const deleteWishlist = createAsyncThunk("wishlist/deleteWishlist", async (wishlistId, {rejectWithValue}) => {
    try {
        await axios.delete(`https://mp1-be-git-main-suyash-nandurkars-projects.vercel.app/wishlist/${wishlistId}`)
        return wishlistId
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


export const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        wishlist: [],
        status: "idle",
        error: null
    },
    reducers: {

    },
    extraReducers: (builder) => {
    builder
        .addCase(fetchWishlist.pending, (state) => {
            state.status = "loading"
        })
        .addCase(fetchWishlist.fulfilled, (state, action) => {
            state.status = "success";
            state.wishlist = action.payload
        })
        .addCase(fetchWishlist.rejected, (state, action) => {
            state.status = "error";
            state.error = action.error.message
        })

        .addCase(postWishlist.pending, (state) => {
            state.status = "posting";
        })
        .addCase(postWishlist.fulfilled, (state, action) => {
            state.status = "success";
            state.wishlist.push(action.payload);
        })
        .addCase(postWishlist.rejected, (state, action) => {
            state.status = "error";
            state.error = action.error.message;
        })

        .addCase(deleteWishlist.pending, (state) => {
            state.status = "deleting";
        })
        .addCase(deleteWishlist.fulfilled, (state, action) => {
            state.status = "success";
            state.wishlist = state.wishlist.filter((list) => list._id !== action.payload);
        })
        .addCase(deleteWishlist.rejected, (state, action) => {
            state.status = "error";
            state.error = action.error.message;
        }) 
    }
})

export default wishlistSlice.reducer;