import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import Loading from "./components/Loading";
import UserLayout from "./layouts/UserLayout";
import HomePage from "./pages/Home";
const queryClient = new QueryClient();
const App = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <QueryClientProvider client={queryClient}>
                    {/* <ScrollToTop /> */}
                    {/* <Provider store={store}> */}
                    <Routes>
                        <Route path="/" element={<UserLayout />}>
                            <Route index element={<HomePage />} />
                        </Route>
                    </Routes>
                    {/* </Provider> */}
                </QueryClientProvider>
            </Suspense>
        </BrowserRouter>
    );
};

export default App;
