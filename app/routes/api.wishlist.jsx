import { json } from "@remix-run/node";
import db from "../db.server";
import { cors } from 'remix-utils/cors';

export async function loader({request}) {
    const url = new URL(request.url);
    const customerId = url.searchParams.get("customerId");
    const shop = url.searchParams.get("shop");
    const productId = url.searchParams.get("productId");

    let wishlist = []
  
    if(customerId && shop && productId) {
      // If customerId, shop, productId is provided, return wishlist items for that customer.
      wishlist = await db.wishlist.findMany({
        where: {
          customerId: customerId,
          shop: shop,
          productId: productId,
        },
      });
    }else if(customerId && shop){
      // If customerId, shop is provided, return wishlist items for that customer.
      wishlist = await db.wishlist.findMany({
        where: {
          customerId: customerId,
          shop: shop,
        },
      });
    }else{
      return json({
        message: "Missing data. Required data: customerId, productId, shop",
        method: "GET"
      });
    }
  
    const response = json({
      ok: true,
      message: "Success",
      data: wishlist,
    });
    return cors(request,response);
}

export async function action({request}) {
    let data = await request.formData();
    data = Object.fromEntries(data);
    const customerId = data.customerId;
    const productId = data.productId;
    const shop = data.shop;
    const _action = data._action;

    if(!customerId || !productId || !shop || !_action) {
        return json({
        message: "Missing data. Required data: customerId, productId, shop, _action",
        method: _action
        });
    }

    let response;
    switch (_action) {
        case "CREATE":
            // Handle POST request logic here
            // For example, adding a new item to the wishlist
            const wishlist = await db.wishlist.create({
                data: {
                customerId,
                productId,
                shop,
                },
            });

            response = json({ message: "Product added to wishlist", method: _action, wishlisted: true });
            return cors(request, response);
        case "DELETE":
            // Handle DELETE request logic here (Not tested)
            // For example, removing an item from the wishlist
            await db.wishlist.deleteMany({
                where: {
                customerId: customerId,
                shop: shop,
                productId: productId,
                },
            });
        
            response = json({ message: "Product removed from your wishlist", method: _action, wishlisted: false });
            return cors(request, response);
        default:
            return new Response("Method Not Allowed", {status: 405})
    } 
}