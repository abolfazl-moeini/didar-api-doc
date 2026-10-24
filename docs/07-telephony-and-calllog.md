# 7. Telephony & VoIP Integration (پاپ‌آپ کالرآیدی و تلفن گویا)

Didar provides seamless integration with VoIP PBX servers (Asterisk, Issabel, FreePBX, Simotel, Yeastar, Cisco, etc.). When a call arrives, your PBX can trigger a live popup in the agent's browser showing customer profile and recent deals.

---

## 1. Inbound Caller ID Popup Endpoint

* **Endpoint:** `GET /api/calllog/insert`
* **Protocol:** HTTP GET

### Query Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `apikey` | `string` | **Yes** | Your Didar API Key (or dedicated CallerID Key) |
| `number` | `string` | **Yes** | Customer phone number (e.g., `09123456789`) |
| `internalnumber` | `string` | **Yes** | Agent's PBX internal extension (شماره داخلی، مثلاً `102`) |

### Example Request
```http
GET https://app.didar.me/api/calllog/insert?apikey=YOUR_API_KEY&number=09123456789&internalnumber=102
```

### Response
```json
{
  "Response": {
    "Success": true,
    "Contact": {
      "Id": "7a304859-9941-4775-926c-31a89c381c81",
      "DisplayName": "علی محمدی"
    }
  },
  "Error": null
}
```

---

## 2. PBX Integration Examples

### Asterisk Dialplan (`extensions_custom.conf`)
Add the following line to your incoming call context:

```asterisk
[from-trunk-custom]
exten => _X.,1,NoOp(Sending CallerID to Didar CRM)
 same => n,Set(CURL_RESULT=${CURL(https://app.didar.me/api/calllog/insert?apikey=YOUR_API_KEY&number=${CALLERID(num)}&internalnumber=${EXTEN})})
 same => n,Dial(SIP/${EXTEN},30)
 same => n,Hangup()
```

### Python / Simotel Webhook Example
```python
import httpx

def notify_didar(caller_number: str, agent_extension: str, api_key: str):
    url = "https://app.didar.me/api/calllog/insert"
    params = {
        "apikey": api_key,
        "number": caller_number,
        "internalnumber": agent_extension
    }
    with httpx.Client(timeout=3.0) as client:
        response = client.get(url, params=params)
        return response.json()
```
