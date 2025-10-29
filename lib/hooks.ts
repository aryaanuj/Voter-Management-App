import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService, userService, voterService, districtService, boothActivityService, statsService, fileService } from "./api-services";
import { LoginRequest, SendOtpRequest, RegisterRequest, UpdateProfileRequest, CreateVoterRequest, UpdateVoterRequest, VoterQueryParams, CreateBoothActivityRequest, VoterStatus } from "./types";
import apiClient from "./api-client";

// Auth Hooks
export const useSendOtp = () => {
    return useMutation({
        mutationFn: authService.sendOtp,
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        },
    });
};

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: authService.verifyOtp,
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to verify OTP");
        },
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: authService.register,
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to register user");
        },
    });
};

export const useGetProfile = () => {
    return useQuery({
        queryKey: ["profile"],
        queryFn: authService.getProfile,
        retry: false,
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            queryClient.clear();
            toast.success("Logged out successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to logout");
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.updateProfile,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success(data.message || "Profile updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update profile");
        },
    });
};

export const useUploadProfileImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.uploadProfileImage,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success(data.message || "Profile image updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to upload profile image");
        },
    });
};

// User Hooks
export const useUsers = (params?: { page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => userService.getAll(params),
    });
};

export const useUser = (id: string) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => userService.getById(id),
        enabled: !!id,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create user");
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<RegisterRequest> }) => userService.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user", id] });
            toast.success("User updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update user");
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete user");
        },
    });
};

export const useAssignConstituencies = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { userId: string; assemblyConstituencyIds: string[] }) => userService.assignConstituencies(data.userId, data.assemblyConstituencyIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Constituencies assigned successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to assign constituencies");
        },
    });
};

// Voter Hooks
export const useVoters = (params?: VoterQueryParams, options?: { enabled?: boolean; userRole?: string }) => {
    return useQuery({
        queryKey: ["voters", params, options?.userRole],
        queryFn: () => {
            // Use sentiments API for Candidate and Booth Manager roles
            if (options?.userRole === "CANDIDATE" || options?.userRole === "BOOTH_MANAGER") {
                return voterService.getSentiments(params);
            }
            // Use regular voters API for Admin and other roles
            return voterService.getAll(params);
        },
        enabled: options?.enabled !== false, // Default to true if not specified
    });
};

export const useVoter = (id: string) => {
    return useQuery({
        queryKey: ["voter", id],
        queryFn: () => voterService.getById(id),
        enabled: !!id,
    });
};

export const useCreateVoter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: voterService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["voters"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            toast.success("Voter created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create voter");
        },
    });
};

export const useUpdateVoter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateVoterRequest }) => voterService.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["voters"] });
            queryClient.invalidateQueries({ queryKey: ["voter", id] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            toast.success("Voter updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update voter");
        },
    });
};

export const useDeleteVoter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: voterService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["voters"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            toast.success("Voter deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete voter");
        },
    });
};

export const useUpdateVoterStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: VoterStatus }) => voterService.updateStatus(id, status),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["voters"] });
            queryClient.invalidateQueries({ queryKey: ["voter", id] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            toast.success("Voter status updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update voter status");
        },
    });
};

export const useBulkUpdateVoterStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ voterIds, status }: { voterIds: string[]; status: VoterStatus }) => voterService.bulkUpdateStatus(voterIds, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["voters"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            toast.success("Voter statuses updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update voter statuses");
        },
    });
};

export const useSendVoterOtp = () => {
    return useMutation({
        mutationFn: (voterId: string) => voterService.sendMobileVerificationOtp(voterId),
        onSuccess: () => {
            toast.success("OTP sent successfully to voter mobile number");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        },
    });
};

export const useVerifyVoterMobile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, otp }: { id: string; otp: string }) => voterService.verifyMobile(id, otp),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["voters"] });
            toast.success("Mobile number verified successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to verify mobile number");
        },
    });
};

export const useVoterStats = () => {
    return useQuery({
        queryKey: ["voter-stats"],
        queryFn: voterService.getStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// ✅ Sentiment Management Hooks
export const useSentiments = (params?: VoterQueryParams, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ["sentiments", params],
        queryFn: () => voterService.getSentiments(params),
        enabled: options?.enabled !== false,
    });
};

export const useSentiment = (voterId: string) => {
    return useQuery({
        queryKey: ["sentiment", voterId],
        queryFn: () => voterService.getSentiment(voterId),
        enabled: !!voterId,
    });
};

export const useSentimentStats = () => {
    return useQuery({
        queryKey: ["sentimentStats"],
        queryFn: voterService.getSentimentStats,
    });
};

export const useUpdateSentiment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ voterId, data }: { voterId: string; data: { status: VoterStatus; notes?: string } }) => voterService.updateSentiment(voterId, data),
        onSuccess: (_, { voterId }) => {
            queryClient.invalidateQueries({ queryKey: ["sentiments"] });
            queryClient.invalidateQueries({ queryKey: ["sentiment", voterId] });
            queryClient.invalidateQueries({ queryKey: ["sentimentStats"] });
            queryClient.invalidateQueries({ queryKey: ["voters"] });
            toast.success("Sentiment updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update sentiment");
        },
    });
};

