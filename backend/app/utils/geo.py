"""Lightweight IP geolocation + hashing helpers.

No third-party dependency: uses urllib and a small in-memory cache. Every
public function is defensive and never raises for the caller.
"""
import hashlib
import ipaddress
import json
import urllib.request
from typing import Dict, Optional

from fastapi import Request

from app.core.config import settings

_COUNTRY_CACHE: Dict[str, Dict[str, str]] = {}

_UNKNOWN: Dict[str, str] = {"country": "Unknown", "country_code": "", "city": ""}


def client_ip_from_request(request: Request) -> str:
    """Resolve the real client IP behind proxies (Render / Vercel edge)."""
    xff = request.headers.get("x-forwarded-for")
    if xff:
        # First entry is the original client.
        return xff.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    if request.client and request.client.host:
        return request.client.host
    return ""


def hash_ip(ip: str) -> str:
    """Salted SHA-256 of the IP so we never persist raw addresses."""
    if not ip:
        return ""
    salted = f"{settings.secret_key}:{ip}".encode("utf-8")
    return hashlib.sha256(salted).hexdigest()


def _is_public_ip(ip: str) -> bool:
    try:
        addr = ipaddress.ip_address(ip)
    except ValueError:
        return False
    return not (
        addr.is_private
        or addr.is_loopback
        or addr.is_link_local
        or addr.is_multicast
        or addr.is_reserved
        or addr.is_unspecified
    )


def resolve_country(ip: str) -> Dict[str, str]:
    """Return {country, country_code, city}; Unknown for private/invalid IPs.

    Results are cached in-memory per IP. Never raises.
    """
    if not ip or not _is_public_ip(ip):
        return dict(_UNKNOWN)

    if ip in _COUNTRY_CACHE:
        return _COUNTRY_CACHE[ip]

    url = (
        f"http://ip-api.com/json/{ip}"
        "?fields=status,country,countryCode,city"
    )
    result = dict(_UNKNOWN)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "portfolio-analytics"})
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        if data.get("status") == "success":
            result = {
                "country": data.get("country") or "Unknown",
                "country_code": data.get("countryCode") or "",
                "city": data.get("city") or "",
            }
    except Exception:
        # Network hiccups / rate limits: fall back to Unknown, never raise.
        result = dict(_UNKNOWN)

    _COUNTRY_CACHE[ip] = result
    return result
