"use client";

import Button from "@/components/atoms/Button";
import Dropdown from "@/components/atoms/Dropdown";
import { DropdownOption } from "@/components/atoms/Dropdown";
import Input from "@/components/atoms/Input";
import RequestTable from "@/components/tables/RequestTable";
import { ItemRequest, RequestStatus } from "@/lib/types/request";
import { useState } from "react";
import mockItemRequests from "../api/mock/data";

/**
 * Legacy front-end code from Crisis Corner's previous admin page!
 */
export default function ItemRequestsPage() {
  const [item, setItem] = useState<string>("");
  const [itemList, setItemList] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | null>(null);

  const handleAddItem = (): void => {
    if (item.trim()) {
      setItemList((prevList) => [...prevList, item.trim()]);
      setItem("");
    }
  };

  const options: DropdownOption[] = [
    { label: "Pending", value: RequestStatus.PENDING, color: "#FFA500", textColor: "#A43E00" }, // Orange
    { label: "Approved", value: RequestStatus.APPROVED, color: "#FFD700", textColor: "#7B5F2E" }, // Gold
    { label: "Completed", value: RequestStatus.COMPLETED, color: "#90EE90", textColor: "#037847" }, // Light Green
    { label: "Rejected", value: RequestStatus.REJECTED, color: "#FF6347", textColor: "#8D0402" }, // Tomato
  ];

  return (
    <div className="w-full mx-auto mt-8 flex flex-col items-center gap-6">
      <h2 className="">Item Requests</h2>
      <RequestTable data={mockItemRequests} onStatusChange={() => {}}/>
    </div>
  );
}
