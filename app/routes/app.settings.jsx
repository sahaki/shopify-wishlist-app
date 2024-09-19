import {
  Box,
  BlockStack,
  Button,
  Card,
  InlineGrid,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState } from 'react'
import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import db from "../db.server";

export async function loader() {
  // get data from data from database
  let settings = {
    name: "App Name",
    description: "App Description"
  }

  settings.name = await db.settings.findUnique({
    where: {
      id: '1',
    },
  })
  settings.name = settings.name.config_value;

  settings.description = await db.settings.findUnique({
    where: {
      id: '2',
    },
  })
  settings.description = settings.description.config_value;

  return json(settings)
}
 
export async function action({request}) {
  // updates persistent data
  let settings = await request.formData();
  settings = Object.fromEntries(settings)

  const configUpdates = [
    { id: '1', config_path: 'app_name', config_value: settings.name },
    { id: '2', config_path: 'app_description', config_value: settings.description },
  ];

  // Batch upsert operations
  const upsertPromises = configUpdates.map((config) =>
    db.settings.upsert({
      where: { id: config.id },
      update: config,
      create: config,
    })
  );

  // Await all upserts concurrently
  await Promise.all(upsertPromises);
  
  return json(settings)
}

export default function SettingsPage() {
  const settings = useLoaderData();
  const [formState, setFormState] = useState(settings);

  return (
    <Page>
      <TitleBar title="Settings" />
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Settings
              </Text>
              <Text as="p" variant="bodyMd">
                Update app settings and perferences.
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <Form method="POST">
              <BlockStack gap="400">
                <TextField 
                label="App Name" 
                name="name"
                value={formState.name}
                onChange={(value) => setFormState({...formState, name: value})}
                />

                <TextField
                label="Description"
                name="description"
                value={formState.description}
                onChange={(value) => setFormState({...formState, description: value})}
                multiline={4}
                autoComplete="off" />

                <Button variant="primary" submit={true}>Save Settings</Button>
              </BlockStack>
            </Form>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}