"use client";

import RequestTable from "@/components/tables/RequestTable";
import { ItemRequest, RequestStatus } from "@/lib/types/request";
import { useEffect, useState } from "react";

/**
 * Legacy front-end code from Crisis Corner's previous admin page!
 */
export default function ItemRequestsPage() {
  const [itemRequests, setitemRequests] = useState<ItemRequest[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTabClick = (status: RequestStatus | null) => {
    setSelectedStatus(status);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/request?page=${pageNumber}${selectedStatus ? '&status=' + selectedStatus : '' }`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setitemRequests(data.requests);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pageNumber, selectedStatus])

  const handleStatusChange = (id: number, newStatus: string): void => {
    const changeRequestStatus = async () => {
      try {
        const response = await fetch(`/api/request`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id, status: newStatus }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log('Status updated successfully');
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    changeRequestStatus();
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  return (
    <div className="w-full mx-auto mt-8 flex flex-col items-center gap-6">
      <h2 className="w-full justify-start px-5">Item Requests</h2>
      <div className="w-full flex flex-col gap-0">
        <div className="flex gap-2 px-5">
          {["All", "Pending", "Approved", "Completed", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => handleTabClick(status === "All" ? null : status.toLowerCase() as RequestStatus)}
              className={`px-9 py-3 rounded text-sm 
                ${selectedStatus === (status === "All" ? null : status.toLowerCase()) ? 'bg-[#0070FF] text-white' : 
                'bg-[#F2F2F2] hover:bg-[#EFF6FF]'}`}
            >
              {status}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <RequestTable 
            data={itemRequests} 
            onStatusChange={handleStatusChange}
            currentPage={pageNumber}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
