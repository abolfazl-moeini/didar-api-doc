# 2. Contacts API (Persons & Companies)

Contacts in Didar represent either individual **Persons** (`Type: "Person"`) or **Companies** (`Type: "Company"`). Both share the underlying `/api/contact/` endpoint namespace.

---

## 1. Create or Update Person

Creates a new person contact or updates an existing one if `"Id"` is provided.

* **Endpoint:** `POST /api/contact/save?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request Payload
```json
{
  "Contact": {
    "Id": "00000000-0000-0000-0000-000000000000",
    "Type": "Person",
    "FirstName": "علی",
    "LastName": "محمدی",
    "Title": "مهندس",
    "OwnerId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
    "CompanyName": "توسعه داده گستر",
    "CompanyId": "00000000-0000-0000-0000-000000000000",
    "BirthDate": "1990-05-15",
    "BirthDateMessageId": "00000000-0000-0000-0000-000000000000",
    "MobilePhone": "09123456789",
    "WorkPhone": "02188776655",
    "WorkPhoneExtension": "104",
    "Fax": "02188776656",
    "Email": "ali.mohammadi@example.com",
    "IsVIP": false,
    "Position": "مدیر فنی",
    "CustomerCode": "CUST-1049",
    "NationalCode": "0012345678",
    "ZipCode": "1983963111",
    "VisibilityType": "Owner",
    "BackgroundInfo": "مشتری سابق شرکت و علاقه‌مند به خدمات ابری",
    "Fields": {
      "Field_8783_13_33": "ارزش فیلد سفارشی"
    },
    "Websites": {
      "KeyValues": [
        { "Key": "سایت شخصی", "Value": "https://alimohammadi.dev" }
      ]
    },
    "OtherPhones": {
      "KeyValues": [
        { "Key": "موبایل دوم", "Value": "09351112233" }
      ]
    },
    "OtherEmails": {
      "KeyValues": [
        { "Key": "ایمیل سازمانی", "Value": "tech@company.com" }
      ]
    },
    "Addresses": {
      "KeyValues": [
        { "Key": "آدرس تحویل", "Value": "تهران، خیابان ولیعصر، بالاتر از ظفر" }
      ]
    },
    "BankAccounts": {
      "Values": [
        {
          "Value1": "بانک ملت",
          "Value2": "123456789",
          "Value3": "6104337890123456",
          "Value4": "IR120120000000001234567890"
        }
      ]
    }
  },
  "SegmentIds": [
    "bab0aa3f-beaa-496c-a262-b3104998312d"
  ]
}
```

### Response
```json
{
  "Response": {
    "Id": "7a304859-9941-4775-926c-31a89c381c81",
    "DisplayName": "علی محمدی",
    "FirstName": "علی",
    "LastName": "محمدی",
    "MobilePhone": "09123456789",
    "RegisterDate": "2026-10-24T12:00:00.000Z"
  },
  "Error": null
}
```

---

## 2. Create or Update Company

* **Endpoint:** `POST /api/contact/save?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request Payload
```json
{
  "Contact": {
    "Id": "00000000-0000-0000-0000-000000000000",
    "Type": "Company",
    "FirstName": "فناوری اطلاعات نوآوران پارس",
    "OwnerId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3",
    "MobilePhone": "09120000000",
    "WorkPhone": "02188000000",
    "WorkPhoneExtension": "1",
    "Fax": "02188000001",
    "Email": "info@noavaran.ir",
    "IsVIP": true,
    "CustomerCode": "CORP-502",
    "EconomicIssue": "4111222333",
    "RegistrationNumber": "543210",
    "NationalID": "14001234567",
    "ZipCode": "1999999999",
    "VisibilityType": "All",
    "BackgroundInfo": "شرکت هلدینگ فناوری"
  },
  "SegmentIds": []
}
```

---

## 3. Lookup Contact by Phone Number

Rapidly checks if a person exists with a specific mobile or landline number. Commonly used during checkout or inbound call detection to prevent duplicates.

* **Endpoint:** `POST /api/contact/getbyphonenumber?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request
```json
{
  "MobilePhone": "09123456789"
}
```

### Response
```json
{
  "Response": [
    {
      "Id": "7a304859-9941-4775-926c-31a89c381c81",
      "DisplayName": "علی محمدی",
      "FirstName": "علی",
      "LastName": "محمدی",
      "MobilePhone": "09123456789",
      "OwnerId": "cbff524d-4536-4f42-b1ae-2643f6bb0aa3"
    }
  ],
  "Error": null
}
```
*Returns an empty array `[]` if no contact matches.*

---

## 4. Get Contact Detail by ID

* **Endpoint:** `POST /api/contact/GetContactDetail?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request
```json
{
  "Id": "7a304859-9941-4775-926c-31a89c381c81"
}
```

---

## 5. Search Persons

Advanced filtered search for people with pagination and date range.

* **Endpoint:** `POST /api/contact/PersonSearch?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request
```json
{
  "Criteria": {
    "Keywords": "محمدی",
    "OwnerId": "00000000-0000-0000-0000-000000000000",
    "SearchFromTime": "1970-01-01T00:00:00.000Z",
    "SearchToTime": "9999-12-01T00:00:00.000Z",
    "SortOrder": 0,
    "IsDeleted": false,
    "IsPinned": false,
    "IsVIP": -1,
    "LeadType": -1,
    "CustomFields": []
  },
  "From": 0,
  "Limit": 20
}
```

### Response
```json
{
  "Response": {
    "TotalCount": 1,
    "List": [
      {
        "Id": "7a304859-9941-4775-926c-31a89c381c81",
        "DisplayName": "علی محمدی",
        "FirstName": "علی",
        "LastName": "محمدی",
        "MobilePhone": "09123456789"
      }
    ]
  },
  "Error": null
}
```

---

## 6. Search Companies

* **Endpoint:** `POST /api/contact/CompanySearch?apikey={API_KEY}`
* **Content-Type:** `application/json`

### Request
```json
{
  "Criteria": {
    "Keywords": "نوآوران",
    "SearchFromTime": "1970-01-01T00:00:00.000Z",
    "SearchToTime": "9999-12-01T00:00:00.000Z",
    "SortOrder": 0
  },
  "From": 0,
  "Limit": 20
}
```

---

## 7. Additional Contact Actions (Reverse-Engineered)

The following endpoints manage auxiliary contact state:

| Endpoint | Method | Description | Payload |
| :--- | :--- | :--- | :--- |
| `/api/contact/SetVIP` | `POST` | Toggles VIP flag | `{ "Id": "guid", "IsVIP": true }` |
| `/api/contact/SetPin` | `POST` | Pins contact to top of list | `{ "Id": "guid", "IsPinned": true }` |
| `/api/contact/SetStayInTouch` | `POST` | Schedules keep-in-touch reminders | `{ "ContactId": "guid", "IntervalDays": 30 }` |
| `/api/contact/SetCompanyPersonel` | `POST` | Links a Person to a Company | `{ "CompanyId": "guid", "PersonId": "guid", "Position": "مدیر" }` |
| `/api/contact/UnDelete` | `POST` | Restores a soft-deleted contact | `{ "Id": "guid" }` |
