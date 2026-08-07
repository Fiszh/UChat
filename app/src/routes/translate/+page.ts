// +page.ts
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = () =>
    redirect(307, "https://crowdin.com/project/uchat-app");
