# 1. Architecture, Authentication & Conventions

## Overview

Didar CRM (`didar.me`) provides a comprehensive REST-style HTTP API that powers both external integrations (WordPress, WooCommerce, n8n, VoIP PBX systems) and its own Angular-based Single Page Application (`app.didar.me`).

This document describes the underlying architecture, authentication mechanisms, conventions, and error responses gathered through black-box testing and reverse-engineering of official SDKs and production client bundles.

---

## Base URLs

| Environment | Base URL | Description |
| :--- | :--- | :--- |
| **Primary Production** | `https://app.didar.me` | Standard gateway used by both web UI and API consumers |
| **API Alternate** | `https://api.didar.me` | Secondary edge gateway (routes to identical backend clusters) |

All API endpoints follow the path prefix `/api/`.

---

## Authentication Methods

Didar supports two primary authentication models:

### 1. API Key Authentication (Recommended for Backend Integrations)
API keys are issued in the Didar CRM web panel under **Settings → API Keys** (تنظیمات → کلیدهای دسترسی).

The key is passed as a mandatory query string parameter `apikey`:

```http
POST https://app.didar.me/api/contact/save?apikey=YOUR_API_KEY_HERE
Content-Type: application/json

{
  "Contact": { ... }
}
```

> [!NOTE]
> Ensure the query string parameter name is strictly lowercase `apikey`. Never confuse the `API Key` with the `API ID` (API ID is an informational identifier; API Key is the secret credential).

### 2. Session Cookie Authentication (`LocoAuthCookie`)
When authenticating requests from within browser automation, internal tools, or testing environments without an API key, Didar relies on an encrypted session cookie named `LocoAuthCookie`:

```http
POST https://app.didar.me/api/deal/search_v2
Cookie: LocoAuthCookie=CFDJ8...
Content-Type: application/json
```

---

## Envelope & Response Schema

All responses from Didar endpoints adhere to a standardized envelope format:

### Success Response
```json
{
  "Response": {
    "Id": "916ad5b3-0aaa-449a-b08c-60547fd253c0",
    "Title": "معامله جدید",
    "Status": "Pending"
  },
  "Error": null
}
```

### Error Response
```json
{
  "Response": null,
  "Error": "شماره تلفن وارد شده نامعتبر است."
}
```

When an error occurs, the HTTP status code is typically `200` with the `Error` string populated, or `400` / `500` with a JSON body containing `Error` or `message`.

---

## Core Conventions

### 1. Unique Identifiers (GUID / UUID)
All database entity IDs in Didar are standard UUID v4 strings (36 characters with hyphens):
`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

When an entity is unassigned or null, Didar uses the **Zero GUID**:
```text
00000000-0000-0000-0000-000000000000
```
For example, if a deal has no associated Company, provide `"CompanyId": "00000000-0000-0000-0000-000000000000"`.

### 2. Custom Fields Pattern
Custom fields created by workspace administrators in Didar follow a dynamic naming syntax:
```text
Field_{FIELD_ID}_{TYPE_ID}_{FLAGS}
```
Example: `"Field_8783_13_33": "کارشناس ارشد"`

In API payloads, custom fields are supplied inside a dedicated `"Fields"` dictionary:
```json
"Fields": {
  "Field_8783_13_33": "ارزش دلخواه",
  "Field_9102_1_0": 1500000
}
```

### 3. Key-Value Collection Schema
For multi-value attributes (such as multiple phone numbers, addresses, websites, or emails), Didar expects a wrapped `KeyValues` object array:

```json
"OtherPhones": {
  "KeyValues": [
    { "Key": "تلفن دفتر", "Value": "02188888888" },
    { "Key": "شماره مستقیم", "Value": "09121111111" }
  ]
}
```

```json
"Addresses": {
  "KeyValues": [
    { "Key": "دفتر مرکزی", "Value": "تهران، میدان ونک، کوچه ..." }
  ]
}
```

### 4. Visibility Types
Visibility can be restricted on Contacts, Deals, and Cases using the following values:
* `"Owner"`: Only visible to the assigned owner.
* `"OwnerGroup"`: Visible to the owner's primary department/group.
* `"OwnerSubGroup"`: Visible to the owner's group and all sub-teams.
* `"All"`: Visible to all workspace users with read permissions.

### 5. Datetime Format
All timestamps should be formatted in standard UTC ISO-8601 strings:
```text
YYYY-MM-DDTHH:mm:ss.sssZ
```
Example: `2026-10-24T12:00:00.000Z`
