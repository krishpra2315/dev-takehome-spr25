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
} from "@/lib/validation/request";

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

export async function createNewRequest(request: any): Promise<ItemRequest> {
    //Validate request
    const validatedRequest = validateCreateItemRequest(request);
    if (!validatedRequest) {
    throw new InvalidInputError("created item request");
    }

    const db = await connectToDatabase();
    const collection = db.collection("requests");

    const requests = await collection.find().toArray();

    //Convert document to ItemRequest object
    const typedRequests = requests.map(doc => ({
        id: doc.id,
        requestorName: doc.requestorName,
        itemRequested: doc.itemRequested,
        requestCreatedDate: new Date(doc.requestCreatedDate),
        lastEditedDate: new Date(doc.lastEditedDate),
        status: doc.status
    } as ItemRequest));

    const nextId = generateId(typedRequests)

    const date = new Date();
    const newRequest: ItemRequest = {
        id: nextId,
        requestorName: validatedRequest.requestorName,
        itemRequested: validatedRequest.itemRequested,
        requestCreatedDate: date,
        lastEditedDate: date,
        status: RequestStatus.PENDING,
    };

    await collection.insertOne(newRequest);
    return newRequest;
}

export async function editStatusRequest(request: any): Promise<EditStatusRequest> {
    //Validate request
    const validatedRequest = validateEditStatusRequest(request);
    if (!validatedRequest) {
        throw new InvalidInputError("edit item request");
    }

    //Connect and edit in db
    const db = await connectToDatabase();
    const collection = db.collection("requests");
    const editedItemRequest = await collection.findOneAndUpdate(
        { id: validatedRequest.id },
        { $set: { status: validatedRequest.status, lastEditedDate: new Date() } },
        { returnDocument: "after" }
    );

    if (!editedItemRequest?.value) {
        throw new InvalidInputError("edit item ID");
    }

    return {
        id: editedItemRequest.value.id,
        status: editedItemRequest.value.status
    } as EditStatusRequest;
}
