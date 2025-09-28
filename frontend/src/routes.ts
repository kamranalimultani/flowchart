// import {
//   Home,
//   FolderCheck,
//   Users,
//   Blocks,
//   Calendar,
//   FileText,
//   HelpCircle,
//   LogOut,
//   BookOpen,
//   Wallet,
//   Clock,
//   Briefcase,
//   MessageCircle,
// } from "lucide-react";

// import CalenderPage from "./pages/CalenderPage"; // Import the necessary pages
// import Dashboard from "./pages/Dashboards/DashboardMain"; // Import the necessary pages
// import CompanyDetails from "./pages/AdminOnly/CompanyDetails";
// import UserListPage from "./pages/Users/UsersList";
// import TodoPage from "./pages/Projects/Todos";
// import ProjectsPage from "./pages/Projects/Projects";
// import { ActiveUsers } from "./pages/Users/ActiveUsers";
// import { ChatPage } from "./pages/Chat/ChatPage";

// export const routes = [
//   {
//     title: "Home",
//     icon: Home,
//     path: "/dashboard",
//     exact: true,
//     element: Dashboard,
//     access: ["*"],
//   },
//   {
//     title: "Calendar",
//     icon: Calendar,
//     path: "/calendar",
//     exact: true,
//     element: CalenderPage,
//     access: ["*"],
//   },
//   {
//     title: "Company Details",
//     icon: Briefcase,
//     path: "/company-details",
//     exact: true,
//     element: CompanyDetails,
//     access: ["superadmin", "admin"],
//   },
//   {
//     title: "Chat",
//     icon: MessageCircle,
//     path: "/chat",
//     exact: true,
//     element: ChatPage,
//     access: ["*"],
//   },
//   {
//     title: "Projects",
//     icon: FolderCheck,
//     path: "/",
//     exact: true,
//     element: Dashboard,
//     access: ["*"],
//     children: [
//       {
//         title: "Projects",
//         icon: FolderCheck,
//         path: "/projects",
//         exact: true,
//         element: ProjectsPage,
//         access: ["*"],
//       },
//       {
//         title: "Todos",
//         icon: FolderCheck,
//         path: "/todos",
//         exact: true,
//         element: TodoPage,
//         access: ["*"],
//       },
//     ],
//   },
//   {
//     title: "Toolkit",
//     icon: Blocks,
//     path: "/toolkit",
//     exact: true,
//     element: Dashboard,
//     access: ["superadmin", "admin", "employee"],
//     children: [
//       {
//         title: "Attendance Records",
//         icon: Clock,
//         path: "/toolkit/attendance-records",
//         exact: true,
//         element: Dashboard,
//         access: ["superadmin", "admin", "employee"],
//       },
//       {
//         title: "Doc Management",
//         icon: FileText,
//         path: "/toolkit/doc-management",
//         exact: true,
//         element: Dashboard,
//         access: ["admin", "employee"],
//       },
//       {
//         title: "Exit Management",
//         icon: LogOut,
//         path: "/toolkit/exit-management",
//         exact: true,
//         element: Dashboard,
//         access: ["admin", "employee"],
//       },
//       {
//         title: "Leave Management",
//         icon: Calendar,
//         path: "/toolkit/leave-management",
//         exact: true,
//         element: CalenderPage,
//         access: ["admin", "employee"],
//       },
//       {
//         title: "Payroll & Benefits",
//         icon: Wallet,
//         path: "/toolkit/payroll-benefits",
//         exact: true,
//         element: Dashboard,
//         access: ["admin", "employee"],
//       },
//       {
//         title: "Resources & Help",
//         icon: HelpCircle,
//         path: "/toolkit/resources-help",
//         exact: true,
//         element: Dashboard,
//         access: ["admin", "employee"],
//       },
//       {
//         title: "Team Directory",
//         icon: BookOpen,
//         path: "/toolkit/team-directory",
//         exact: true,
//         element: Dashboard,
//         access: ["admin", "employee"],
//       },
//     ],
//   },
//   {
//     title: "Users",
//     icon: Users,
//     path: "/users",
//     exact: true,
//     element: Dashboard,
//     access: ["superadmin", "admin"],
//     children: [
//       {
//         title: "Active Users",
//         icon: Clock,
//         path: "/users/active",
//         exact: true,
//         element: ActiveUsers,
//         access: ["superadmin", "admin"],
//       },
//       {
//         title: "All Users",
//         icon: Users,
//         path: "/users/all",
//         exact: true,
//         element: UserListPage,
//         access: ["superadmin", "admin"],
//       },
//     ],
//   },
// ];
