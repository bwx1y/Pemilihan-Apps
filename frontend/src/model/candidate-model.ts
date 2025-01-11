export interface CandidatePhotoRequest {
    file: File | Blob;
}

export interface CandidatePhotoResponse {
    message: string;
    fileName: string;
}