export const useDeleteSentiment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (voterId: string) => voterService.deleteSentiment(voterId),
        onSuccess: (_, voterId) => {
            queryClient.invalidateQueries({ queryKey: ["sentiments"] });
            queryClient.invalidateQueries({ queryKey: ["sentiment", voterId] });
            queryClient.invalidateQueries({ queryKey: ["sentimentStats"] });
            queryClient.invalidateQueries({ queryKey: ["voters"] });
            toast.success("Sentiment deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete sentiment");
        },
    });
};

// File Upload Hook - Secure Implementation
export const useFileUpload = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ file, voterId, assemblyConstituencyId, pollingStationId }: { file: File; voterId: string; assemblyConstituencyId?: string; pollingStationId?: string }) => {
            // Validate file before upload
            const validation = fileService.validateFile(file);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            // Use the secure voter photo upload service
            const uploadResult = await fileService.uploadVoterPhoto(file, voterId, assemblyConstituencyId, pollingStationId);

            // Update voter record with permanent file path (not signed URL)
            if (uploadResult?.filePath) {
                await voterService.update(voterId, { photoUrl: uploadResult.filePath });
            }

            return uploadResult;
        },
        onSuccess: (data, { voterId }) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ["voters"] });
            queryClient.invalidateQueries({ queryKey: ["voter", voterId] });
            queryClient.invalidateQueries({ queryKey: ["files"] });
            queryClient.invalidateQueries({ queryKey: ["fileStats"] });

            toast.success("File uploaded successfully");
        },
        onError: (error: any) => {
            const errorMessage = error.message || error.response?.data?.message || "Failed to upload file";
            toast.error(errorMessage);
        },
    });
};

// Image Display Hook - Get Signed URL for Display
export const useImageUrl = (filePath?: string, expiryMinutes: number = 60) => {
    return useQuery({
        queryKey: ["imageUrl", filePath, expiryMinutes],
        queryFn: async () => {
            if (!filePath) return null;

            // If it's already a full URL (signed URL), return as is
            if (filePath.startsWith("http")) {
                return filePath;
            }

            // Get signed URL for the file path
            const response = await fileService.getSignedUrl(filePath, expiryMinutes);
            return response.signedUrl;
        },
        enabled: !!filePath,
        staleTime: 1000 * 60 * 5, // 5 minutes - signed URLs are valid for 60 minutes by default
        retry: 2,
    });
};

// Additional File Management Hooks
export const useFileList = (prefix?: string) => {
    return useQuery({
        queryKey: ["files", prefix],
        queryFn: () => fileService.list(prefix),
    });
};

export const useFileInfo = (fileName: string) => {
    return useQuery({
        queryKey: ["file", fileName],
        queryFn: () => fileService.getFileInfo(fileName),
        enabled: !!fileName,
    });
};

export const useSignedUrl = (fileName: string, expiryMinutes?: number) => {
    return useQuery({
        queryKey: ["signedUrl", fileName, expiryMinutes],
        queryFn: () => fileService.getSignedUrl(fileName, expiryMinutes),
        enabled: !!fileName,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useDeleteFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (fileName: string) => fileService.delete(fileName),
        onSuccess: (_, fileName) => {
            queryClient.invalidateQueries({ queryKey: ["files"] });
            queryClient.invalidateQueries({ queryKey: ["file", fileName] });
            queryClient.invalidateQueries({ queryKey: ["fileStats"] });
            toast.success("File deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete file");
        },
    });
};

