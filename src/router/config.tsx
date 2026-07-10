import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Tandau from "../pages/tandau/page";
import Suret from "../pages/suret/page";
import Blog from "../pages/blog/page";
import BlogDetail from "../pages/blogDetail/page";
import Musics from "../pages/musics/page";
const routes: RouteObject[] = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/tandau",
        element: <Tandau />,
    },
    {
        path: "/suret",
        element: <Suret />,
    },
    {
        path: "/blog",
        element: <Blog />,
    },
    {
        path: "/blog/:slug",
        element: <BlogDetail />,
    },
    {
        path: "/musics",
        element: <Musics />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
];
export default routes;