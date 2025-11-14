import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import Loading from "./components/Loading";
import UserLayout from "./layouts/UserLayout";
import HomePage from "./pages/Home";
import AuthenticationLayout from "./layouts/AuthenticationLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
const queryClient = new QueryClient();
const App = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <QueryClientProvider client={queryClient}>
                    <Routes>
                        <Route path="/" element={<UserLayout />}>
                            <Route index element={<HomePage />} />
                            <Route path="/login" element={<AuthenticationLayout title="Đăng Nhập" page="login" />}>
                                <Route index element={<Login />} />
                            </Route>
                            <Route path="/register" element={<AuthenticationLayout title="Đăng Ký" page="register" />}>
                                <Route index element={<Register />} />
                            </Route>
                        </Route>
                    </Routes>
                </QueryClientProvider>
            </Suspense>
        </BrowserRouter>
    );
};

export default App;
