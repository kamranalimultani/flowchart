import { clearUser } from "../slice/userSlice";

export const handleLogout = async (dispatch: any) => {
  console.log("test");
  //   await getRequest("/api/auth/logout");
  localStorage.removeItem("token"); // Clear token from local storage
  console.log("object");
  dispatch(clearUser()); // Clear user details from Redux state
};
