import { post, postBasic } from './api';
import { remove, set } from "@/helper/session";
import { parseError } from '@/lib/error-handler';

export async function login({email, password}) {
  try {
    const data = await postBasic("auth/v1/login", { email, password });
    set(data);
    return data;
  } catch (error) {
    throw new Error(parseError(error));
  }
}

export async function signup({email, password}) {
  try {
    const data = await postBasic("auth/v1/register", { email, password });
    set(data);
    return data;
  } catch (error) {
    throw new Error(parseError(error));
  }
}

export async function logout() {
  try {
    await post("auth/v1/logout");
  } catch (error) {
    console.error("Logout failed", error);
  } finally {
    remove();
  }
}