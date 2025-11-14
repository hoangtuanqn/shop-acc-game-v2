import { FaUser } from "react-icons/fa";
import { HiEye } from "react-icons/hi";
import { showAlert } from "../../utils/functions";
import { BsEyeSlashFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { Button } from "~/components/ui/button";
import { useState } from "react";

const Register = () => {
    const [data, setData] = useState({
        username: "",
        password: "",
        email: "",
    });
    const [isShowPasssword, setIsShowPasssword] = useState(false);
    const handleChange = (e: any) => {
        setData((data) => ({
            ...data,
            [e.target.name]: e.target.value,
        }));
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();

        showAlert("success", "Tạo tài khoản thành công!");
    };
    const handleShowPassword = () => {
        setIsShowPasssword((is) => !is);
    };
    return (
        <>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-800">Tài Khoản</label>
                    <div className="relative flex items-center">
                        <input
                            name="username"
                            type="text"
                            onChange={handleChange}
                            value={data?.username}
                            required
                            className="outline-primary w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm text-slate-800"
                            placeholder="Tên tài khoản của bạn"
                        />
                        <FaUser className="ht-icon absolute right-4 max-sm:hidden" />
                    </div>
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-800">Địa Chỉ Email</label>
                    <div className="relative flex items-center">
                        <input
                            name="email"
                            type="email"
                            onChange={handleChange}
                            value={data?.email}
                            required
                            className="outline-primary w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm text-slate-800"
                            placeholder="Không bắt buộc (Dùng để lấy lại mật khẩu)"
                        />
                        <MdEmail className="ht-icon absolute right-4 max-sm:hidden" />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-800">Mật Khẩu</label>
                    <div className="relative flex items-center">
                        <input
                            name="password"
                            type={isShowPasssword ? "text" : "password"}
                            onChange={handleChange}
                            value={data?.password}
                            required
                            className="outline-primary w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-slate-800"
                            placeholder="Mật khẩu của bạn"
                        />
                        {isShowPasssword ? (
                            <BsEyeSlashFill
                                className="ht-icon absolute right-4 cursor-pointer"
                                onClick={handleShowPassword}
                            />
                        ) : (
                            <HiEye className="ht-icon absolute right-4 cursor-pointer" onClick={handleShowPassword} />
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <Button variant={"primary"} type="submit" className="w-full">
                        Tạo Tài Khoản
                    </Button>
                </div>
            </form>
        </>
    );
};

export default Register;
