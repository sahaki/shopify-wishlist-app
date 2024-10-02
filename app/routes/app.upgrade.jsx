import {  redirect } from "@remix-run/node";
import { authenticate, MONTHLY_PLAN } from "../shopify.server";


export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);
  let { shop } = session;
  let myShop = shop.replace(".myshopify.com", "");
  const app_name = process.env.APP_NAME || "radar-wishlist-app";

  await billing.require({
    plans: [MONTHLY_PLAN],
    onFailure: async () => billing.request({
      plan: MONTHLY_PLAN,
      isTest: true,
      returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${app_name}/app/pricing`,
    }),
  });

  // App logic
  return redirect("/app/pricing");
};
