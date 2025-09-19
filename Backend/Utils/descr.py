import re
from urllib.parse import parse_qs, urlparse


def extract_direct_image_url(url: str) -> str:
    """
    Extract direct image URL from messy redirect links (Google, Bing, Pinterest, etc.)
    Falls back to original if no direct link is found.
    """

    parsed = urlparse(url)
    query = parse_qs(parsed.query)

    # ✅ Google Images (`imgurl`)
    if "imgurl" in query:
        return query["imgurl"][0]

    # ✅ Bing (`mediaurl`)
    if "mediaurl" in query:
        return query["mediaurl"][0]

    # ✅ Pinterest, Amazon, other (`url` sometimes holds the real link)
    if "url" in query:
        candidate = query["url"][0]
        if candidate.lower().endswith((".jpg", ".jpeg", ".png", ".gif", ".webp")):
            return candidate

    # ✅ Direct image link
    if re.search(r"\.(jpg|jpeg|png|gif|webp)(\?.*)?$", url, re.IGNORECASE):
        return url

    # ✅ Fallback: return as-is
    return url





def split_responses(text: str):
    # Split on **Option...** blocks
    parts = text.split("\n\n")
    parts = [p.strip() for p in parts if p.strip()]
    return parts


