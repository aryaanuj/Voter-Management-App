"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, FileSpreadsheet, Plus, User, Loader2 } from "lucide-react";
import { useUploadVotersExcel, useBulkCreateVoters } from "@/lib/hooks";
import { toast } from "sonner";

interface VoterUploadModalProps {
    pollingStationId: string;
    assemblyConstituencyId: string;
    pollingStationName: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function VoterUploadModal({ pollingStationId, assemblyConstituencyId, pollingStationName, isOpen, onClose, onSuccess }: VoterUploadModalProps) {
    const [uploadMode, setUploadMode] = useState<"excel" | "manual">("excel");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [manualVoters, setManualVoters] = useState<Array<any>>([
        { voterId: "", name: "", mobile: "", fatherName: "", motherName: "", age: "", gender: "", religion: "", caste: "", category: "", address: "", pincode: "", village: "" },
    ]);

    const { mutate: uploadExcel, isPending: isUploadingExcel } = useUploadVotersExcel();
    const { mutate: bulkCreate, isPending: isCreating } = useBulkCreateVoters();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.includes("spreadsheet") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
                setSelectedFile(file);
            } else {
                toast.error("Please upload a valid Excel file (.xlsx or .xls)");
            }
        }
    };

    const handleManualVoterChange = (index: number, field: string, value: string) => {
        const updated = [...manualVoters];
        updated[index] = { ...updated[index], [field]: value };
        setManualVoters(updated);
    };

    const addManualVoter = () => {
        setManualVoters([
            ...manualVoters,
            { voterId: "", name: "", mobile: "", fatherName: "", motherName: "", age: "", gender: "", religion: "", caste: "", category: "", address: "", pincode: "", village: "" },
        ]);
    };

    const removeManualVoter = (index: number) => {
        if (manualVoters.length > 1) {
            setManualVoters(manualVoters.filter((_, i) => i !== index));
        }
    };

    const handleExcelUpload = () => {
        if (!selectedFile) {
            toast.error("Please select an Excel file");
            return;
        }

        uploadExcel(
            { file: selectedFile, pollingStationId, assemblyConstituencyId },
            {
                onSuccess: () => {
                    setSelectedFile(null);
                    if (onSuccess) onSuccess();
                    onClose();
                },
            }
        );
    };

    const handleManualSubmit = () => {
        const validVoters = manualVoters.filter((v) => v.voterId && v.name);
        if (validVoters.length === 0) {
            toast.error("Please add at least one voter with Voter ID and Name");
            return;
        }

        bulkCreate(
            { pollingStationId, assemblyConstituencyId, voters: validVoters },
            {
                onSuccess: () => {
                    setManualVoters([
                        { voterId: "", name: "", mobile: "", fatherName: "", motherName: "", age: "", gender: "", religion: "", caste: "", category: "", address: "", pincode: "", village: "" },
                    ]);
                    if (onSuccess) onSuccess();
                    onClose();
                },
            }
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
            <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold">Add Voters</h2>
                        <p className="text-sm text-gray-500 mt-1">{pollingStationName}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                {/* Mode Selector */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setUploadMode("excel")}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${uploadMode === "excel" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-700"}`}
                    >
                        <Upload className="h-4 w-4 inline mr-2" />
                        Upload Excel
                    </button>
                    <button
                        onClick={() => setUploadMode("manual")}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${uploadMode === "manual" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-700"}`}
                    >
                        <User className="h-4 w-4 inline mr-2" />
                        Manual Entry
                    </button>
                </div>

                {/* Excel Upload Mode */}
                {uploadMode === "excel" && (
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-sm text-gray-600 mb-2">Upload Excel file with voter details</p>
                            <input type="file" accept=".xlsx,.xls" onChange={handleFileSelect} className="hidden" id="excel-upload" />
                            <label htmlFor="excel-upload">
                                <Button variant="outline" className="cursor-pointer">
                                    <Upload className="h-4 w-4 mr-2" />
                                    {selectedFile ? selectedFile.name : "Choose File"}
                                </Button>
                            </label>
                            {selectedFile && <p className="text-xs text-gray-500 mt-2">File selected: {selectedFile.name}</p>}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-xs font-medium text-blue-900 mb-2">Excel Format Required:</p>
                            <p className="text-xs text-blue-800">Voter ID, Name, Father Name, Mother Name, Mobile, Email, Age, Gender, Religion, Caste, Category, Address, Pincode, Village</p>
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={onClose} variant="outline" className="flex-1 h-12" disabled={isUploadingExcel}>
                                Cancel
                            </Button>
                            <Button onClick={handleExcelUpload} className="flex-1 h-12 bg-violet-600 hover:bg-violet-700 text-white" disabled={!selectedFile || isUploadingExcel}>
                                {isUploadingExcel ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Voters
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Manual Entry Mode */}
                {uploadMode === "manual" && (
                    <div className="space-y-4">
                        <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                            {manualVoters.map((voter, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-sm">Voter {index + 1}</h4>
                                        {manualVoters.length > 1 && (
                                            <Button variant="ghost" size="sm" onClick={() => removeManualVoter(index)} className="text-red-600 hover:text-red-700 h-7">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <Input placeholder="Voter ID *" value={voter.voterId} onChange={(e) => handleManualVoterChange(index, "voterId", e.target.value)} className="text-sm" />
                                        <Input placeholder="Name *" value={voter.name} onChange={(e) => handleManualVoterChange(index, "name", e.target.value)} className="text-sm" />
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="Mobile" value={voter.mobile} onChange={(e) => handleManualVoterChange(index, "mobile", e.target.value)} className="text-sm" />
                                            <Input placeholder="Age" value={voter.age} onChange={(e) => handleManualVoterChange(index, "age", e.target.value)} className="text-sm" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                placeholder="Father Name"
                                                value={voter.fatherName}
                                                onChange={(e) => handleManualVoterChange(index, "fatherName", e.target.value)}
                                                className="text-sm"
                                            />
                                            <Input
                                                placeholder="Mother Name"
                                                value={voter.motherName}
                                                onChange={(e) => handleManualVoterChange(index, "motherName", e.target.value)}
                                                className="text-sm"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="Gender" value={voter.gender} onChange={(e) => handleManualVoterChange(index, "gender", e.target.value)} className="text-sm" />
                                            <Input placeholder="Religion" value={voter.religion} onChange={(e) => handleManualVoterChange(index, "religion", e.target.value)} className="text-sm" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="Caste" value={voter.caste} onChange={(e) => handleManualVoterChange(index, "caste", e.target.value)} className="text-sm" />
                                            <Input placeholder="Category" value={voter.category} onChange={(e) => handleManualVoterChange(index, "category", e.target.value)} className="text-sm" />
                                        </div>
                                        <Input placeholder="Address" value={voter.address} onChange={(e) => handleManualVoterChange(index, "address", e.target.value)} className="text-sm" />
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input placeholder="Village" value={voter.village} onChange={(e) => handleManualVoterChange(index, "village", e.target.value)} className="text-sm" />
                                            <Input placeholder="Pincode" value={voter.pincode} onChange={(e) => handleManualVoterChange(index, "pincode", e.target.value)} className="text-sm" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button onClick={addManualVoter} variant="outline" className="w-full border-dashed">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Another Voter
                        </Button>

                        <div className="flex gap-3">
                            <Button onClick={onClose} variant="outline" className="flex-1 h-12" disabled={isCreating}>
                                Cancel
                            </Button>
                            <Button onClick={handleManualSubmit} className="flex-1 h-12 bg-violet-600 hover:bg-violet-700 text-white" disabled={isCreating}>
                                {isCreating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Voters ({manualVoters.filter((v) => v.voterId && v.name).length})
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
