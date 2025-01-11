export  interface UserResponse {
    id: string;
    firstName: string;
    lastName: string;
    code: string;
}

export interface UserRequest {
    firstName: string;
    lastName: string;
    code: string;
}