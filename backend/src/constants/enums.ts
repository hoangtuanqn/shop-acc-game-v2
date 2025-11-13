export enum UserVerifyStatus {
    Unverifyed, // giá trị là: 0
    Verified, // 1
    Banned, // 2
}
export enum TokenType {
    // Lưu ý: Không được thay đổi thứ tự enum tránh lỗi token đã được cấp phát ngoài kia
    AccessToken,
    RefreshToken,
    ForgotPasswordToken,
    EmailVerifyToken,
}
