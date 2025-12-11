"use client";

import { Provider } from "react-redux";
import store from "@/store";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/context/NotificationContext";
import { HelmetProvider } from "react-helmet-async";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <HelmetProvider>
                <ThemeProvider storageKey="vite-ui-theme">
                    <NotificationProvider>
                        {children}
                    </NotificationProvider>
                </ThemeProvider>
            </HelmetProvider>
        </Provider>
    );
}
