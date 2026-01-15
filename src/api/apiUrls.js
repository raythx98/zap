import {UAParser} from "ua-parser-js";
import { get, post, del, postBasic } from "./api";
import { getAccessToken } from "@/helper/session";
import { parseError } from "@/lib/error-handler";

export async function getUrls() {
  try {
    return await get("urls/v1");
  } catch (error) {
    throw new Error(parseError(error));
  }
}

export async function getUrl({id}) {
  try {
    return await get(`urls/v1/${id}`);
  } catch (error) {
    throw new Error(parseError(error));
  }
}

const parser = new UAParser();

export async function redirect(id) {
  const res = parser.getResult();
  const device = res.device.type || "desktop";

  let city = "Unknown";
  let country = "Unknown";

  try {
    const locationResponse = await fetch("https://ipapi.co/json");
    if (locationResponse.ok) {
      const locationData = await locationResponse.json();
      city = locationData.city || "Unknown";
      country = locationData.country_name || "Unknown";
    }
  } catch (error) {
    console.error("Location fetch failed", error);
  }

  try {
    const json = await postBasic(`urls/v1/redirect/${id}`, {
      city,
      country,
      device,
    });
    window.location.href = json.full_url;
  } catch (error) {
    throw new Error(parseError(error));
  }
}

export async function createUrl({title, fullUrl, customUrl}) {
  try {
    const payload = { title, full_url: fullUrl, custom_url: customUrl };
    const hasToken = !!getAccessToken();
    
    const data = hasToken 
      ? await post(`urls/v1`, payload)
      : await postBasic(`urls/v1`, payload);
    
    return { ...data, title };
  } catch (error) {
    throw new Error(parseError(error));
  }
}

export async function deleteUrl(id) {
  try {
    await del(`urls/v1/${id}`);
  } catch (error) {
    throw new Error(parseError(error));
  }
}