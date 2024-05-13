import { useState, useEffect, useCallback } from "react";
import {
  Banner,
  Card,
  FormLayout,
  Layout,
  Page,
  TextField,
  Checkbox,
} from "@shopify/polaris";
import {
  Form,
  useActionData,
  useNavigation,
  useSubmit,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ params, request }) => {
  const { id } = params;
  const { admin } = await authenticate.admin(request);

  if (id != "new") {
    const gid = `gid://shopify/DeliveryCustomization/${id}`;

    const response = await admin.graphql(
      `#graphql
        query getDeliveryCustomization($id: ID!) {
          deliveryCustomization(id: $id) {
            id
            title
            enabled
            metafield(namespace: "$app:delivery-customization", key: "order") {
              id
              value
            }
          }
        }`,
      {
        variables: {
          id: gid,
        },
      }
    );

    const responseJson = await response.json();
    const deliveryCustomization = responseJson.data.deliveryCustomization;
    const metafieldValue = JSON.parse(deliveryCustomization.metafield.value);

    return {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderArr: metafieldValue.orderArr,
        reversed: !!metafieldValue.reversed,
      }),
    };
  }

  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderArr: "",
      reversed: false,
    }),
  };
};

export const action = async ({ params, request }) => {
  const { functionId, id } = params;
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const orderArr = formData.get("orderArr");
  const reversed = formData.get("reversed") === 'true';

  const deliveryCustomizationInput = {
    functionId,
    title: `Change order of delivery methods`,
    enabled: true,
    metafields: [
      {
        namespace: "$app:delivery-customization",
        key: "order",
        type: "json",
        value: JSON.stringify({
          orderArr,
          reversed,
        }),
      },
    ],
  };

  if (id != "new") {
    const response = await admin.graphql(
      `#graphql
        mutation updateDeliveryCustomization($id: ID!, $input: DeliveryCustomizationInput!) {
          deliveryCustomizationUpdate(id: $id, deliveryCustomization: $input) {
            deliveryCustomization {
              id
            }
            userErrors {
              message
            }
          }
        }`,
      {
        variables: {
          id: `gid://shopify/DeliveryCustomization/${id}`,
          input: deliveryCustomizationInput,
        },
      }
    );

    const responseJson = await response.json();
    const errors = responseJson.data.deliveryCustomizationUpdate?.userErrors;

    return json({ errors });
  } else {
    const response = await admin.graphql(
      `#graphql
        mutation createDeliveryCustomization($input: DeliveryCustomizationInput!) {
          deliveryCustomizationCreate(deliveryCustomization: $input) {
            deliveryCustomization {
              id
            }
            userErrors {
              message
            }
          }
        }`,
      {
        variables: {
          input: deliveryCustomizationInput,
        },
      }
    );

    const responseJson = await response.json();
    const errors = responseJson.data.deliveryCustomizationCreate?.userErrors;

    return json({ errors });
  }
};

export default function DeliveryCustomization() {
  const submit = useSubmit();
  const actionData = useActionData();
  const navigation = useNavigation();
  const loaderData = useLoaderData();

  const [orderArr, setOrderArr] = useState(loaderData.orderArr);
  const [reversed, setReversed] = useState(!!loaderData.reversed);

  useEffect(() => {
    if (loaderData) {
      const parsedData = JSON.parse(loaderData.body);
      setOrderArr(parsedData.orderArr);
      setReversed(!!parsedData.reversed);
    }
  }, [loaderData]);

  const isLoading = navigation.state === "submitting";

  const handleReversedChange = useCallback(
    (selected) => setReversed(selected),
    []
  );

  useEffect(() => {
    if (actionData?.errors.length === 0) {
      open('shopify:admin/settings/shipping/customizations', '_top')
    }
  }, [actionData?.errors]);

  const errorBanner = actionData?.errors.length ? (
    <Layout.Section>
      <Banner
        title="There was an error creating the customization."
        status="critical"
      >
        <ul>
          {actionData?.errors.map((error, index) => {
            return <li key={`${index}`}>{error.message}</li>;
          })}
        </ul>
      </Banner>
    </Layout.Section>
  ) : null;

  const handleSubmit = () => {
    submit({ orderArr, reversed: reversed.toString() }, { method: "post" });
  };

  return (
    <Page
      title="Set custom order of delivery methods"
      backAction={{
        content: "Delivery customizations",
        onAction: () => open('shopify:admin/settings/shipping/customizations', '_top')
      }}
      primaryAction={{
        content: "Save",
        loading: isLoading,
        onAction: handleSubmit,
      }}
    >
      <Layout>
        {errorBanner}
        <Layout.Section>
          <Card>
            <Form method="post">
              <FormLayout>
                <FormLayout.Group>
                  <TextField
                    name="orderArr"
                    type="text"
                    label="Comma seperated list of delivery methods"
                    value={orderArr}
                    onChange={setOrderArr}
                    disabled={isLoading}
                    requiredIndicator
                    autoComplete="on"
                  />
                  <Checkbox
                    id="reversed"
                    name="reversed"
                    label="Put any delivery methods not in the list at the top"
                    checked={reversed}
                    onChange={handleReversedChange}
                    disabled={isLoading}
                  >
                  </Checkbox>
                </FormLayout.Group>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
