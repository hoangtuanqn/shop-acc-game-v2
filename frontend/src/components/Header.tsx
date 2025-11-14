import clsx from "clsx";
import {
    FaHome,
    FaCoins,
    FaHistory,
    FaMoneyBillWave,
    FaNewspaper,
    FaUser,
    FaRegUser,
    FaFacebookF,
    FaYoutube,
} from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { FiUserPlus } from "react-icons/fi";
import { formatPhone } from "../utils/functions";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import type { ReactNode } from "react";
interface NavLinkType {
    href: string;
    active: boolean;
    icon: ReactNode;
    children: ReactNode;
}
function NavLink({ href, active, icon, children }: NavLinkType) {
    return (
        <Link
            to={href}
            className={clsx(
                "flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition",
                active ? "bg-blue-100 text-blue-600 shadow" : "text-gray-700 hover:bg-gray-100 hover:text-blue-500",
            )}
        >
            <span className="text-lg">{icon}</span>
            <span>{children}</span>
        </Link>
    );
}

const Header = () => {
    const location = useLocation();
    const url = location.pathname;
    return (
        <>
            <div className="container-content hidden items-center justify-between py-4 md:flex xl:py-2.5">
                <div className="ht-flex-center mx-4 gap-3 text-xs xl:mx-0">
                    <a
                        href="https://www.facebook.com/phamhoangtuanqn/"
                        target="_blank"
                        className="text-primary hover:bg-primary rounded-full bg-white p-2.5 shadow-sm duration-200 hover:text-white xl:p-1.5"
                    >
                        <FaFacebookF />
                    </a>
                    <a
                        href="https://www.youtube.com/@htuanqn"
                        target="_blank"
                        className="text-primary hover:bg-primary rounded-full bg-white p-2.5 shadow-sm duration-200 hover:text-white xl:p-1.5"
                    >
                        <FaYoutube />
                    </a>
                </div>
                <span className="ht-flex-center gap-0.5 text-sm md:text-base xl:text-sm">
                    <span>Hotline:</span>{" "}
                    <a href="tel:0812665001" className="ht-text-primary">
                        {formatPhone("0812665001")}
                    </a>{" "}
                    <span className="hidden sm:block">(8:00 - 22:00)</span>
                </span>
            </div>
            <header className="ht-background-blur sticky top-2 z-50 mx-4 mb-9 rounded-lg bg-white shadow-xs">
                <div className="container-content mx-auto flex items-center justify-between py-3">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="Logo Website" className="h-auto w-34 object-contain" />
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden gap-2 xl:flex">
                        <NavLink href="/" active={url === "/"} icon={<FaHome />}>
                            Trang chủ
                        </NavLink>
                        <NavLink href="/nap-tien" active={url === "/nap-tien"} icon={<FaCoins />}>
                            Nạp tiền
                        </NavLink>
                        <NavLink href="/lich-su-mua-nick" active={url === "/lich-su-mua-nick"} icon={<FaHistory />}>
                            Lịch sử mua nick
                        </NavLink>
                        <NavLink href="/thong-tin" active={url === "/thong-tin"} icon={<FaUser />}>
                            Tài khoản
                        </NavLink>
                        <NavLink href="/dong-tien" active={url === "/dong-tien"} icon={<FaMoneyBillWave />}>
                            Dòng tiền
                        </NavLink>
                        <NavLink href="/tin-tuc" active={url === "/tin-tuc"} icon={<FaNewspaper />}>
                            Tin tức
                        </NavLink>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden gap-2 xl:flex">
                        <Link
                            to={"/login"}
                            className="ht-flex-center gap-1 rounded-lg border border-blue-500 px-5 py-2 text-center font-semibold text-blue-500 transition hover:bg-blue-50"
                        >
                            <IoMdLogIn />
                            <span>Đăng nhập</span>
                        </Link>

                        <Link to="/register">
                            <Button variant={"primary"}>
                                <FiUserPlus />
                                <span>Đăng ký</span>
                            </Button>
                        </Link>
                        {/* <Link
                        href={route("auth.register")}
                        className="px-8 py-2 font-semibold text-center text-white transition rounded-lg shadow from-primary bg-gradient-to-r to-blue-500 hover:from-blue-600 hover:to-indigo-600"
                    >
                        Đăng ký
                    </Link> */}
                    </div>

                    {/* Mobile Hamburger & User */}
                    <div className="flex items-center gap-2 xl:hidden">
                        <Link
                            to={"/login"}
                            className="rounded-full bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                        >
                            <FaRegUser size={22} />
                        </Link>
                        {/* Nếu muốn có menu mobile, có thể thêm button mở menu ở đây */}
                    </div>
                </div>
                {/* Mobile Menu (optional, có thể thêm nếu muốn) */}
            </header>
        </>
    );
};
export default Header;
