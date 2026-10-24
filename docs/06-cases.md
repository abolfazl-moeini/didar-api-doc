# 6. Cases & Support Tickets API (پرونده‌ها و تیکت‌ها)

Cases in Didar CRM are used for post-sale support, issue tracking, legal files, or customer onboarding workflows. Like Deals, Cases progress through defined stages in a dedicated Case Pipeline.

---

## 1. Case Pipelines

Retrieve pipelines configured specifically for Cases:

* **Endpoint:** `POST /api/pipeline/list/1?apikey={API_KEY}`
* **Body:** `{}`

> [!NOTE]
> Parameter `1` indicates Case pipelines (`0` is for Deal pipelines).

---

## 2. Create or Update Case (`Case/Save`)

* **Endpoint:** `POST /api/Case/Save?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request Payload
```json
{
  "Case": {
    "Id": "00000000-0000-0000-0000-000000000000",
    "Title": "درخواست راهنمایی در پیکربندی وب‌هوک سفارشات",
    "OwnerId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
    "PersonId": "7a304859-9941-4775-926c-31a89c381c81",
    "CompanyId": "00000000-0000-0000-0000-000000000000",
    "PipelineId": "22222222-3333-4444-5555-666666666666",
    "PipelineStageId": "bbbb1111-cccc-dddd-eeee-ffffffffffff",
    "Status": "Pending",
    "Priority": "High",
    "Description": "خطای ۴۰۳ هنگام دریافت وب‌هوک ارسال می‌شود.",
    "LabelIds": [
      "33333333-aaaa-bbbb-cccc-dddddddddddd"
    ],
    "Fields": {
      "Field_2041_1_0": "بخش پشتیبانی وب‌سایت"
    }
  }
}
```

### Response
```json
{
  "Response": {
    "Id": "88776655-4433-2211-00aa-bbccddeeff00",
    "Title": "درخواست راهنمایی در پیکربندی وب‌هوک سفارشات",
    "Status": "Pending"
  },
  "Error": null
}
```

---

## 3. Search Cases

* **Endpoint:** `POST /api/Case/search?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request
```json
{
  "Criteria": {
    "Keywords": "وب‌هوک",
    "Status": "Pending",
    "OwnerId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
    "PipelineId": "22222222-3333-4444-5555-666666666666",
    "PipelineStageId": "bbbb1111-cccc-dddd-eeee-ffffffffffff",
    "SearchFromTime": "2026-01-01T00:00:00.000Z",
    "SearchToTime": "2026-12-31T23:59:59.000Z",
    "Sort": 0
  },
  "From": 0,
  "Limit": 20
}
```

---

## 4. Reverse-Engineered Case Operations

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/case/GetCaseDetail` | `POST` | Fetches full ticket details: `{ "Id": "guid" }` |
| `/api/case/ChangeStage` | `POST` | Advances ticket stage without full model update: `{ "CaseId": "guid", "StageId": "guid" }` |
| `/api/Label/GetCaseLabels` | `GET` | Returns list of case tag labels |
| `/api/case/SetOtherContacts` | `POST` | Associates additional secondary contacts to a case |
| `/api/case/DeleteCase` | `POST` | Deletes a case: `{ "Id": "guid" }` |
