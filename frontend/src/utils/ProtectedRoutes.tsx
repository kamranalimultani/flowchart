// import React from "react";
// import { Route } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "../../store"; // Adjust import path
// import NotFoundPage from "../pages/NotFound";

// interface PrivateRouteProps {
//   path: string;
//   exact?: boolean;
//   roles: string[];
//   element: React.ReactNode;
//   children?: React.ReactNode;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({
//   path,
//   roles,
//   element,
//   children,
// }) => {
//   const { user } = useSelector((state: RootState) => state.user);

//   // Check if the user has access based on roles
//   const hasAccess = user && roles.includes(user.role);

//   if (hasAccess) {
//     return (
//       <Route path={path} element={element}>
//         {children}
//       </Route>
//     );
//   } else {
//     return <Route path={path} element={<NotFoundPage />} />;
//   }
// };

// export default PrivateRoute;
