import { error } from "@sveltejs/kit";

export function load({ params }) {
    const status = Number(params.code) || 418;
    error(status, `Test error: ${status}`);
}
