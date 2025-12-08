import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/types"; // Ensure your `User` type is imported

interface UserState {
    user: User | null; // Explicit state type
}

const initialState: UserState = {
    user: null, // Initial state starts as null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload; // Update the user state
        },
        clearUser: (state) => {
            state.user = null; // Clear the user state
        },
    },
});

// Export the actions to use in components
export const { setUser, clearUser } = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;
