import React from 'react';
import Dropdown, { DropdownOption } from '../atoms/Dropdown';
import { ItemRequest, RequestStatus } from '@/lib/types/request';
import { LeftArrowIcon } from '../icons/LeftArrowIcon';
import { RightArrowIcon } from '../icons/RightArrowIcon';


interface RequestTableProps {
    data: ItemRequest[];
    onStatusChange: (requestId: number, newStatus: string) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const statusOptions: DropdownOption[] = [
    { label: 'Pending', value: RequestStatus.PENDING, color: '#F59E0B', textColor: '#92400E' },
    { label: 'Approved', value: RequestStatus.APPROVED,  color: "#FFD700", textColor: "#7B5F2E" },
    { label: 'Completed', value: RequestStatus.COMPLETED, color: '#34D399', textColor: '#065F46' },
    { label: 'Rejected', value: RequestStatus.REJECTED, color: '#EF4444', textColor: '#991B1B' },
];

const getStatusOption = (status: string): DropdownOption => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
};

export default function RequestTable({ data, onStatusChange, currentPage, totalPages, onPageChange }: RequestTableProps) {
    return (
        <div className="w-full overflow-visible flex flex-col gap-4">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 hidden md:table-header-group border-t border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item Requested
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Updated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row) => (
                        <tr key={row.id} className="block md:table-row">
                            <td className="block md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-block md:hidden font-medium mr-2">Name:</span>
                                {row.requestorName}
                            </td>
                            <td className="block md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-block md:hidden font-medium mr-2">Item Requested:</span>
                                {row.itemRequested}
                            </td>
                            <td className="block md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-block md:hidden font-medium mr-2">Created:</span>
                                {new Date(row.requestCreatedDate).toLocaleDateString('en-US')}
                            </td>
                            <td className="block md:table-cell px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-block md:hidden font-medium mr-2">Updated:</span>
                                {row.lastEditedDate ? 
                                    new Date(row.lastEditedDate).toLocaleDateString('en-US') :
                                    'N/A'
                                }
                            </td>
                            <td className="block md:table-cell px-6 py-3 whitespace-nowrap text-sm">
                                <span className="inline-block md:hidden font-medium mr-2">Status:</span>
                                <div className="w-full md:w-40">
                                    <Dropdown
                                        options={statusOptions}
                                        initialValue={getStatusOption(row.status)}
                                        onSelect={(value) => onStatusChange(row.id, value)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex px-3 justify-end items-center gap-4">
                <span className="text-sm text-gray-700">Page {Math.min(currentPage, totalPages)} of {totalPages}</span>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-2.5 py-2 text-sm font-medium text-gray-700 bg-[#FCFCFD] border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <LeftArrowIcon />
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-2.5 py-2 text-sm font-medium text-gray-700 bg-[#FCFCFD] border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RightArrowIcon />
                </button>
            </div>
        </div>
    );
} 