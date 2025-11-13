import Swal from "sweetalert2";

export function formatNumber(amount) {
    // Dấu , sử dụng en-US. Dấu . sử dụng vi-VN
    return new Intl.NumberFormat("vi-VN").format(amount);
}
export function subString(string) {
    const length = string.length;
    return string.substring(0, length - 3) + "***";
}
export function showAlert(status = "success", message) {
    const title = {
        success: "Thành công!",
        error: "Có lỗi!",
    };
    return Swal.fire({
        title: title[status],
        text: message,
        icon: status,
    });
}
export function showAlertImage({
    title = "Chúc mừng bạn",
    message = "",
    image = "/images/icons/congratulationYouWin.png",
    width = 180,
    height = 80,
}) {
    Swal.fire({
        title: title,
        text: message,
        imageUrl: image,
        imageWidth: width,
        imageHeight: height,
        imageAlt: "Custom image",
    });
}
export function random(a, b) {
    // random [a,b]
    return Math.floor(Math.random() * (b - a + 1)) + a;
}
export function formatPhone(phone) {
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1.$2.$3");
}
