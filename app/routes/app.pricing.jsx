import {
  Page,
  Box,
  Button,
  Card,
  CalloutCard,
  Text,
  Grid,
  Divider,
  BlockStack,
  ExceptionList,
  Link
} from "@shopify/polaris";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "../shopify.server";
//import './app.wishlist.css';

import {
  CheckCircleIcon
} from '@shopify/polaris-icons'

export async function loader({ request }) {
  const { billing, session } = await authenticate.admin(request);
  const app_name = process.env.APP_NAME || "radar-wishlist-app";
  console.log(app_name)

  try {
    // Attempt to check if the shop has an active payment for any plan
    const billingCheck = await billing.require({
      plans: [MONTHLY_PLAN, ANNUAL_PLAN],
      isTest: true,
      // Instead of redirecting on failure, just catch the error
      onFailure: () => {
        throw new Error('No active plan');
      },
    });

    // If the shop has an active subscription, log and return the details
    const subscription = billingCheck.appSubscriptions[0];
    console.log(`Shop is on ${subscription.name} (id ${subscription.id})`);
    return json({ billing, session, plan: subscription, app_name });

  } catch (error) {
    // If the shop does not have an active plan, return an empty plan object
    if (error.message === 'No active plan') {
      console.log('Shop does not have any active plans.');
      return json({ billing, session, plan: { name: "Free" }, app_name });
    }
    // If there is another error, rethrow it
    throw error;
  }
}


let planData = [
  {
    title: "Free",
    description: "Free plan with basic features",
    price: "0",
    action: "Upgrade to pro",
    name: "Free",
    url: "/app/upgrade",
    features: [
      "100 wishlist per day",
      "500 Products",
      "Basic customization",
      "Basic support",
      "Basic analytics"
    ]
  },
  {
    title: "Pro",
    description: "Pro plan with advanced features",
    price: "10",
    name: "Monthly subscription",
    action: "Upgrade to pro",
    url: "/app/upgrade",
    features: [
      "Unlimted wishlist per day",
      "10000 Products",
      "Advanced customization",
      "Priority support",
      "Advanced analytics"
    ]
  },
]

export default function PricingPage() {
  const { billing, session, plan, app_name } = useLoaderData();
  let { shop } = session;
  let myShop = shop.replace(".myshopify.com", "");

  return (
    <Page>
      <ui-title-bar title="Pricing" />
      <Card roundedAbove="sm">
        <BlockStack gap="400">
          <Text as="h3" variant="headingMd">
            Your subscription plan
          </Text>
          { plan.name == "Monthly subscription" ? (
            <p>
              You're currently on pro plan. All features are unlocked.
            </p>
          ) : (
            <p>
              You're currently on free plan. Upgrade to pro to unlock more features.
            </p>
          )}

          {plan.name !== "Free" && (
            <Button primary url={`/app/cancel`}>Cancel Plan</Button>
          )}
        </BlockStack>
          
      </Card>

      <div style={{ margin: "0.5rem 0"}}>
        <Divider />
      </div>

      <Grid>

        {planData.map((plan_item, index) => (
          <Grid.Cell key={index} columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
            <Card background={ plan_item.name == plan.name ? "bg-surface-success" : "bg-surface" } sectioned>
              <Box padding="400">
                <Text as="h3" variant="headingMd">
                  {plan_item.title}
                </Text>
                <Box as="p" variant="bodyMd">
                  {plan_item.description}
                  {/* If plan_item is 0, display nothing */}
                  <br />
                  <Text as="p" variant="headingLg" fontWeight="bold">
                    {plan_item.price === "0" ? "$0" : "$" + plan_item.price}
                  </Text>
                </Box>

                <div style={{ margin: "0.5rem 0"}}>
                  <Divider />
                </div>

                <BlockStack gap={100}>
                  {plan_item.features.map((feature, index) => (
                    <ExceptionList
                      key={index}
                      items={[
                        {
                          icon: CheckCircleIcon,
                          description: feature,
                        },
                      ]}
                    />
                  ))}
                </BlockStack>
                <div style={{ margin: "0.5rem 0"}}>
                  <Divider />
                </div>

                { plan_item.name == "Monthly subscription" ?
                    plan.name != "Monthly subscription" ? (
                      <Button url={`/app/upgrade`} primary>
                        {plan_item.action}
                      </Button>
                    ) : (
                      <p style={{margin:"0.5rem 0"}}>
                        You're currently on this plan
                      </p>
                    )
                : plan_item.name == "Free" ? 
                    plan.name != "Free" ? (
                      <p style={{margin:"0.5rem 0",height:"1.25rem"}}></p>
                    ) : (
                      <p style={{margin:"0.5rem 0"}}>
                        You're currently on this plan
                      </p>
                  ) : ''}
              </Box>
            </Card>
          </Grid.Cell>
        ))}

      </Grid>

    </Page>
  );
}