export const useFileStats = () => {
    return useQuery({
        queryKey: ["fileStats"],
        queryFn: fileService.getStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// District Hooks
export const useDistricts = (params?: { page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ["districts", params],
        queryFn: () => districtService.getAll(params),
    });
};

export const useDistrictsWithConstituencies = () => {
    return useQuery({
        queryKey: ["districts-with-constituencies"],
        queryFn: () => districtService.getAllAssemblyConstituencies(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useAssemblyConstituencies = (districtId: string) => {
    return useQuery({
        queryKey: ["assembly-constituencies", districtId],
        queryFn: () => districtService.getAssemblyConstituencies(districtId),
        enabled: !!districtId,
    });
};

export const usePollingStations = (districtId: string, acId: string) => {
    return useQuery({
        queryKey: ["polling-stations", districtId, acId],
        queryFn: () => districtService.getPollingStations(districtId, acId),
        enabled: !!districtId && !!acId,
    });
};

// District Mutations
export const useCreateDistrict = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: districtService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["districts"] });
            toast.success("District created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create district");
        },
    });
};

export const useUpdateDistrict = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => districtService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["districts"] });
            toast.success("District updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update district");
        },
    });
};

export const useDeleteDistrict = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: districtService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["districts"] });
            toast.success("District deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete district");
        },
    });
};

export const useCreateAssemblyConstituency = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ districtId, data }: { districtId: string; data: any }) => districtService.createAssemblyConstituency(districtId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["districts"] });
            queryClient.invalidateQueries({ queryKey: ["assembly-constituencies"] });
            toast.success("Assembly constituency created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create assembly constituency");
        },
    });
};

export const useCreatePollingStation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ districtId, acId, data }: { districtId: string; acId: string; data: any }) => districtService.createPollingStation(districtId, acId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["districts"] });
            queryClient.invalidateQueries({ queryKey: ["polling-stations"] });
            toast.success("Polling station created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create polling station");
        },
    });
};

export const useDeleteAssemblyConstituency = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ districtId, id }: { districtId: string; id: string }) => districtService.deleteAssemblyConstituency(districtId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["districts"] });
            queryClient.invalidateQueries({ queryKey: ["assembly-constituencies"] });
            toast.success("Assembly constituency deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete assembly constituency");
        },
    });
};

export const useDeletePollingStation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ districtId, acId, id }: { districtId: string; acId: string; id: string }) => districtService.deletePollingStation(districtId, acId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["districts"] });
            queryClient.invalidateQueries({ queryKey: ["polling-stations"] });
            toast.success("Polling station deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete polling station");
        },
    });
};

// Voter Upload Hooks
export const useBulkCreateVoters = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ pollingStationId, assemblyConstituencyId, voters }: { pollingStationId: string; assemblyConstituencyId: string; voters: any[] }) =>
            voterService.bulkCreate(pollingStationId, assemblyConstituencyId, voters),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["voters"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            toast.success("Voters created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create voters");
        },
    });
};

export const useUploadVotersExcel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ file, pollingStationId, assemblyConstituencyId }: { file: File; pollingStationId: string; assemblyConstituencyId: string }) =>
            voterService.uploadExcel(file, pollingStationId, assemblyConstituencyId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["voters"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            toast.success(`Successfully uploaded voters! Created: ${data.created}, Failed: ${data.failed}`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to upload voters");
        },
    });
};

// Booth Activity Hooks
export const useBoothActivities = (params?: { page?: number; limit?: number; activityType?: string }) => {
    return useQuery({
        queryKey: ["booth-activities", params],
        queryFn: () => boothActivityService.getAll(params),
    });
};

export const useCreateBoothActivity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: boothActivityService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["booth-activities"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
            toast.success("Activity recorded successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to record activity");
        },
    });
};

export const useBoothActivityStats = () => {
    return useQuery({
        queryKey: ["booth-activity-stats"],
        queryFn: boothActivityService.getStats,
    });
};

export const useVoterActivityHistory = (voterId: string) => {
    return useQuery({
        queryKey: ["voter-activity-history", voterId],
        queryFn: () => boothActivityService.getVoterActivityHistory(voterId),
        enabled: !!voterId,
    });
};

// Statistics Hooks
export const useDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: statsService.getDashboardStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useVoterDemographics = () => {
    return useQuery({
        queryKey: ["voter-demographics"],
        queryFn: statsService.getVoterDemographics,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

export const usePollingStationPerformance = () => {
    return useQuery({
        queryKey: ["polling-station-performance"],
        queryFn: statsService.getPollingStationPerformance,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useActivityTrends = (days?: number) => {
    return useQuery({
        queryKey: ["activity-trends", days],
        queryFn: () => statsService.getActivityTrends(days),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useTopPerformers = (limit?: number) => {
    return useQuery({
        queryKey: ["top-performers", limit],
        queryFn: () => statsService.getTopPerformers(limit),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// File Hooks
export const useFiles = (prefix?: string) => {
    return useQuery({
        queryKey: ["files", prefix],
        queryFn: () => fileService.list(prefix),
    });
};
