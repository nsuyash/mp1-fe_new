import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
const mySecret = process.env.REACT_APP_DATA_URL;


export const fetchAddress = createAsyncThunk("address/fetchAddress", async () => {
    const response = await axios.get(`${mySecret}/address`)
    return response.data
})

export const postAddress = createAsyncThunk("address/postAddress", async (newAddress, {rejectWithValue}) => {
    try {
        const response = await axios.post(`${mySecret}/address`, newAddress)
        console.log("Address Post", response.data)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const updateAddress = createAsyncThunk("address/updateAddress", async ({buyingAddress, addressId}, {rejectWithValue}) => {
    try {
        await axios.put(`${mySecret}/address/${addressId}`, buyingAddress)
        return {buyingAddress, addressId}
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const deleteAddress = createAsyncThunk("address/deleteAddress", async (addressId, {rejectWithValue}) => {
    try {
        await axios.delete(`${mySecret}/address/${addressId}`)
        return addressId
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const buyingAddressSlice = createSlice({
    name: "address",
    initialState: {
        address: [],
        status: "idle",
        error: null
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddress.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fetchAddress.fulfilled, (state, action) => {
                state.status = "success"
                state.address = action.payload
            })
            .addCase(fetchAddress.rejected, (state, action) => {
                state.status = "error"
                state.error = action.error.message
            })

            .addCase(postAddress.pending, (state) => {
                state.status = "posting"
            })
            .addCase(postAddress.fulfilled, (state, action) => {
                state.status = "success"
                console.log("Address", action.payload)
                state.address = [...state.address, action.payload]
            })
            .addCase(postAddress.rejected, (state, action) => {
                state.status = "error"
                state.error = action.error.message
            })

            .addCase(updateAddress.pending, (state) => {
                state.status = "updating"
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.status = "success"
                const {addressId, buyingAddress} = action.payload
                const addressIndex = state.address.findIndex(add => add._id === addressId)
                if(addressIndex !== -1){
                    state.address[addressIndex] = {...state.address[addressIndex], ...buyingAddress}
                }
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.status = "error"
                state.error = action.error.message
            })

            .addCase(deleteAddress.pending, (state) => {
                state.status = "deleting"
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.status = "success"
                const addressId = action.payload
                const addressIndex = state.address.findIndex(add => add._id === addressId)
                if(addressIndex !== -1){
                    state.address.splice(addressIndex, 1)
                }
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.status = "error"
                state.error = action.error.message
            })
    }
})

export default buyingAddressSlice.reducer