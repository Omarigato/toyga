import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import NotFound from "../pages/NotFound";

const Home = lazy(() => import("../pages/home/page"));
const Shablondar = lazy(() => import("../pages/shablondar/page"));
const Blog = lazy(() => import("../pages/blog/page"));
const BlogDetail = lazy(() => import("../pages/blogDetail/page"));
const InvitationPage = lazy(() => import("../pages/invitation/page"));
const UserAuthPage = lazy(() => import("../pages/auth/UserAuthPage"));
const AppTemplates = lazy(() => import("../pages/app/templates"));
const UserEvents = lazy(() => import("../pages/app/EventsPage"));
const CreateEvent = lazy(() => import("../pages/app/CreateEventPage"));
const EventWorkspace = lazy(() => import("../pages/app/EventWorkspacePage"));
const AdminLoginPage = lazy(() => import("../pages/admin/LoginPage"));
const AdminDashboardPage = lazy(() => import("../pages/admin/DashboardPage"));

const routes: RouteObject[] = [
    { path: "/", element: <Home /> },
    { path: "/shablondar", element: <Shablondar /> },
    { path: "/blog", element: <Blog /> },
    { path: "/blog/:slug", element: <BlogDetail /> },
    { path: "/toi/:slug", element: <InvitationPage /> },
    { path: "/login", element: <UserAuthPage /> },
    { path: "/register", element: <UserAuthPage /> },
    { path: "/app/templates", element: <AppTemplates /> },
    { path: "/app/events", element: <UserEvents /> },
    { path: "/app/events/new", element: <CreateEvent /> },
    { path: "/app/events/:id", element: <EventWorkspace /> },
    { path: "/admin/login", element: <AdminLoginPage /> },
    { path: "/admin", element: <AdminDashboardPage /> },
    { path: "*", element: <NotFound /> },
];

export default routes;