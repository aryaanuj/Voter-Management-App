import { api } from "./api-client";
import {
    LoginRequest,
    LoginResponse,
    SendOtpRequest,
    RegisterRequest,
    UpdateProfileRequest,
    ProfileUpdateResponse,
    User,
    Voter,
    CreateVoterRequest,
    UpdateVoterRequest,
    VoterQueryParams,
    PaginatedResponse,
    District,
    AssemblyConstituency,
    PollingStation,
    BoothActivity,
    CreateBoothActivityRequest,
    DashboardStats,
    VoterDemographics,
    FileUploadResponse,
    VoterStatus,
    CreateDistrictRequest,
    UpdateDistrictRequest,
    CreateAssemblyConstituencyRequest,
    CreatePollingStationRequest,
} from "./types";

// Auth Service
export const authService = {
    sendOtp: async (data: SendOtpRequest) => {
        const response = await api.post("/auth/send-otp", data);
        return response.data;
    },

    verifyOtp: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post("/auth/verify-otp", data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<User> => {
        const response = await api.post("/auth/register", data);
        return response.data;
    },

    getProfile: async (): Promise<{ user: User }> => {
        const response = await api.get("/auth/profile");
        return response.data;
    },

    logout: async (refreshToken: string) => {
        const response = await api.post("/auth/logout", { refreshToken });
        return response.data;
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<ProfileUpdateResponse> => {
        const response = await api.put("/auth/profile", data);
        return response.data;
    },

    uploadProfileImage: async (file: File): Promise<ProfileUpdateResponse> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/auth/profile/image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};

// User Service
export const userService = {
    getAll: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<User>> => {
        const response = await api.get("/users", { params });
        return response.data;
    },

    getById: async (id: string): Promise<User> => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    create: async (data: RegisterRequest): Promise<User> => {
        const response = await api.post("/users", data);
        return response.data;
    },

    update: async (id: string, data: Partial<RegisterRequest>): Promise<User> => {
        const response = await api.patch(`/users/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    assignCandidate: async (userId: string, assemblyConstituencyId: string) => {
        const response = await api.post("/users/assign-candidate", {
            userId,
            assemblyConstituencyId,
        });
        return response.data;
    },

    assignBoothManager: async (userId: string, pollingStationId: string) => {
        const response = await api.post("/users/assign-booth-manager", {
            userId,
            pollingStationId,
        });
        return response.data;
    },

    assignConstituencies: async (userId: string, assemblyConstituencyIds: string[]) => {
        const response = await api.post("/users/assign-multiple-constituencies", {
            userId,
            assemblyConstituencyIds,
        });
        return response.data;
    },
};

// Voter Service
export const voterService = {
    // ✅ Voter Management
    getAll: async (params?: VoterQueryParams): Promise<PaginatedResponse<Voter>> => {
        const response = await api.get("/voters", { params });
        return response.data;
    },

    getById: async (id: string): Promise<Voter> => {
        const response = await api.get(`/voters/${id}`);
        return response.data;
    },

    create: async (data: CreateVoterRequest): Promise<Voter> => {
        const response = await api.post("/voters", data);
        return response.data;
    },

    update: async (id: string, data: UpdateVoterRequest): Promise<Voter> => {
        const response = await api.patch(`/voters/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/voters/${id}`);
        return response.data;
    },

    sendMobileVerificationOtp: async (id: string) => {
        const response = await api.post(`/voters/${id}/send-otp`);
        return response.data;
    },

    bulkCreate: async (pollingStationId: string, assemblyConstituencyId: string, voters: any[]) => {
        const response = await api.post("/voters/bulk-create", {
            pollingStationId,
            assemblyConstituencyId,
            voters,
        });
        return response.data;
    },

    uploadExcel: async (file: File, pollingStationId: string, assemblyConstituencyId: string) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("pollingStationId", pollingStationId);
        formData.append("assemblyConstituencyId", assemblyConstituencyId);
        const response = await api.post("/voters/upload-excel", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    verifyMobile: async (id: string, otp: string) => {
        const response = await api.post(`/voters/${id}/verify-mobile`, { otp });
        return response.data;
    },

    // ✅ Voter Sentiment Management
    getSentiments: async (params?: VoterQueryParams): Promise<PaginatedResponse<any>> => {
        const response = await api.get("/voters/with-sentiment", { params });
        return response.data;
    },

    updateSentiment: async (voterId: string, data: { status: VoterStatus; notes?: string }) => {
        const response = await api.put(`/voters/sentiments/${voterId}`, data);
        return response.data;
    },

    getSentiment: async (voterId: string) => {
        const response = await api.get(`/voters/sentiments/${voterId}`);
        return response.data;
    },

    deleteSentiment: async (voterId: string) => {
        const response = await api.delete(`/voters/sentiments/${voterId}`);
        return response.data;
    },

    getSentimentStats: async (): Promise<any> => {
        const response = await api.get("/voters/sentiment-stats");
        return response.data;
    },

    // Legacy methods for backward compatibility
    updateStatus: async (id: string, status: VoterStatus) => {
        // Use the new sentiment API
        return voterService.updateSentiment(id, { status });
    },

    bulkUpdateStatus: async (voterIds: string[], status: VoterStatus) => {
        // Batch update sentiments
        const promises = voterIds.map((voterId) => voterService.updateSentiment(voterId, { status }));
        return Promise.all(promises);
    },

    getStats: async () => {
        const response = await api.get("/voters/stats");
        return response.data;
    },

    // Party-specific voter data
    getPartyVoterData: async (params?: VoterQueryParams): Promise<PaginatedResponse<any>> => {
        const response = await api.get("/voters/party-data", { params });
        return response.data;
    },

    createPartyVoterData: async (voterId: string, data: any) => {
        const response = await api.post(`/voters/party-data/${voterId}`, data);
        return response.data;
    },

    updatePartyVoterData: async (voterId: string, data: any) => {
        const response = await api.patch(`/voters/party-data/${voterId}`, data);
        return response.data;
    },

    getPartyVoterDataById: async (voterId: string) => {
        const response = await api.get(`/voters/party-data/${voterId}`);
        return response.data;
    },

    deletePartyVoterData: async (voterId: string) => {
        const response = await api.delete(`/voters/party-data/${voterId}`);
        return response.data;
    },

    getPartyVoterStats: async () => {
        const response = await api.get("/voters/party-stats");
        return response.data;
    },
};

// District Service
export const districtService = {
    getAll: async (params?: { page?: number; limit?: number }): Promise<any> => {
        const response = await api.get("/districts", { params });
        return response.data;
    },

    getAllAssemblyConstituencies: async (): Promise<any> => {
        const response = await api.get("/districts", { params: { page: 1, limit: 1000 } });
        return response.data;
    },

    getById: async (id: string): Promise<District> => {
        const response = await api.get(`/districts/${id}`);
        return response.data;
    },

    create: async (data: { name: string; state: string }): Promise<District> => {
        const response = await api.post("/districts", data);
        return response.data;
    },

    update: async (id: string, data: { name: string; state: string }): Promise<District> => {
        const response = await api.put(`/districts/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/districts/${id}`);
        return response.data;
    },

    getAssemblyConstituencies: async (districtId: string): Promise<AssemblyConstituency[]> => {
        const response = await api.get(`/districts/${districtId}/assembly-constituencies`);
        return response.data;
    },

    createAssemblyConstituency: async (districtId: string, data: { name: string }): Promise<AssemblyConstituency> => {
        const response = await api.post(`/districts/${districtId}/assembly-constituencies`, data);
        return response.data;
    },

    getPollingStations: async (districtId: string, acId: string): Promise<PollingStation[]> => {
        const response = await api.get(`/districts/${districtId}/assembly-constituencies/${acId}/polling-stations`);
        return response.data;
    },

    createPollingStation: async (districtId: string, acId: string, data: { name: string; number: string }): Promise<PollingStation> => {
        const response = await api.post(`/districts/${districtId}/assembly-constituencies/${acId}/polling-stations`, data);
        return response.data;
    },

    updateAssemblyConstituency: async (districtId: string, id: string, data: { name?: string }): Promise<AssemblyConstituency> => {
        const response = await api.patch(`/districts/${districtId}/assembly-constituencies/${id}`, data);
        return response.data;
    },

    deleteAssemblyConstituency: async (districtId: string, id: string) => {
        const response = await api.delete(`/districts/${districtId}/assembly-constituencies/${id}`);
        return response.data;
    },

    updatePollingStation: async (districtId: string, acId: string, id: string, data: { name?: string; number?: string }): Promise<PollingStation> => {
        const response = await api.patch(`/districts/${districtId}/assembly-constituencies/${acId}/polling-stations/${id}`, data);
        return response.data;
    },

    deletePollingStation: async (districtId: string, acId: string, id: string) => {
        const response = await api.delete(`/districts/${districtId}/assembly-constituencies/${acId}/polling-stations/${id}`);
        return response.data;
    },
};

// Booth Activity Service
export const boothActivityService = {
    getAll: async (params?: { page?: number; limit?: number; activityType?: string }): Promise<PaginatedResponse<BoothActivity>> => {
        const response = await api.get("/booth-activities", { params });
        return response.data;
    },

    create: async (data: CreateBoothActivityRequest): Promise<BoothActivity> => {
        const response = await api.post("/booth-activities", data);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get("/booth-activities/stats");
        return response.data;
    },

    getVoterActivityHistory: async (voterId: string): Promise<BoothActivity[]> => {
        const response = await api.get(`/booth-activities/voter/${voterId}`);
        return response.data;
    },

    getPollingStationSummary: async (pollingStationId: string) => {
        const response = await api.get(`/booth-activities/polling-station/${pollingStationId}/summary`);
        return response.data;
    },
};

// Statistics Service
export const statsService = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await api.get("/stats/dashboard");
        return response.data;
    },

    getVoterDemographics: async (): Promise<VoterDemographics> => {
        const response = await api.get("/stats/demographics");
        return response.data;
    },

    getPollingStationPerformance: async () => {
        const response = await api.get("/stats/polling-stations/performance");
        return response.data;
    },

    getActivityTrends: async (days?: number) => {
        const response = await api.get("/stats/activities/trends", { params: { days } });
        return response.data;
    },

    getTopPerformers: async (limit?: number) => {
        const response = await api.get("/stats/top-performers", { params: { limit } });
        return response.data;
    },
};

// File Service - Secure MinIO Integration
export const fileService = {
    // ✅ Secure Voter Photo Upload with Validation
    uploadVoterPhoto: async (file: File, voterId: string, assemblyConstituencyId?: string, pollingStationId?: string): Promise<FileUploadResponse> => {
        // Client-side validation
        if (!file) {
            throw new Error("No file provided");
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            throw new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed.");
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error("File size too large. Maximum size is 5MB.");
        }

        // Validate voterId
        if (!voterId || voterId.trim() === "") {
            throw new Error("Voter ID is required");
        }

        // Validate required fields for voter photo upload
        if (!assemblyConstituencyId || !pollingStationId) {
            throw new Error("Assembly constituency ID and polling station ID are required for voter photo upload");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("assemblyConstituencyId", assemblyConstituencyId);
        formData.append("pollingStationId", pollingStationId);

        const response = await api.post(`/files/upload/voter-photo/${voterId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            timeout: 30000, // 30 second timeout
            onUploadProgress: (progressEvent) => {
                // Progress tracking can be implemented here
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
                console.log(`Upload Progress: ${percentCompleted}%`);
            },
        });

        // Return the response with filePath instead of signedUrl
        return {
            ...response.data,
            filePath: response.data.fileName, // Use fileName as the permanent file path
        };
    },

    // ✅ General File Upload
    upload: async (file: File, folder: string = "general", customFileName?: string): Promise<FileUploadResponse> => {
        // Client-side validation
        if (!file) {
            throw new Error("No file provided");
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            throw new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed.");
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error("File size too large. Maximum size is 5MB.");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        if (customFileName) {
            formData.append("customFileName", customFileName);
        }

        const response = await api.post("/files/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            timeout: 30000, // 30 second timeout
            onUploadProgress: (progressEvent) => {
                // Progress tracking can be implemented here
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
                console.log(`Upload Progress: ${percentCompleted}%`);
            },
        });

        // Return the response with filePath instead of signedUrl
        return {
            ...response.data,
            filePath: response.data.fileName, // Use fileName as the permanent file path
        };
    },

    // ✅ Get Presigned URL for Secure Access
    getSignedUrl: async (fileName: string, expiryMinutes: number = 60): Promise<{ signedUrl: string; expiryMinutes: number }> => {
        const response = await api.get(`/files/signed-url/${fileName}`, {
            params: { expiryMinutes },
        });
        return response.data;
    },

    // ✅ Get Upload URL
    getUploadUrl: async (fileName: string, expiryMinutes: number = 60): Promise<{ uploadUrl: string; expiryMinutes: number }> => {
        const response = await api.get(`/files/upload-url/${fileName}`, {
            params: { expiryMinutes },
        });
        return response.data;
    },

    // ✅ Get File Information
    getFileInfo: async (fileName: string): Promise<any> => {
        const response = await api.get(`/files/info/${fileName}`);
        return response.data;
    },

    // ✅ Delete File Securely
    delete: async (fileName: string) => {
        const response = await api.delete(`/files/${fileName}`);
        return response.data;
    },

    // ✅ List Files with Pagination
    list: async (prefix?: string): Promise<{ files: any[] }> => {
        const response = await api.get("/files/list", {
            params: { prefix: prefix || "" },
        });
        return response.data;
    },

    // ✅ Get File Statistics
    getStats: async () => {
        const response = await api.get("/files/stats");
        return response.data;
    },

    // ✅ Validate File Before Upload
    validateFile: (file: File): { isValid: boolean; error?: string } => {
        // File type validation
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return { isValid: false, error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." };
        }

        // File size validation (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return { isValid: false, error: "File size too large. Maximum size is 5MB." };
        }

        // File name validation
        const fileName = file.name.toLowerCase();
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
        const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));

        if (!hasValidExtension) {
            return { isValid: false, error: "Invalid file extension. Only .jpg, .jpeg, .png, .webp files are allowed." };
        }

        return { isValid: true };
    },
};
