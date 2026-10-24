# 5. Activities, Tasks & Notes API (فعالیت‌ها، وظایف و یادداشت‌ها)

Didar manages appointments, follow-ups, calls, tasks, and notes through a unified **Activity** model.

> [!IMPORTANT]
> **Architecture Note:**  
> In Didar CRM, **Notes (یادداشت‌ها)** are not a separate database entity. A note is simply an Activity with:
> * `ActivityTypeId: "00000000-0000-0000-0000-000000000000"` (Zero GUID)
> * `IsDone: true`
> * Text stored in the `ResultNote` field.

---

## 1. Activity Types

Retrieve the workspace's configured activity types (e.g., تماس تلفنی، جلسه حضوری، ارسال پیش‌فاکتور):

* **Endpoint:** `POST /api/activity/GetActivityType?apikey={API_KEY}`
* **Body:** `{}`

### Response
```json
{
  "Response": [
    {
      "Id": "9a111111-2222-3333-4444-555555555555",
      "Title": "تماس تلفنی",
      "Icon": "phone"
    },
    {
      "Id": "9a222222-2222-3333-4444-555555555555",
      "Title": "جلسه حضوری",
      "Icon": "calendar"
    }
  ],
  "Error": null
}
```

---

## 2. Create or Update Task / Activity

* **Endpoint:** `POST /api/activity/save?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request Payload
```json
{
  "Activity": {
    "Id": "00000000-0000-0000-0000-000000000000",
    "Title": "تماس برای هماهنگی ارسال پیش‌فاکتور",
    "ActivityTypeId": "9a111111-2222-3333-4444-555555555555",
    "OwnerId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
    "CreatorId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
    "DealId": "5fa23d11-1e92-416b-9c74-e816a70a8421",
    "CaseId": "00000000-0000-0000-0000-000000000000",
    "ContactIds": [
      "7a304859-9941-4775-926c-31a89c381c81"
    ],
    "DueDate": "2026-10-25T10:00:00.000Z",
    "DueDateType": "HasTime",
    "Duration": 30,
    "IsDone": false,
    "IsDeleted": false,
    "IsPinned": false,
    "Note": "بررسی شرایط تخفیف سازمانی قبل از تماس",
    "ResultNote": "",
    "Tags": [
      { "TagId": "88888888-9999-aaaa-bbbb-cccccccccccc" }
    ]
  }
}
```

---

## 3. Create Note (یادداشت روی پرونده یا مشتری)

To insert a plain note attached to a customer or deal:

* **Endpoint:** `POST /api/activity/save?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request Payload
```json
{
  "Activity": {
    "Id": "00000000-0000-0000-0000-000000000000",
    "ActivityTypeId": "00000000-0000-0000-0000-000000000000",
    "OwnerId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
    "DealId": "5fa23d11-1e92-416b-9c74-e816a70a8421",
    "ContactIds": [
      "7a304859-9941-4775-926c-31a89c381c81"
    ],
    "CaseId": "00000000-0000-0000-0000-000000000000",
    "ResultNote": "مشتری درخواست ارائه دموی آنلاین برای اعضای هیئت مدیره در روز دوشنبه داشت.",
    "IsDone": true,
    "IsDeleted": false,
    "DueDate": "2026-10-24T12:00:00.000Z",
    "DoneDate": "2026-10-24T12:00:00.000Z",
    "DueDateType": "NoTime",
    "DoneDateType": "NoTime",
    "Tags": []
  }
}
```

---

## 4. Search Activities

* **Endpoint:** `POST /api/activity/search?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request
```json
{
  "Criteria": {
    "SearchFromTime": "2026-10-01T00:00:00.000Z",
    "SearchToTime": "2026-10-31T23:59:59.000Z",
    "IsDone": false,
    "OwnerId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
    "ContactIds": [],
    "DealId": "00000000-0000-0000-0000-000000000000"
  },
  "From": 0,
  "Limit": 20
}
```

---

## 5. Reverse-Engineered Activity Operations

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/activity/DoneActivity` | `POST` | Marks task as completed: `{ "Id": "guid", "ResultNote": "انجام شد" }` |
| `/api/activity/UndoneActivity` | `POST` | Re-opens completed task: `{ "Id": "guid" }` |
| `/api/activity/DelayActivity` | `POST` | Postpones task dueDate: `{ "Id": "guid", "NewDueDate": "ISO" }` |
| `/api/activity/SetIsPinned` | `POST` | Pins note to top of timeline: `{ "Id": "guid", "IsPinned": true }` |
| `/api/activity/SaveComment` | `POST` | Adds team collaboration comment under an activity |
| `/api/activity/DeleteComment` | `POST` | Removes comment |
| `/api/activity/DeleteAttachment` | `POST` | Removes attached file from activity |
| `/api/activity/GetSummary` | `POST` | Summary KPI count of today, overdue, and upcoming tasks |
