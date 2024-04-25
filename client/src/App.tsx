import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Home from "./routes/Home";
import CreatePoll from "./routes/poll/CreatePoll";
import Poll from "./routes/poll/Poll";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { useOs } from "@mantine/hooks";
import "@mantine/notifications/styles.css";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/poll/create",
        element: <CreatePoll />,
      },
      {
        path: "/poll/:token",
        element: <Poll />,
      },
    ],
  },
]);

function App() {
  const os = useOs();

  useEffect(() => {
    if (os === "undetermined") return;
    if (os !== "ios" && os !== "android") {
      notifications.show({
        title: "This app is designed for mobile",
        message: `It looks like you're using ${os}. Use your phone for the best experience`,
        color: "red",
      });
    }
  }, [os]);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
