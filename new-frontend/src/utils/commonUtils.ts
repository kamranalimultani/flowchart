/* eslint-disable @typescript-eslint/no-explicit-any */
import { clearUser } from "../slice/userSlice";

export const handleLogout = async (dispatch: any) => {
    //   await getRequest("/api/auth/logout");
    localStorage.removeItem("auth"); // Clear token from local storage
    dispatch(clearUser()); // Clear user details from Redux state
};

export const extractGraphModel = (xmlString: any) => {
    // Find the start and end of mxGraphModel tag
    const startTag = "<mxGraphModel";
    const endTag = "</mxGraphModel>";

    const startIndex = xmlString.indexOf(startTag);
    const endIndex = xmlString.indexOf(endTag);

    if (startIndex !== -1 && endIndex !== -1) {
        // Extract everything from <mxGraphModel to </mxGraphModel>
        return xmlString.substring(startIndex, endIndex + endTag.length);
    }

    // If no mxGraphModel found, return original string
    return xmlString;
};
