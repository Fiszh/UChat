import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
    const status = Number(params.code) || 418;
    error(status, `Test error: ${status}`);
};
