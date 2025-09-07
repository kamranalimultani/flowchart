/* eslint-disable @typescript-eslint/no-explicit-any */
import { clearUser } from "../slice/userSlice";

export const handleLogout = async (dispatch: any) => {
  //   await getRequest("/api/auth/logout");
  localStorage.removeItem("token"); // Clear token from local storage
  dispatch(clearUser()); // Clear user details from Redux state
};
