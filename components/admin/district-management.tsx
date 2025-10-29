"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, MapPin, ChevronDown, ChevronUp, Edit2, Trash2, X, Save, Loader2 } from "lucide-react";
import { useDistricts, useCreateDistrict, useCreateAssemblyConstituency, useCreatePollingStation, useDeleteDistrict, useDeleteAssemblyConstituency, useDeletePollingStation } from "@/lib/hooks";
import { toast } from "sonner";
import { VoterUploadModal } from "./voter-upload-modal";

interface DistrictData {
    id: string;
    name: string;
    state: string;
    assemblyConstituencies?: Array<{
        id: string;
        name: string;
        pollingStations?: Array<{
            id: string;
            name: string;
            number: string;
        }>;
        _count?: {
            voters?: number;
        };
    }>;
}

export function DistrictManagementTab() {
    const [expandedDistricts, setExpandedDistricts] = useState<Set<string>>(new Set());
    const [expandedACs, setExpandedACs] = useState<Set<string>>(new Set());
    const [showDistrictModal, setShowDistrictModal] = useState(false);
    const [showACModal, setShowACModal] = useState(false);
    const [showPSModal, setShowPSModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteType, setDeleteType] = useState<"district" | "ac" | "ps" | null>(null);
    const [deleteItem, setDeleteItem] = useState<{ districtId: string; acId?: string; itemId: string; itemName: string } | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedAC, setSelectedAC] = useState<string>("");
    const [showVoterUploadModal, setShowVoterUploadModal] = useState(false);
    const [selectedPS, setSelectedPS] = useState<{ id: string; name: string; acId: string } | null>(null);

    // Form states
    const [districtForm, setDistrictForm] = useState({ name: "", state: "" });
    const [acForm, setACForm] = useState({ name: "" });
    const [psForm, setPSForm] = useState({ name: "", number: "" });

    // Fetch districts
    const { data: districtsData, isLoading, refetch } = useDistricts({ page: 1, limit: 100 });
    const districts: DistrictData[] = districtsData?.data || [];

    // Mutations
    const { mutate: createDistrict, isPending: isCreatingDistrict } = useCreateDistrict();
    const { mutate: createAC, isPending: isCreatingAC } = useCreateAssemblyConstituency();
    const { mutate: createPS, isPending: isCreatingPS } = useCreatePollingStation();
    const { mutate: deleteDistrict, isPending: isDeletingDistrict } = useDeleteDistrict();
    const { mutate: deleteAC, isPending: isDeletingAC } = useDeleteAssemblyConstituency();
    const { mutate: deletePS, isPending: isDeletingPS } = useDeletePollingStation();

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

    const toggleAC = (acId: string) => {
        setExpandedACs((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(acId)) {
                newSet.delete(acId);
            } else {
                newSet.add(acId);
            }
            return newSet;
        });
    };

    const handleAddDistrict = () => {
        if (!districtForm.name || !districtForm.state) {
            toast.error("Please fill all fields");
            return;
        }
        createDistrict(
            { name: districtForm.name, state: districtForm.state },
            {
                onSuccess: () => {
                    setDistrictForm({ name: "", state: "" });
                    setShowDistrictModal(false);
                },
            }
        );
    };

    const handleAddAC = () => {
        if (!acForm.name) {
            toast.error("Please enter assembly constituency name");
            return;
        }
        createAC(
            { districtId: selectedDistrict, data: { name: acForm.name } },
            {
                onSuccess: () => {
                    setACForm({ name: "" });
                    setShowACModal(false);
                },
            }
        );
    };

    const handleAddPS = () => {
        if (!psForm.name || !psForm.number) {
            toast.error("Please fill all fields");
            return;
        }
        const district = districts.find((d) => d.id === selectedDistrict);
        const ac = district?.assemblyConstituencies?.find((ac) => ac.id === selectedAC);
        if (!district || !ac) {
            toast.error("Invalid selection");
            return;
        }

        createPS(
            { districtId: selectedDistrict, acId: selectedAC, data: { name: psForm.name, number: psForm.number } },
            {
                onSuccess: () => {
                    setPSForm({ name: "", number: "" });
                    setShowPSModal(false);
                },
            }
        );
    };

    const handleDeleteClick = (type: "district" | "ac" | "ps", districtId: string, itemId: string, itemName: string, acId?: string) => {
        setDeleteType(type);
        setDeleteItem({ districtId, acId, itemId, itemName });
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        if (!deleteItem || !deleteType) return;

        if (deleteType === "district") {
            deleteDistrict(deleteItem.itemId, {
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setDeleteItem(null);
                    setDeleteType(null);
                },
            });
        } else if (deleteType === "ac") {
            deleteAC(
                { districtId: deleteItem.districtId, id: deleteItem.itemId },
                {
                    onSuccess: () => {
                        setShowDeleteDialog(false);
                        setDeleteItem(null);
                        setDeleteType(null);
                    },
                }
            );
        } else if (deleteType === "ps" && deleteItem.acId) {
            deletePS(
                { districtId: deleteItem.districtId, acId: deleteItem.acId, id: deleteItem.itemId },
                {
                    onSuccess: () => {
                        setShowDeleteDialog(false);
                        setDeleteItem(null);
                        setDeleteType(null);
                    },
                }
            );
        }
    };

    const handleAddVoters = (districtId: string, acId: string, psId: string, psName: string) => {
        setSelectedPS({ id: psId, name: psName, acId });
        setSelectedDistrict(districtId);
        setShowVoterUploadModal(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-24">
            {/* Mobile-optimized header */}
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-xl font-bold">District Management</h2>
                    <p className="text-xs text-muted-foreground mt-1">Manage districts, constituencies, and polling stations</p>
                </div>
                <Button
                    onClick={() => setShowDistrictModal(true)}
                    className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white h-11"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add District
                </Button>
            </div>

            {districts.length === 0 ? (
                <Card className="border-2 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <MapPin className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Districts</h3>
                        <p className="text-sm text-gray-500 mb-4">Get started by adding your first district</p>
                        <Button onClick={() => setShowDistrictModal(true)} className="bg-violet-600 hover:bg-violet-700 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Add District
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {districts.map((district) => {
                        const isDistrictExpanded = expandedDistricts.has(district.id);
                        const acCount = district.assemblyConstituencies?.length || 0;

                        return (
                            <Card key={district.id} className="overflow-hidden border border-gray-200 shadow-sm">
                                <CardHeader className="pb-0">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        {/* District icon and info */}
                                        <button onClick={() => toggleDistrict(district.id)} className="flex items-center gap-3 flex-1 text-left hover:bg-gray-50 -m-6 p-4 sm:p-6 transition-colors">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                                                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">{district.name}</h3>
                                                <p className="text-xs sm:text-sm text-gray-500 truncate">{district.state}</p>
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-600 mt-1">
                                                    <span>{acCount} constituencies</span>
                                                </span>
                                            </div>
                                            <div className="text-gray-400 flex-shrink-0">{isDistrictExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</div>
                                        </button>
                                        {/* Delete button */}
                                        <div className="flex justify-end sm:justify-start px-4 sm:px-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 w-9"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick("district", district.id, district.id, district.name);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>

                                {isDistrictExpanded && (
                                    <CardContent className="pt-2 pb-3 px-4 sm:px-6 space-y-3">
                                        {/* Add AC Button */}
                                        <Button
                                            onClick={() => {
                                                setSelectedDistrict(district.id);
                                                setShowACModal(true);
                                            }}
                                            variant="outline"
                                            className="w-full border-dashed h-10 text-sm"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Assembly Constituency
                                        </Button>

                                        {/* Assembly Constituencies */}
                                        <div className="space-y-3">
                                            {district.assemblyConstituencies && district.assemblyConstituencies.length > 0 ? (
                                                district.assemblyConstituencies.map((ac) => {
                                                    const isACExpanded = expandedACs.has(ac.id);
                                                    const pollingStationCount = ac.pollingStations?.length || 0;

                                                    return (
                                                        <div key={ac.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                                                <button
                                                                    onClick={() => toggleAC(ac.id)}
                                                                    className="flex-1 px-3 sm:px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left min-w-0"
                                                                >
                                                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <span className="font-medium text-sm sm:text-base text-gray-900 block truncate">{ac.name}</span>
                                                                        <span className="text-xs text-gray-500 mt-0.5">{pollingStationCount} polling stations</span>
                                                                    </div>
                                                                    <div className="text-gray-400 flex-shrink-0">
                                                                        {isACExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                                    </div>
                                                                </button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 w-9 flex-shrink-0 self-end sm:self-auto"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteClick("ac", district.id, ac.id, ac.name);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>

                                                            {isACExpanded && (
                                                                <div className="border-t border-gray-200 bg-white">
                                                                    {/* Add PS Button */}
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedDistrict(district.id);
                                                                            setSelectedAC(ac.id);
                                                                            setShowPSModal(true);
                                                                        }}
                                                                        className="w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2 border-b border-gray-100"
                                                                    >
                                                                        <Plus className="h-3.5 w-3.5" />
                                                                        Add Polling Station
                                                                    </button>

                                                                    {/* Polling Stations */}
                                                                    {ac.pollingStations && ac.pollingStations.length > 0 ? (
                                                                        <div className="divide-y divide-gray-100">
                                                                            {ac.pollingStations.map((ps) => (
                                                                                <div
                                                                                    key={ps.id}
                                                                                    className="px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 border-b border-gray-100 last:border-b-0"
                                                                                >
                                                                                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                                                                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700 flex-shrink-0">
                                                                                            {ps.number}
                                                                                        </span>
                                                                                        <span className="text-xs sm:text-sm text-gray-700 truncate">{ps.name}</span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1">
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 h-8 w-8 flex-shrink-0"
                                                                                            onClick={() => handleAddVoters(district.id, ac.id, ps.id, ps.name)}
                                                                                        >
                                                                                            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                                        </Button>
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 flex-shrink-0"
                                                                                            onClick={() => handleDeleteClick("ps", district.id, ps.id, ps.name, ac.id)}
                                                                                        >
                                                                                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="px-4 py-8 text-center text-gray-400 text-xs">No polling stations yet</div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center py-8 text-gray-500 text-sm">No assembly constituencies yet</div>
                                            )}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Add District Modal */}
            {showDistrictModal && (
                <div className="fixed inset-0 bg-black/50 flex items-end z-50">
                    <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Add District</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowDistrictModal(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">District Name</label>
                                <Input placeholder="Enter district name" value={districtForm.name} onChange={(e) => setDistrictForm({ ...districtForm, name: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">State</label>
                                <Input placeholder="Enter state name" value={districtForm.state} onChange={(e) => setDistrictForm({ ...districtForm, state: e.target.value })} />
                            </div>

                            <div className="flex gap-3 pt-6">
                                <Button onClick={() => setShowDistrictModal(false)} variant="outline" className="flex-1 h-12 bg-transparent" disabled={isCreatingDistrict}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleAddDistrict}
                                    className="flex-1 h-12 bg-violet-600 hover:bg-violet-700 text-white"
                                    disabled={isCreatingDistrict || !districtForm.name || !districtForm.state}
                                >
                                    {isCreatingDistrict ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Create District
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add AC Modal */}
            {showACModal && (
                <div className="fixed inset-0 bg-black/50 flex items-end z-50">
                    <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Add Assembly Constituency</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowACModal(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Assembly Constituency Name</label>
                                <Input placeholder="Enter assembly constituency name" value={acForm.name} onChange={(e) => setACForm({ name: e.target.value })} />
                            </div>

                            <div className="flex gap-3 pt-6">
                                <Button onClick={() => setShowACModal(false)} variant="outline" className="flex-1 h-12 bg-transparent" disabled={isCreatingAC}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddAC} className="flex-1 h-12 bg-violet-600 hover:bg-violet-700 text-white" disabled={isCreatingAC || !acForm.name}>
                                    {isCreatingAC ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Create Constituency
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Polling Station Modal */}
            {showPSModal && (
                <div className="fixed inset-0 bg-black/50 flex items-end z-50">
                    <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Add Polling Station</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowPSModal(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Station Name</label>
                                <Input placeholder="Enter polling station name" value={psForm.name} onChange={(e) => setPSForm({ ...psForm, name: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Station Number</label>
                                <Input placeholder="e.g., PS001" value={psForm.number} onChange={(e) => setPSForm({ ...psForm, number: e.target.value })} />
                            </div>

                            <div className="flex gap-3 pt-6">
                                <Button onClick={() => setShowPSModal(false)} variant="outline" className="flex-1 h-12 bg-transparent" disabled={isCreatingPS}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddPS} className="flex-1 h-12 bg-violet-600 hover:bg-violet-700 text-white" disabled={isCreatingPS || !psForm.name || !psForm.number}>
                                    {isCreatingPS ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Create Polling Station
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && deleteItem && (
                <div className="fixed inset-0 bg-black/50 flex items-end z-50">
                    <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-red-600">Confirm Delete</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowDeleteDialog(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-700">
                                Are you sure you want to delete <strong>{deleteItem.itemName}</strong>? This action cannot be undone.
                            </p>

                            {deleteType === "district" && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-sm text-yellow-800">⚠️ Warning: Deleting this district will also delete all assembly constituencies and polling stations within it.</p>
                                </div>
                            )}

                            {deleteType === "ac" && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-sm text-yellow-800">⚠️ Warning: Deleting this assembly constituency will also delete all polling stations within it.</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-6">
                                <Button
                                    onClick={() => setShowDeleteDialog(false)}
                                    variant="outline"
                                    className="flex-1 h-12 bg-transparent"
                                    disabled={isDeletingDistrict || isDeletingAC || isDeletingPS}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleConfirmDelete} className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white" disabled={isDeletingDistrict || isDeletingAC || isDeletingPS}>
                                    {isDeletingDistrict || isDeletingAC || isDeletingPS ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Voter Upload Modal */}
            {showVoterUploadModal && selectedPS && (
                <VoterUploadModal
                    pollingStationId={selectedPS.id}
                    assemblyConstituencyId={selectedPS.acId}
                    pollingStationName={selectedPS.name}
                    isOpen={showVoterUploadModal}
                    onClose={() => {
                        setShowVoterUploadModal(false);
                        setSelectedPS(null);
                    }}
                    onSuccess={() => {
                        refetch();
                    }}
                />
            )}
        </div>
    );
}
