"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Check, Loader2, MapPin, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useDistrictsWithConstituencies, useAssignConstituencies } from "@/lib/hooks";
import { AssemblyConstituency, District } from "@/lib/types";
import { Input } from "@/components/ui/input";

interface AssignConstituencyModalProps {
    userId: string;
    userName: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    assignedConstituencies?: Array<{ id: string; name: string; district: { id: string; name: string } }>;
}

export function AssignConstituencyModal({ userId, userName, isOpen, onClose, onSuccess, assignedConstituencies = [] }: AssignConstituencyModalProps) {
    const [selectedConstituencies, setSelectedConstituencies] = useState<string[]>([]);
    const [expandedDistricts, setExpandedDistricts] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");

    const { data: districtsData, isLoading } = useDistrictsWithConstituencies();
    const { mutate: assignConstituencies, isPending } = useAssignConstituencies();

    const districts = districtsData?.data || [];

    // Update selected when modal opens or assigned constituencies change
    useEffect(() => {
        console.log("Modal effect triggered - isOpen:", isOpen);
        console.log("Assigned constituencies data:", JSON.stringify(assignedConstituencies, null, 2));

        if (isOpen) {
            if (assignedConstituencies && assignedConstituencies.length > 0) {
                console.log("Processing assigned constituencies:", assignedConstituencies);
                const assignedIds = assignedConstituencies
                    .map((ac) => {
                        console.log("Processing AC:", ac);
                        return ac?.id;
                    })
                    .filter((id) => id && id !== "undefined");
                console.log("Setting selected constituencies to:", assignedIds);
                setSelectedConstituencies(assignedIds);

                // Auto-expand districts that have assigned constituencies - need to wait for districts to load
                if (districts && districts.length > 0) {
                    const districtsWithAssigned = new Set<string>();
                    districts.forEach((district: District & { assemblyConstituencies: AssemblyConstituency[] }) => {
                        const hasAssigned = district.assemblyConstituencies?.some((ac) => assignedIds.includes(ac.id));
                        if (hasAssigned) {
                            districtsWithAssigned.add(district.id);
                        }
                    });
                    console.log("Auto-expanding districts:", Array.from(districtsWithAssigned));
                    setExpandedDistricts(districtsWithAssigned);
                }
            } else {
                console.log("No assigned constituencies, clearing selection");
                setSelectedConstituencies([]);
            }
        }
    }, [isOpen, assignedConstituencies, districts]);

    // Filter districts and constituencies based on search
    const filteredDistricts = useMemo(() => {
        if (!searchTerm) return districts;

        const lowerSearch = searchTerm.toLowerCase();
        return districts.filter((district: District & { assemblyConstituencies: AssemblyConstituency[] }) => {
            const matchesDistrict = district.name.toLowerCase().includes(lowerSearch);
            const constituents = district.assemblyConstituencies || [];
            const matchesConstituency = constituents.some((ac) => ac.name.toLowerCase().includes(lowerSearch));
            return matchesDistrict || matchesConstituency;
        });
    }, [districts, searchTerm]);

    const toggleConstituency = (constituencyId: string) => {
        setSelectedConstituencies((prev) => (prev.includes(constituencyId) ? prev.filter((id) => id !== constituencyId) : [...prev, constituencyId]));
    };

    const toggleDistrict = (districtId: string) => {
        setExpandedDistricts((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(districtId)) {
                newSet.delete(districtId);
            } else {
                newSet.add(districtId);
            }
            return newSet;
        });
    };

    const handleSelectAllInDistrict = (district: District & { assemblyConstituencies: AssemblyConstituency[] }) => {
        const constituencyIds = (district.assemblyConstituencies || []).map((c) => c.id);
        const allSelected = constituencyIds.every((id) => selectedConstituencies.includes(id));

        if (allSelected) {
            setSelectedConstituencies((prev) => prev.filter((id) => !constituencyIds.includes(id)));
        } else {
            setSelectedConstituencies((prev) => [...new Set([...prev, ...constituencyIds])]);
        }
    };

    const handleSelectAll = () => {
        const allIds: string[] = [];
        filteredDistricts.forEach((district: District & { assemblyConstituencies: AssemblyConstituency[] }) => {
            const constituencies = district.assemblyConstituencies || [];
            constituencies.forEach((ac) => {
                allIds.push(ac.id);
            });
        });

        const allSelected = allIds.every((id) => selectedConstituencies.includes(id));
        if (allSelected) {
            setSelectedConstituencies([]);
        } else {
            setSelectedConstituencies(allIds);
        }
    };

    const handleSubmit = () => {
        // Filter out null or undefined values
        const validConstituencies = selectedConstituencies.filter((id) => id !== null && id !== undefined && id !== "");

        if (validConstituencies.length === 0) {
            return;
        }

        console.log("Submitting constituencies:", validConstituencies);

        assignConstituencies(
            { userId, assemblyConstituencyIds: validConstituencies },
            {
                onSuccess: () => {
                    onClose();
                    if (onSuccess) onSuccess();
                    setSearchTerm("");
                    // Don't clear selected constituencies on success, keep them for the modal state
                },
            }
        );
    };

    const handleClose = () => {
        if (!isPending) {
            onClose();
            setSearchTerm("");
            // Don't clear selected constituencies when closing, they will be reset by useEffect when modal reopens
        }
    };

    const totalConstituencies = filteredDistricts.reduce((acc, district: District & { assemblyConstituencies: AssemblyConstituency[] }) => {
        return acc + ((district.assemblyConstituencies || []).length || 0);
    }, 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50 animate-in slide-in-from-bottom">
            <div className="bg-white w-full rounded-t-3xl max-h-[90vh] flex flex-col shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b bg-gradient-to-r from-violet-50 to-white">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">Assign Constituencies</h2>
                        <p className="text-sm text-gray-600 mt-1">{userName}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleClose} disabled={isPending} className="hover:bg-violet-100">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Search and Actions */}
                <div className="px-6 pt-4 space-y-3 bg-white border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search districts or constituencies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11 bg-gray-50 border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                        />
                    </div>
                    <div className="flex items-center gap-3 pb-2">
                        <Button
                            onClick={handleSelectAll}
                            variant="outline"
                            size="sm"
                            className="text-xs font-medium h-8 px-3 border-gray-300 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700"
                        >
                            {selectedConstituencies.length === totalConstituencies && totalConstituencies > 0 ? "Deselect All" : "Select All"}
                        </Button>
                        <span className="text-xs text-gray-500">
                            {filteredDistricts.length} district{filteredDistricts.length !== 1 ? "s" : ""} • {totalConstituencies} constituencies
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                        </div>
                    ) : filteredDistricts.length === 0 ? (
                        <div className="text-center py-16">
                            <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">No districts found</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                        </div>
                    ) : (
                        filteredDistricts.map((district: District & { assemblyConstituencies: AssemblyConstituency[] }) => {
                            const constituencyCount = (district.assemblyConstituencies || []).length || 0;
                            const selectedCount = (district.assemblyConstituencies || []).filter((c) => selectedConstituencies.includes(c.id)).length || 0;
                            const allSelected = constituencyCount > 0 && selectedCount === constituencyCount;
                            const isExpanded = expandedDistricts.has(district.id);

                            return (
                                <Card key={district.id} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-0">
                                        {/* District Header */}
                                        <button onClick={() => toggleDistrict(district.id)} className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="h-5 w-5 text-violet-600" />
                                                </div>
                                                <div className="text-left flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 truncate">{district.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {constituencyCount} constituency{constituencyCount !== 1 ? "ies" : ""} • {selectedCount} selected
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectAllInDistrict(district);
                                                    }}
                                                    className="text-xs font-medium text-violet-600 hover:text-violet-700 px-2 py-1 rounded hover:bg-violet-50 transition-colors"
                                                >
                                                    {allSelected ? "Deselect" : "Select All"}
                                                </button>
                                                {constituencyCount > 0 && <div className="text-gray-400">{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</div>}
                                            </div>
                                        </button>

                                        {/* Constituencies List */}
                                        {isExpanded && constituencyCount > 0 && (
                                            <div className="border-t border-gray-100 divide-y divide-gray-50">
                                                {(district.assemblyConstituencies || []).map((constituency, index) => {
                                                    const isSelected = selectedConstituencies.includes(constituency.id);
                                                    if (index === 0) {
                                                        console.log(`Checking constituency ${constituency.name} (${constituency.id}): isSelected=${isSelected}`);
                                                        console.log(`Current selectedConstituencies:`, selectedConstituencies);
                                                    }
                                                    return (
                                                        <button
                                                            key={constituency.id}
                                                            onClick={() => toggleConstituency(constituency.id)}
                                                            className={`w-full px-5 py-3.5 flex items-center justify-between transition-all duration-150 ${
                                                                isSelected ? "bg-violet-50 hover:bg-violet-100" : "hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3 flex-1">
                                                                <div
                                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                                                        isSelected ? "bg-violet-600 border-violet-600" : "border-gray-300"
                                                                    }`}
                                                                >
                                                                    {isSelected && <Check className="h-3 w-3 text-white" />}
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-700">{constituency.name}</span>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t bg-white">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                {selectedConstituencies.length} constituency{selectedConstituencies.length !== 1 ? "ies" : ""} selected
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">Click Assign to confirm selection</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handleClose} variant="outline" className="flex-1 h-12 border-gray-300 hover:bg-gray-50" disabled={isPending}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white shadow-md"
                            disabled={isPending || selectedConstituencies.length === 0}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Assigning...
                                </>
                            ) : (
                                `Assign (${selectedConstituencies.length})`
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
