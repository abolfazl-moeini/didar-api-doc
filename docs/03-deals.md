# 3. Deals & Pipelines API (معاملات و کاریزها)

Deals represent sales opportunities moving through defined stages in a visual sales pipeline (کاریز).

---

## 1. Pipelines & Stages (کاریزها)

To create a deal, you need a valid `PipelineId` and `PipelineStageId`.

### List Deal Pipelines
* **Endpoint:** `POST /api/pipeline/list/0?apikey={API_KEY}`
* **Content-Type:** `application/json`
* **Body:** `{}` *(Empty JSON object)*

> [!NOTE]
> `/api/pipeline/list/0` returns **Deal** pipelines.  
> `/api/pipeline/list/1` returns **Case/Ticket** pipelines.

#### Response Example
```json
{
  "Response": [
    {
      "Id": "11111111-2222-3333-4444-555555555555",
      "Title": "کاریز فروش سازمانی",
      "IsDefault": true,
      "Stages": [
        {
          "Id": "aaaa1111-bb22-cc33-dd44-ee5555555555",
          "Title": "تماس اولیه",
          "Probability": 10,
          "Index": 0
        },
        {
          "Id": "aaaa2222-bb22-cc33-dd44-ee5555555555",
          "Title": "ارسال پیش‌فاکتور",
          "Probability": 50,
          "Index": 1
        },
        {
          "Id": "aaaa3333-bb22-cc33-dd44-ee5555555555",
          "Title": "مذاکره نهایی",
          "Probability": 80,
          "Index": 2
        }
      ]
    }
  ],
  "Error": null
}
```

---

## 2. Create or Update Deal (`deal/save_v2`)

Creates a new deal or updates an existing deal (if `"Id"` is provided in `"Deal"`).

* **Endpoint:** `POST /api/deal/save_v2?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Full Request Payload
```json
{
  "Deal": {
    "Id": "00000000-0000-0000-0000-000000000000",
    "Title": "سفارش خرید نرم‌افزار سازمانی #10294",
    "OwnerId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
    "PersonId": "7a304859-9941-4775-926c-31a89c381c81",
    "CompanyId": "00000000-0000-0000-0000-000000000000",
    "PipelineId": "11111111-2222-3333-4444-555555555555",
    "PipelineStageId": "aaaa2222-bb22-cc33-dd44-ee5555555555",
    "Status": "Pending",
    "Price": 15000000,
    "TaxPercent": 10,
    "IsWon": false,
    "IsPaid": true,
    "VisibilityType": "Owner",
    "SourceId": "00000000-0000-0000-0000-000000000000",
    "SourceOther": "کمپین نوروز",
    "LostReasonId": "00000000-0000-0000-0000-000000000000",
    "LostReasonNote": "",
    "Description": "ثبت شده از طریق درگاه پرداخت آنلاین سایت",
    "LabelIds": [
      "916ad5b3-0aaa-449a-b08c-60547fd253c0"
    ],
    "Fields": {
      "Field_8783_13_33": "پیشنهاد ویژه",
      "Field_5021_1_0": 15000000
    }
  },
  "DealItems": [
    {
      "ProductId": "bc30b34c-1faa-4a87-8f98-5793354103ae",
      "VariantId": "00000000-0000-0000-0000-000000000000",
      "ProductCode": "SKU-PRO-01",
      "Quantity": 2,
      "UnitPrice": 7500000,
      "Price": 15000000,
      "Discount": 0,
      "Description": "لایسنس سالانه نسخه حرفه‌ای"
    }
  ]
}
```

### Deal Status Enum
* `"Pending"`: Opportunity is in progress.
* `"Won"`: Deal closed successfully (فروش موفق).
* `"Lost"`: Deal lost (لغو شده یا انصراف).

### Response
```json
{
  "Response": {
    "Id": "5fa23d11-1e92-416b-9c74-e816a70a8421",
    "Code": 1042,
    "Title": "سفارش خرید نرم‌افزار سازمانی #10294",
    "Price": 15000000,
    "Status": "Pending"
  },
  "Error": null
}
```

---

## 3. Get Deal Detail

* **Endpoint:** `POST /api/deal/getdealdetail?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request
```json
{
  "Id": "5fa23d11-1e92-416b-9c74-e816a70a8421"
}
```

---

## 4. Search Deals (`deal/search_v2`)

Advanced multi-criteria filtering for deals:

* **Endpoint:** `POST /api/deal/search_v2?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request Payload
```json
{
  "Criteria": {
    "Keywords": "سازمانی",
    "Status": "Pending",
    "OwnerId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
    "PipelineId": "11111111-2222-3333-4444-555555555555",
    "PipelineStageId": "aaaa2222-bb22-cc33-dd44-ee5555555555",
    "SearchTimeField": 1,
    "SearchFromTime": "2026-01-01T00:00:00.000Z",
    "SearchToTime": "2026-12-31T23:59:59.000Z",
    "Sort": 0,
    "ContactIds": [],
    "LabelIds": [],
    "SourceId": "00000000-0000-0000-0000-000000000000",
    "LostReasonId": "00000000-0000-0000-0000-000000000000",
    "CustomFields": []
  },
  "From": 0,
  "Limit": 25
}
```

---

## 5. Auxiliary Deal Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/Deal/GetLostReasons` | `POST` | Returns list of configured lost reasons |
| `/api/Label/GetDealLabels` | `GET` | Returns all available deal colored tags/labels |
| `/api/deal/GetForecast` | `POST` | Calculates revenue forecast based on stage probabilities |
| `/api/deal/AddRelated` | `POST` | Links an existing contact or deal to another deal |
| `/api/deal/RemoveRelated` | `POST` | Unlinks an entity from a deal |
