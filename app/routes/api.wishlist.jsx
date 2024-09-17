
import { json } from "@remix-run/node"; // or cloudflare/deno

export async function loader({request}) {
  return json({message: "Hello World"});
}

export async function action({request}) {
    const method = request.method

    switch (method) {
        case "POST":
            return json({method: method, message: "Success"})
        case "PATCH":
            return json({method: method, message: "Success"})
        default:
            return new Response("Method Not Allowed", {status: 405})
    }
}