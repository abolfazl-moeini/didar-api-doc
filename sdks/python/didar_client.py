"""Modern Python client for Didar CRM (دیدار).

Supports standard requests or httpx.
"""
from typing import Any, Dict, List, Optional
import requests


class DidarClient:
    def __init__(self, api_key: str, base_url: str = "https://app.didar.me"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")

    def request(
        self,
        path: str,
        method: str = "POST",
        body: Optional[Dict[str, Any]] = None,
        query: Optional[Dict[str, str]] = None,
    ) -> Any:
        url = f"{self.base_url}/api/{path.lstrip('/')}"
        params = {"apikey": self.api_key}
        if query:
            params.update(query)

        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        response = requests.request(
            method=method,
            url=url,
            params=params,
            json=body if method != "GET" else None,
            headers=headers,
            timeout=30.0,
        )
        response.raise_for_status()

        data = response.json()
        if isinstance(data, dict) and data.get("Error"):
            raise RuntimeError(f"Didar CRM Error: {data['Error']}")

        return data.get("Response", data)

    # --- Contacts ---
    def save_contact(self, contact: Dict[str, Any], segment_ids: Optional[List[str]] = None) -> Any:
        return self.request("contact/save", method="POST", body={
            "Contact": contact,
            "SegmentIds": segment_ids or []
        })

    def get_contact_by_phone(self, mobile_phone: str) -> List[Dict[str, Any]]:
        return self.request("contact/getbyphonenumber", method="POST", body={
            "MobilePhone": mobile_phone
        })

    # --- Deals ---
    def get_pipelines(self, type_id: int = 0) -> List[Dict[str, Any]]:
        return self.request(f"pipeline/list/{type_id}", method="POST", body={})

    def save_deal(self, deal: Dict[str, Any], deal_items: Optional[List[Dict[str, Any]]] = None) -> Any:
        return self.request("deal/save_v2", method="POST", body={
            "Deal": deal,
            "DealItems": deal_items or []
        })

    # --- Telephony ---
    def popup_caller_id(self, phone_number: str, agent_extension: str) -> Any:
        return self.request("calllog/insert", method="GET", query={
            "number": phone_number,
            "internalnumber": agent_extension
        })
