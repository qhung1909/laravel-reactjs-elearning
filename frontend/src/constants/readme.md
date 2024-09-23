// File src/constants chứa các định nghĩa về hằng số dùng trong web
// Ví dụ

export const API_BASE_URL = process.env.API_URL;
export const TOKEN_KEY = 'auth_token';
export const USER_ROLE = {
  ADMIN: 'admin',
  USER: 'user',
};

// Làm thế này dễ quản lí biến, mỗi khi lỗi biến hay hằng số dùng chung thì không phải sửa hay tìm trong từng dòng code