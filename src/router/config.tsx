import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import NotFound from "../pages/NotFound";

const Home = lazy(() => import("../pages/home/page"));
const Tandau = lazy(() => import("../pages/tandau/page"));
const Suret = lazy(() => import("../pages/suret/page"));
const Blog = lazy(() => import("../pages/blog/page"));
const BlogDetail = lazy(() => import("../pages/blogDetail/page"));
const Musics = lazy(() => import("../pages/musics/page"));
const InvitationPage = lazy(() => import("../pages/invitation/page"));
const UserAuthPage = lazy(() => import("../pages/auth/UserAuthPage"));
const AppTemplates = lazy(() => import("../pages/app/templates"));
const AdminLoginPage = lazy(() => import("../pages/admin/LoginPage"));
const AdminDashboardPage = lazy(() => import("../pages/admin/DashboardPage"));

const routes: RouteObject[] = [
    { path: "/", element: <Home /> },
    { path: "/tandau", element: <Tandau /> },
    { path: "/suret", element: <Suret /> },
    { path: "/blog", element: <Blog /> },
    { path: "/blog/:slug", element: <BlogDetail /> },
    { path: "/musics", element: <Musics /> },
    { path: "/i/:slug", element: <InvitationPage /> },
    { path: "/login", element: <UserAuthPage /> },
    { path: "/register", element: <UserAuthPage /> },
    { path: "/app/templates", element: <AppTemplates /> },
    { path: "/admin/login", element: <AdminLoginPage /> },
    { path: "/admin", element: <AdminDashboardPage /> },
    { path: "*", element: <NotFound /> },
];

export default routes;