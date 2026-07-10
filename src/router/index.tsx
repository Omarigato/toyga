import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import routes from "./config";

function AppRoutes() {
    const element = useRoutes(routes);
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" /></div>}>
            {element}
        </Suspense>
    );
}

export { AppRoutes };