import type { LucideIcon } from "lucide-react";

// Define the Leave interface
export interface Leave {
    date: string; // ISO string format for the date
    description: string; // Description of the leave
}

// Define the User interface
export interface User {
    _id: string; // Unique ID of the user
    name: string; // Name of the user
    email: string; // Email address of the user
    role: string; // Role of the user, e.g., "superadmin"
}

// Define the UserState interface for Redux
export interface UserState {
    user: User | null; // Nullable user object for initial state
}
export interface MultiSelctType {
    value: string; // Nullable user object for initial state
    label: string; // Nullable user object for initial state
    Icon?: LucideIcon; // Nullable user object for initial state
}
