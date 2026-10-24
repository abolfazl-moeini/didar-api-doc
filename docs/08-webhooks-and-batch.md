# 8. Webhooks & Batch Operations (وب‌هوک‌ها و عملیات تجمیعی)

---

## 1. Outgoing Webhooks (رویدادهای ارسالی از دیدار)

Didar CRM can emit real-time HTTP POST notifications to your server or workflow automation engine (n8n, Zapier, Webhook receiver) when records are created, updated, or stage-changed.

### Inbound Webhook Payload Schema

When an event triggers, Didar dispatches a POST request with the following JSON body:

```json
{
  "data": {
    "Id": "5fa23d11-1e92-416b-9c74-e816a70a8421",
    "Title": "معامله شماره ۱۰۲",
    "Status": "Won",
    "Price": 15000000,
    "PipelineStageId": "aaaa3333-bb22-cc33-dd44-ee5555555555",
    "OwnerId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
    "PersonId": "7a304859-9941-4775-926c-31a89c381c81",
    "RegisterDate": "2026-10-24T12:00:00.000Z"
  },
  "changes": [
    {
      "field": "PipelineStageId",
      "oldValue": "aaaa2222-bb22-cc33-dd44-ee5555555555",
      "newValue": "aaaa3333-bb22-cc33-dd44-ee5555555555"
    },
    {
      "field": "Status",
      "oldValue": "Pending",
      "newValue": "Won"
    }
  ],
  "meta": {
    "event": "deal.stage_changed",
    "timestamp": "2026-10-24T12:15:30.124Z",
    "userId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3"
  }
}
```

### Handler Best Practices
1. **Response Time:** Return HTTP `200 OK` immediately (under 2 seconds) to avoid timeouts and retries.
2. **Idempotency:** Track `meta.timestamp` or record `data.Id` to avoid processing duplicate webhook deliveries.

---

## 2. Batch Operations API (`BatchOperations/GravityInsert`)

Extracted from the official WordPress Gravity Forms integration, this endpoint enables simultaneous atomic creation of a **Contact**, a **Deal**, and a **Case** in a single HTTP request.

* **Endpoint:** `POST /api/BatchOperations/GravityInsert?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Field Naming Conventions
* `cnt_*`: Contact parameters
* `d_*`: Deal parameters
* `c_*`: Case parameters

### Request Payload Example
```json
{
  "contact": {
    "cnt_firstName": "رضا",
    "cnt_lastName": "کریمی",
    "cnt_mobilePhone": "09121112233",
    "cnt_email": "reza@karimi.com",
    "cnt_ownerId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
    "cnt_fields": {
      "Field_8783_13_33": ["تهران"]
    }
  },
  "deal": {
    "d_pipelineStageId": "aaaa1111-bb22-cc33-dd44-ee5555555555",
    "d_ownerId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
    "d_title": "ثبت‌نام از فرم مشاوره لندینگ پیج",
    "d_price": 0,
    "d_fields": {
      "Field_5021_1_0": ["وبینار مهر"]
    }
  },
  "case": {
    "c_pipelineStageId": "bbbb1111-cccc-dddd-eeee-ffffffffffff",
    "c_ownerId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
    "c_title": "بررسی اولیه فرم ارسالی کاربر"
  }
}
```

### Get Available Form Fields
To inspect field definitions supported by the Batch Operations engine:
* **Endpoint:** `POST /api/BatchOperations/GetGravityFields?apikey={API_KEY}`
* **Request:** `{ "type": "deal" }` (or `"contact"`, `"case"`, `"company"`)
