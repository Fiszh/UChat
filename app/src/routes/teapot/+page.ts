import { error } from "@sveltejs/kit";

export function load({ params }) {
    error(418, "I'm a teapot ☕");
}
