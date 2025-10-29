"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, CheckCircle, AlertCircle, Camera, Image as ImageIcon } from "lucide-react";
import { useFileUpload } from "@/lib/hooks";
import { fileService } from "@/lib/api-services";
import { toast } from "sonner";

interface SecureFileUploadProps {
    voterId: string;
    assemblyConstituencyId?: string;
    pollingStationId?: string;
    onUploadSuccess?: (filePath: string) => void;
    onUploadError?: (error: string) => void;
    maxFileSize?: number; // in MB
    allowedTypes?: string[];
    className?: string;
    disabled?: boolean;
}

export function SecureFileUpload({
    voterId,
    assemblyConstituencyId,
    pollingStationId,
    onUploadSuccess,
    onUploadError,
    maxFileSize = 5,
    allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    className = "",
    disabled = false,
}: SecureFileUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fileUploadMutation = useFileUpload();

    // Handle file selection
    const handleFileSelect = useCallback(
        (file: File) => {
            setValidationError(null);

            // Validate file
            const validation = fileService.validateFile(file);
            if (!validation.isValid) {
                setValidationError(validation.error!);
                return;
            }

            // Additional size check
            const maxSizeBytes = maxFileSize * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                setValidationError(`File size too large. Maximum size is ${maxFileSize}MB.`);
                return;
            }

            // Additional type check
            if (!allowedTypes.includes(file.type)) {
                setValidationError(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`);
                return;
            }

            setSelectedFile(file);

            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        },
        [maxFileSize, allowedTypes]
    );

    // Handle file input change
    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // Handle drag and drop
    const handleDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            if (file) {
                handleFileSelect(file);
            }
        },
        [handleFileSelect]
    );

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    // Handle upload
    const handleUpload = async () => {
        if (!selectedFile || !voterId) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const result = await fileUploadMutation.mutateAsync({
                file: selectedFile,
                voterId,
                assemblyConstituencyId,
                pollingStationId,
            });

            // Simulate progress (in real implementation, this would come from the upload progress)
            for (let i = 0; i <= 100; i += 10) {
                setUploadProgress(i);
                await new Promise((resolve) => setTimeout(resolve, 50));
            }

            onUploadSuccess?.(result.filePath || result.fileName);
            toast.success("File uploaded successfully");

            // Reset form
            setSelectedFile(null);
            setPreviewUrl(null);
            setUploadProgress(0);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error: any) {
            const errorMessage = error.message || "Failed to upload file";
            onUploadError?.(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setValidationError(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* File Input */}
            <input ref={fileInputRef} type="file" accept={allowedTypes.join(",")} onChange={handleFileInputChange} className="hidden" disabled={disabled || isUploading} />

            {/* Upload Area */}
            {!selectedFile && (
                <Card
                    className={`border-2 border-dashed border-gray-300 hover:border-violet-400 transition-colors cursor-pointer ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <div className="p-4 bg-violet-100 rounded-full mb-4">
                            <Camera className="h-8 w-8 text-violet-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Voter Photo</h3>
                        <p className="text-sm text-gray-600 text-center mb-4">Click to select or drag and drop an image file</p>
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>Supported formats: JPEG, PNG, WebP</p>
                            <p>Maximum size: {maxFileSize}MB</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* File Preview */}
            {selectedFile && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                            {/* Preview Image */}
                            <div className="relative">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                                ) : (
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{selectedFile.name}</h4>
                                <p className="text-sm text-gray-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                <p className="text-xs text-gray-500">{selectedFile.type}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {!isUploading && (
                                    <Button size="sm" variant="outline" onClick={handleCancel} disabled={disabled}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Upload Progress */}
                        {isUploading && (
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <Progress value={uploadProgress} className="h-2" />
                            </div>
                        )}

                        {/* Upload Button */}
                        {!isUploading && (
                            <div className="mt-4 flex gap-2">
                                <Button onClick={handleUpload} disabled={disabled || !!validationError} className="flex-1">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Photo
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Validation Error */}
            {validationError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{validationError}</AlertDescription>
                </Alert>
            )}

            {/* Upload Success */}
            {fileUploadMutation.isSuccess && (
                <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>File uploaded successfully!</AlertDescription>
                </Alert>
            )}

            {/* Upload Error */}
            {fileUploadMutation.isError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{fileUploadMutation.error?.message || "Failed to upload file"}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
