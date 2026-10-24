# 9. Admin & Internal System APIs (مدیریت کاربران، فیلدها و تنظیمات)

These endpoints were reverse-engineered from the official Didar web application (`app.didar.me`) and enable administrative automation, team user management, custom field configuration, and marketing attribution tracking.

---

## 1. Team & User Management (`User/*`)

### List Workspace Users
* **Endpoint:** `POST /api/User/List?apikey={API_KEY}`
* **Content-Type:** `application/json`
* **Request:**
```json
{
  "IgnoreDisabledUsers": true,
  "IgnoreInvitationPendingUsers": true
}
```

#### Response Example
```json
{
  "Response": [
    {
      "UserId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
      "UserName": "admin@company.com",
      "DisplayName": "مدیر سیستم",
      "IsActive": true,
      "Role": "Administrator"
    }
  ],
  "Error": null
}
```

### Other User Operations
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/User/CheckEmail` | `POST` | Validates if an email is already registered in Didar |
| `/api/User/InviteMember` | `POST` | Invites a new employee: `{ "Email": "...", "Role": "..." }` |
| `/api/User/ResendInvitation` | `POST` | Resends invite link |
| `/api/User/DeleteInvitation` | `POST` | Cancels pending invitation |
| `/api/User/ToggleIsDisabled` | `POST` | Enables/Disables user login: `{ "UserId": "guid" }` |
| `/api/User/SetPermission` | `POST` | Updates access control permissions |
| `/api/User/SetVisibility` | `POST` | Configures record visibility (Own, Group, All) |

---

## 2. Custom Fields Management (`customfield/*`)

### Get Custom Field Definitions
* **Endpoint:** `POST /api/customfield/GetCustomfieldList?apikey={API_KEY}`
* **Request:** `{}`

#### Response Example
```json
{
  "Response": [
    {
      "Id": "8783",
      "Key": "8783_13_33",
      "Title": "رشته تحصیلی",
      "FieldType": "Contact",
      "DataType": "Text",
      "ViewOptions": {
        "IsRequired": false,
        "IsUnique": false
      }
    }
  ],
  "Error": null
}
```

### Add or Update Custom Field
* **Endpoint:** `POST /api/CustomField/AddOrUpdateCustomField?apikey={API_KEY}`
* **Description:** Creates a new field on Person, Company, Deal, or Case.

---

## 3. Marketing Sources & Attribution (`Source/*`)

Track where your leads originate (Google Ads, Instagram, Exhibition, Inbound, etc.) along with marketing costs for ROI calculation.

### Get All Sources
* **Endpoint:** `POST /api/Source/GetList?apikey={API_KEY}`
* **Request:** `{}`

### Save Source & Marketing Cost
* **Endpoint:** `POST /api/Source/Save?apikey={API_KEY}`
* **Record Cost:** `POST /api/Source/SaveCost?apikey={API_KEY}`  
  *Payload:* `{ "SourceId": "guid", "Cost": 50000000, "Date": "2026-10-01" }`

---

## 4. Tags Management (`Tag/*`)

* **List Tags:** `POST /api/Tag/GetTagList?apikey={API_KEY}`
* **Create Tag:** `POST /api/tag/CreateTagNewSettings?apikey={API_KEY}`
* **Delete Tag:** `POST /api/tag/DeleteTagNewSettings?apikey={API_KEY}`

---

## 5. Customer Segments (`Segment/*`)

Segments allow grouping contacts dynamically based on business logic.

* **List Segments:** `POST /api/Segment/GetList?apikey={API_KEY}`
* **Request:** `{ "ParentId": "00000000-0000-0000-0000-000000000000" }`

---

## 6. Universal Search (دیداریاب - `search/search`)

Fast cross-entity search bar endpoint used by Didar web UI.

* **Endpoint:** `POST /api/search/search?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request
```json
{
  "Keyword": "نوآوران",
  "Types": [
    "Person",
    "Company",
    "Deal",
    "Case",
    "Product"
  ]
}
```

### Response
```json
{
  "Response": {
    "Persons": [ ... ],
    "Companies": [ ... ],
    "Deals": [ ... ],
    "Cases": [ ... ],
    "Products": [ ... ]
  },
  "Error": null
}
```

---

## 7. Financial & Payments API (`payment/*`)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/payment/Search` | `POST` | Inquires invoice payments and gateway transaction logs |
| `/api/payment/GetGateways` | `POST` | Returns active online payment gateways (Zarinpal, Mellat, etc.) |
| `/api/payment/GetBankAccounts` | `POST` | Returns company bank accounts for manual bank transfers |
| `/api/payment/RegisterManual` | `POST` | Registers an offline cash / card-to-card receipt |
| `/api/payment/Inquiry` | `POST` | Checks online payment transaction status |
