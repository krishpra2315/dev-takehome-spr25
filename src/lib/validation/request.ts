/* eslint-disable @typescript-eslint/no-explicit-any */
// ^ disable rules because we are validating anys to make sure it conforms else erroring
import {
    CreateItemRequest,
    EditStatusRequest,
  } from "@/lib/types/request";
  import { RequestStatus } from "@/lib/types/request";
  
  function isValidString(str: any, lower?: number, upper?: number): boolean {
    if (typeof str !== "string" || str.trim() == "") {
      return false;
    }
    if ((lower && str.length < lower) || (upper && str.length > upper)) {
      return false;
    }
    return true;
  }
  
  function isValidMockName(name: string): boolean {
    return isValidString(name, 3, 30);
  }
  
  function isValidMockItemRequested(item: string): boolean {
    return isValidString(item, 2, 100);
  }
  
  export function isValidMockStatus(status: any): boolean {
    return (
      isValidString(status) &&
      Object.values(RequestStatus).includes(status as RequestStatus)
    );
  }
  
  export function isValidMockId(id: any): boolean {
    return typeof id === "number" && id > 0;
  }
  
  export function validateMockCreateItemRequest(
    request: any
  ): CreateItemRequest | null {
    if (!request.requestorName || !request.itemRequested) {
      return null;
    }
    if (
      !isValidMockName(request.requestorName) ||
      !isValidMockItemRequested(request.itemRequested)
    ) {
      return null;
    }
    const newCreateItemRequest: CreateItemRequest = {
      requestorName: request.requestorName,
      itemRequested: request.itemRequested,
    };
    return newCreateItemRequest;
  }
  
  export function validateMockEditStatusRequest(
    request: any
  ): EditStatusRequest | null {
    if (!request.id || !request.status) {
      return null;
    }
    if (!isValidMockId(request.id) || !isValidMockStatus(request.status)) {
      return null;
    }
    const newEditStatusRequest: EditStatusRequest = {
      id: request.id,
      status: request.status,
    };
    return newEditStatusRequest;
  }
  