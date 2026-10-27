# 4. Products & Inventory API (محصولات و انبار)

Didar includes a lightweight product catalog with SKU codes, categories, pricing units (IRR, Tomans, etc.), and product variants.

---

## 1. Create or Update Product (`product/save`)

* **Endpoint:** `POST /api/product/save?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request Payload
```json
{
  "Product": {
    "Id": "00000000-0000-0000-0000-000000000000",
    "Title": "دوره آموزش پیشرفته پایتون و هوش مصنوعی",
    "Code": "CRS-PY-AI-01",
    "Unit": "IRR",
    "UnitPrice": 45000000,
    "Description": "دوره ویدیویی غیرحضوری همراه با پشتیبانی تلگرامی",
    "ProductCategoryId": "33333333-4444-5555-6666-777777777777",
    "IsActive": true,
    "Variants": [
      {
        "Title": "نسخه استاندارد (بدون منتورشیپ)",
        "TitleForInvoice": "نسخه استاندارد (بدون منتورشیپ)",
        "VariantCode": "CRS-PY-AI-01-STD",
        "UnitPrice": 35000000,
        "IsDefault": true,
        "IsDeleted": false
      },
      {
        "Title": "نسخه VIP (همراه با منتورشیپ اختصاصی)",
        "TitleForInvoice": "نسخه VIP (همراه با منتورشیپ اختصاصی)",
        "VariantCode": "CRS-PY-AI-01-VIP",
        "UnitPrice": 55000000,
        "IsDefault": false,
        "IsDeleted": false
      }
    ],
    "Fields": {
      "Field_1042_1_0": "سطح پیشرفته"
    }
  }
}
```

> [!TIP]
> When adding variants, ensure each variant object has `IsDeleted: false` and `TitleForInvoice` populated (usually set identical to `Title`), which matches Didar's internal database rules.

> [!IMPORTANT]
> **Strict Category Validation**: In Didar CRM backend validation, `ProductCategoryId` is mandatory. If omitted, passed as an empty string `""`, or set to null, the API rejects the request with `{"Error": "product category is empty"}`. Integrations (like WooCommerce or ERP connectors) must map product categories or enforce a fallback category GUID (from `/api/product/categories`) to prevent sync failure.

### Response
```json
{
  "Response": {
    "Id": "bc30b34c-1faa-4a87-8f98-5793354103ae",
    "Title": "دوره آموزش پیشرفته پایتون و هوش مصنوعی",
    "Code": "CRS-PY-AI-01",
    "UnitPrice": 45000000,
    "Variants": [
      {
        "Id": "fa981123-1111-2222-3333-444455556666",
        "VariantCode": "CRS-PY-AI-01-STD"
      }
    ]
  },
  "Error": null
}
```

---

## 2. Lookup Products by Codes / SKUs

Essential for e-commerce sync (WooCommerce, Shopify) to match store SKUs with Didar products in a single batch query.

* **Endpoint:** `POST /api/product/getproductbycodes?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request
```json
{
  "Code": [
    "CRS-PY-AI-01",
    "SKU-PRO-01",
    "BOOK-PYTHON-101"
  ]
}
```

### Response
```json
{
  "Response": {
    "Total": 1,
    "Products": [
      {
        "Id": "bc30b34c-1faa-4a87-8f98-5793354103ae",
        "Title": "دوره آموزش پیشرفته پایتون و هوش مصنوعی",
        "Code": "CRS-PY-AI-01",
        "UnitPrice": 45000000,
        "Variants": [ ... ]
      }
    ]
  },
  "Error": null
}
```

---

## 3. Search Products

* **Endpoint:** `POST /api/product/search?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request
```json
{
  "Criteria": {
    "Keywords": "پایتون"
  },
  "From": 0,
  "Limit": 20
}
```

---

## 4. Product Categories

### Get Categories List
* **Endpoint:** `POST /api/product/categories?apikey={API_KEY}`
* **Body:** `{}`

### Save or Update Category
* **Endpoint:** `POST /api/product/SaveCategory?apikey={API_KEY}`
* **Request:**
```json
{
  "Category": {
    "Id": "00000000-0000-0000-0000-000000000000",
    "Title": "دوره‌های آموزشی"
  }
}
```

---

## 5. Reverse-Engineered Inventory Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/product/getProductByIds` | `POST` | Retrieve products by list of UUIDs: `{ "Ids": ["uuid"] }` |
| `/api/product/Delete` | `POST` | Delete product by ID: `{ "Id": "uuid" }` |
| `/api/product/SuggestionProductCode` | `POST` | Suggests the next available auto-incremented SKU code |
| `/api/product/SearchForSepidyar` | `POST` | Specialized search used by Sepidar accounting integrations |
| `/api/product/PreProcessImport` | `POST` | Validates bulk Excel product import |
| `/api/product/RegisterImport` | `POST` | Executes parsed Excel bulk product import |
