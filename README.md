# Mini CRM — Frontend

---

## Project overview

| Area | What the app does |
|------|-------------------|
| **Auth** | Email/password login via server action; JWT stored in an **httpOnly-style session cookie** (`accessToken`) for API calls. Logout clears the cookie. |
| **Organizations** | Admins list/search organizations, create orgs, open org detail (members). |
| **Users** | Admins list/search users, create users (pick organization), view user detail (org + assigned customers from payload). |
| **Customers** | Admins: full list (active/deleted), create, detail (summary, notes, assign when unassigned, edit, soft delete). Members: customers **assigned to them** only. |
| **Notes** | Members pick an assigned customer, list notes with **server-side search**, create notes, view a single note.

---

### Role home URLs

| Role | Default landing |
|------|------------------|
| `admin` | `/dashboard/admin/organizations` |
| `member` | `/dashboard/member/customers` |

### Member vs admin data visibility (UI)

- **Admin** navigation: Organizations, Users, Customers, Activity Logs.
- **Member** navigation: Customers (assigned only), Notes (per assigned customers).

---

## Local setup

### Prerequisites

- **Node.js** 20+ (matches `@types/node` in devDependencies).
- A running **backend API** that implements the endpoints below and issues JWTs from `/auth/login`.

### Install and run

npm install
npm run dev


Open [http://localhost:3000](http://localhost:3000) (or the port Next prints).

### Production build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---


- **Soft delete:** `Customer.deletedAt` — admin list toggles active vs deleted; restore calls the API patch endpoint.
- **User detail (admin):** `AdminUserDetail` includes nested `organization` and `assignedCustomers[]` plus `assignedCustomerCount` when the API returns the enriched user payload (no extra customer list scan on the client).

---

## API usage (this client)

All CRM paths are relative to `NEXT_PUBLIC_AUTH_API_BASE_URL`.

## Performance and caching

Design choices that reduce duplicate or unnecessary network work:

| Topic | Implementation |
|-------|----------------|
| **React Query defaults** | `refetchOnWindowFocus: false`, `retry: 1` for queries / `0` for mutations — fewer surprise refetches in dev and stable UIs. |
| **Global errors** | `QueryProvider` attaches `QueryCache` / `MutationCache` `onError` → Sonner toasts so pages do not each reimplement error handling. |
| **Debounced search** | List pages use `useDebouncedValue` / URL state (`useSearchPaginationQueryState`) so the API is not hit on every keystroke. |
| **Notes search** | `listNotesForCustomer(customerId, { search })` sends `search` to the backend; the list query key includes the debounced term. |
| **User detail** | Assigned customers come from **`GET /users/:id`** only — the client does **not** walk the full customer catalog. |
| **Create user** | On success, only **`["users"]`** queries are invalidated — not organizations — so the org dropdown cache is not thrashed after each create. |
| **Customer update** | Invalidates **`["customers", id]`** only (not a broad `["customers"]` + id double-invalidate), so **one** refetch of the detail query. |
| **Customer delete** | Before clearing cache, the detail query is **disabled** for that id (`flushSync` + suppression flag), then `cancelQueries` / `removeQueries` — avoids a **second GET** to a deleted id (404). Admin list invalidation uses prefix **`["customers", "admin"]`** so list keys refresh without re-triggering the removed detail query. |
| **Assign UI** | User dropdown for assignment loads only when the customer is **unassigned** and the user opens the select (`assignUsersRequested`). |

---

## Concurrency and integrity (frontend role)

- **Concurrency-safe assignment** is ultimately enforced by the **API** (e.g. versioning, conditional updates, or transactional checks). The frontend calls **`PATCH /customers/:id/assign`** with `{ userId }` and surfaces errors via React Query toasts; it does not simulate locking.
- **Soft delete integrity:** the UI respects `deletedAt`, offers **restore** on the deleted list, and avoids refetching removed detail after delete (see above).
- **RBAC:** enforced in **`proxy.ts`** (route prefixes) and must be **repeated on the server** for every mutating route.
