export interface LoginAdminRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
}

export interface LoginUserRequest {
    code: string;
}

export interface LoginResponse {
    token: string;
}

export interface LoginErorr {
    message: string;
}