// User Types
export enum UserRole {
    ADMIN = "ADMIN",
    CANDIDATE = "CANDIDATE",
    BOOTH_MANAGER = "BOOTH_MANAGER",
}

export interface User {
    id: string;
    email?: string;
    mobile: string;
    name: string;
    role: UserRole;
    profileImage?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    candidateProfile?: {
        partyName?: string;
        symbol?: string;
        assemblyConstituencies?: Array<{
            assemblyConstituency: {
                id: string;
                name: string;
                district: {
                    id: string;
                    name: string;
                };
            };
        }>;
    };
    boothManagerProfile?: {
        pollingStation?: {
            id: string;
            name: string;
            number: string;
            assemblyConstituency?: {
                id: string;
                name: string;
            };
        };
    };
}

// Auth Types
export interface LoginRequest {
    mobile: string;
    otp: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface SendOtpRequest {
    mobile: string;
}

export interface RegisterRequest {
    mobile: string;
    name: string;
    role: UserRole;
    email?: string;
    isActive?: boolean;
}

export interface UpdateProfileRequest {
    name?: string;
    email?: string;
    mobile?: string;
}

export interface ProfileUpdateResponse {
    user: User;
    message: string;
}

// Voter Types
export enum VoterStatus {
    FAVOUR = "FAVOUR",
    AGAINST = "AGAINST",
    NEUTRAL = "NEUTRAL",
}

export enum VoterCategory {
    GENERAL = "GENERAL",
    SC = "SC",
    ST = "ST",
    OBC = "OBC",
    OTHER = "OTHER",
}

export interface Voter {
    id: string;
    voterId: string;
    name: string;
    fatherName?: string;
    motherName?: string;
    mobile?: string;
    email?: string;
    age?: number;
    gender?: string;
    religion?: string;
    caste?: string;
    category?: VoterCategory;
    status?: VoterStatus;
    address?: string;
    photoUrl?: string;
    isMobileVerified: boolean;
    assemblyConstituencyId: string;
    pollingStationId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateVoterRequest {
    voterId: string;
    name: string;
    fatherName?: string;
    motherName?: string;
    mobile?: string;
    email?: string;
    age?: number;
    gender?: string;
    religion?: string;
    caste?: string;
    category?: VoterCategory;
    address?: string;
    assemblyConstituencyId: string;
    pollingStationId: string;
}

export interface UpdateVoterRequest {
    name?: string;
    fatherName?: string;
    motherName?: string;
    mobile?: string;
    email?: string;
    age?: number;
    gender?: string;
    religion?: string;
    caste?: string;
    category?: VoterCategory;
    address?: string;
    photoUrl?: string;
}

export interface VoterQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: VoterStatus;
    category?: VoterCategory;
    assemblyConstituencyId?: string;
    pollingStationId?: string;
    search?: string;
}

// District Types
export interface District {
    id: string;
    name: string;
    state: string;
    createdAt: string;
    updatedAt: string;
}

export interface AssemblyConstituency {
    id: string;
    name: string;
    districtId: string;
    createdAt: string;
    updatedAt: string;
    district?: District;
    pollingStations?: PollingStation[];
    _count?: {
        voters?: number;
    };
}

export interface PollingStation {
    id: string;
    name: string;
    number: string;
    assemblyConstituencyId: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        voters?: number;
    };
}

// District Management Types
export interface CreateDistrictRequest {
    name: string;
    state: string;
}

export interface UpdateDistrictRequest {
    name?: string;
    state?: string;
}

export interface CreateAssemblyConstituencyRequest {
    name: string;
}

export interface UpdateAssemblyConstituencyRequest {
    name?: string;
}

export interface CreatePollingStationRequest {
    name: string;
    number: string;
}

export interface UpdatePollingStationRequest {
    name?: string;
    number?: string;
}

export interface AssignConstituencyRequest {
    userId: string;
    assemblyConstituencyIds: string[];
}

export interface AssignConstituencyResponse {
    message: string;
    data: any;
}

// Booth Activity Types
export interface BoothActivity {
    id: string;
    voterId: string;
    candidateId?: string;
    activityType: string;
    description?: string;
    metadata?: any;
    createdAt: string;
}

export interface CreateBoothActivityRequest {
    voterId: string;
    activityType: string;
    description?: string;
    metadata?: any;
}

// Statistics Types
export interface DashboardStats {
    voters: {
        total: number;
        favour: number;
        against: number;
        neutral: number;
        verifiedMobile: number;
        withPhoto: number;
        favourPercentage: number;
        againstPercentage: number;
        neutralPercentage: number;
        mobileVerificationPercentage: number;
        photoUploadPercentage: number;
    };
    activities: {
        total: number;
        today: number;
    };
}

export interface VoterDemographics {
    ageGroups: Array<{
        age: number;
        count: number;
    }>;
    genderDistribution: Array<{
        gender: string;
        count: number;
    }>;
    categoryDistribution: Array<{
        category: string;
        count: number;
    }>;
    religionDistribution: Array<{
        religion: string;
        count: number;
    }>;
    casteDistribution: Array<{
        caste: string;
        count: number;
    }>;
}

export interface PollingStationPerformance {
    id: string;
    name: string;
    number: string;
    totalVoters: number;
    favourVoters: number;
    againstVoters: number;
    neutralVoters: number;
    verifiedMobileVoters: number;
    votersWithPhoto: number;
    totalActivities: number;
    favourPercentage: number;
    againstPercentage: number;
    neutralPercentage: number;
    mobileVerificationPercentage: number;
    photoUploadPercentage: number;
    boothManagers: Array<{
        id: string;
        name: string;
        mobile: string;
    }>;
}

export interface ActivityTrend {
    date: string;
    activities: Record<string, number>;
    total: number;
}

export interface TopPerformer {
    id: string;
    name: string;
    number: string;
    totalVoters: number;
    favourVoters: number;
    totalActivities: number;
    favourPercentage: number;
    performanceScore: number;
}

// File Upload Types
export interface FileUploadResponse {
    message: string;
    fileName: string;
    filePath: string; // Permanent file path for storage in database
    signedUrl?: string; // Optional signed URL for immediate display
}

// API Response Types
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext?: boolean;
        hasPrev?: boolean;
    };
}

export interface ApiError {
    message: string;
    statusCode: number;
    error?: string;
}

// Form Types
export interface VoterFormData {
    id?: string;
    name: string;
    voterId: string;
    fatherName?: string;
    motherName?: string;
    mobile?: string;
    email?: string;
    age?: number;
    gender?: string;
    religion?: string;
    caste?: string;
    category?: VoterCategory;
    address?: string;
    assemblyConstituencyId: string;
    pollingStationId: string;
    notes?: string;
}
