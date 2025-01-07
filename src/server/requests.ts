/* eslint-disable @typescript-eslint/no-explicit-any */
// ^ disable rules because we are validating anys to make sure it conforms else erroring
//import mockItemRequests from "@/app/api/mock/data";
import { connectToDatabase } from "@/lib/mongodb";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import { InvalidInputError } from "@/lib/errors/inputExceptions";
import { 
    EditStatusRequest,
    ItemRequest,
    RequestStatus } from "@/lib/types/request";
import {
  generateId,
  sortItemRequests,
} from "@/lib/utils/requests";
import paginate from "@/lib/utils/pagination";
import {
  isValidStatus,
  validateCreateItemRequest,
  validateEditStatusRequest,
} from "@/lib/validation/requests";

export async function getItemRequests(
  status: string | null,
  page: number
): Promise<ItemRequest[]> {
    const db = await connectToDatabase();
    const collection = db.collection("requests");

    const query: any = {};
    if (status && isValidStatus(status)) {
        query.status = status;
    }

    const sortedRequests = await collection.find(query)
      .sort({ requestCreatedDate: -1 })
      .toArray();

    // Map MongoDB documents to ItemRequest type
    const typedRequests = sortedRequests.map(doc => ({
      id: doc.id,
      requestorName: doc.requestorName,
      itemRequested: doc.itemRequested,
      requestCreatedDate: new Date(doc.requestCreatedDate),
      lastEditedDate: new Date(doc.lastEditedDate),
      status: doc.status
    } as ItemRequest));
    
    let filteredRequests = typedRequests;
    if (status && isValidStatus(status)) {
      filteredRequests = filteredRequests.filter((req) => req.status === status);
    }
    
    return paginate(filteredRequests, page, PAGINATION_PAGE_SIZE).data;
}

export function createNewRequest(request: any): ItemRequest {
  const validatedRequest = validateCreateItemRequest(request);
  if (!validatedRequest) {
    throw new InvalidInputError("created item request");
  }
  const date = new Date();
  const newRequest: ItemRequest = {
    id: generateId(ItemRequests),
    requestorName: validatedRequest.requestorName,
    itemRequested: validatedRequest.itemRequested,
    requestCreatedDate: date,
    lastEditedDate: date,
    status: RequestStatus.PENDING,
  };

  ItemRequests.push(newRequest);
  return newRequest;
}

export function editStatusRequest(request: any): EditStatusRequest {
  const validatedRequest = validateEditStatusRequest(request);
  if (!validatedRequest) {
    throw new InvalidInputError("edit item request");
  }
  const editedItemRequest = ItemRequests.find(
    (req) => req.id === validatedRequest.id
  );
  if (!editedItemRequest) {
    throw new InvalidInputError("edit item ID");
  }
  editedItemRequest.status = validatedRequest.status;
  editedItemRequest.lastEditedDate = new Date();
  return editedItemRequest;
}
