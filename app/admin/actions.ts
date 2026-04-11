"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setPageQuota(paramsUserId: string, newQuota: number) {
  const client = await clerkClient();
  
  try {
    await client.users.updateUserMetadata(paramsUserId, {
      publicMetadata: {
        pageQuota: newQuota
      }
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error setting quota:", error);
    throw new Error("No se pudo actualizar la cuota");
  }
}
