import { ItemRequest } from "@/lib/types/request";

export function generateId(requests: ItemRequest[]): number {
  return requests.length > 0
    ? Math.max(...requests.map((req) => req.id)) + 1
    : 1;
}

export function sortItemRequests(
  requests: ItemRequest[]
): ItemRequest[] {
  return requests.sort(
    (a, b) => b.requestCreatedDate.getTime() - a.requestCreatedDate.getTime()
  );
}
