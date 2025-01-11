export interface VoteUserResponse {
    id: string;
    title: string;
    status: boolean;
    followDate: string | null;
}

export interface VoteUserByIdResponse {
    id: string;
    title: string;
    candidate: CandidateUserResponse[];
}

export interface CandidateUserResponse {
    id: string;
    name: string;
    fisi: string;
    misi: string;
    descripction: string;
}

export interface VoteAdminResponse {
    id: string;
    title: string;
    status: boolean;
    followerCount: number;
}

export interface VoteRequest {
    title: string;
    candidate: CandidateRequest[];
}

export interface VotePreRequest {
    title: string;
    candidate: CandidatePreRequest[];
}

interface CandidatePreRequest {
    name: string;
    fisi: string;
    misi: string;
    file: File | Blob | null;
    description: string;
}

export interface CandidateRequest {
    name: string;
    fisi: string;
    misi: string;
    fileName: string;
    descripction: string;
}

export interface VoteEditRequest {
    title: string;
    candidate: CandidateEditRequest[]
}

export interface CandidateEditRequest {
    id?: string | null;
    name: string;
    fisi: string;
    misi: string;
    fileName: string;
    file: File | Blob | null;
    descripction: string;
}