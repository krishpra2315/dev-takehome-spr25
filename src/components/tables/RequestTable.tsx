import React from 'react';
import Dropdown, { DropdownOption } from '../atoms/Dropdown';
import { ItemRequest, RequestStatus } from '@/lib/types/request';


interface RequestTableProps {
    data: ItemRequest[];
    onStatusChange: (requestId: number, newStatus: string) => void;
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

export default function RequestTable({ data, onStatusChange }: RequestTableProps) {
    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 hidden md:table-header-group">
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
                            <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-block md:hidden font-medium mr-2">Name:</span>
                                {row.requestorName}
                            </td>
                            <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-block md:hidden font-medium mr-2">Item Requested:</span>
                                {row.itemRequested}
                            </td>
                            <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-block md:hidden font-medium mr-2">Created:</span>
                                {`${row.requestCreatedDate.getMonth() + 1}/${row.requestCreatedDate.getDate()}/${row.requestCreatedDate.getFullYear()}`}
                            </td>
                            <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-block md:hidden font-medium mr-2">Updated:</span>
                                {row.lastEditedDate ? 
                                    `${row.lastEditedDate.getMonth() + 1}/${row.lastEditedDate.getDate()}/${row.lastEditedDate.getFullYear()}` :
                                    'N/A'
                                }
                            </td>
                            <td className="block md:table-cell px-6 py-4 whitespace-nowrap text-sm">
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
        </div>
    );
} 