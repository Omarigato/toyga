import React, { Suspense, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import routes from "./config";
let navigatePromise: ((path: string) => void) | null = null;
(window as any).REACT_APP_NAVIGATE = window.REACT_APP_NAVIGATE || ((path: string) => {
    if (navigatePromise) {
        navigatePromise(path);
    }
});
function AppRoutesInner() {
    const element = useRoutes(routes);
    const navigate = (window as any).__REACT_ROUTER_NAVIGATE__;
    useEffect(() => {
        if (navigate) {
            navigatePromise = navigate;
        }
    }, [navigate]);
    return <Suspense fallback={
        <div />}>{element}</Suspense >;
    }
    export function AppRoutes() {
        return <AppRoutesInner />;
    }