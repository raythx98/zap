export function formatLink(url) {
    if (!url) return { formatted: "", type: "none", isValid: false };

    let cleaned = url.trim();
    let type = "none";

    // Regex to detect missing or broken protocols (http:/, https:, htp://, etc.)
    const protocolRegex = /^([a-z0-9]+:?\/+)?/i;
    
    const isHttps = cleaned.toLowerCase().startsWith("https://");
    const isHttp = cleaned.toLowerCase().startsWith("http://");

    if (!isHttps && !isHttp) {
        // If it has some broken protocol or none at all, fix it
        cleaned = "https://" + cleaned.replace(protocolRegex, "");
        type = "fixed";
    } else {
        // Additional cleanup: ensure double slashes after protocol
        cleaned = cleaned.replace(/^(https?:\/)(?!\/)/i, "$1/"); 
    }

    if (type === "none" && url !== cleaned) type = "cleaned";

    // Basic validity check: must have a dot and at least two chars for TLD
    // Using URL constructor for final confirmation
    let isValid = false;
    try {
        const urlObj = new URL(cleaned);
        isValid = urlObj.hostname.includes(".") && urlObj.hostname.split(".").pop().length >= 2;
    } catch (e) {
        isValid = false;
    }

    return {
        formatted: cleaned,
        type: type,
        isValid: isValid
    };
}