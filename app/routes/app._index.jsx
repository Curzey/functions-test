import { useEffect, useState } from "react";
import { useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Thumbnail,
  SkeletonDisplayText,
  SkeletonThumbnail,
} from "@shopify/polaris";
import {
  WalletIcon,
  DeliveryIcon,
  CartIcon,
  DiscountIcon,
} from "@shopify/polaris-icons";

export default function Index() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  const items = [
    {
      "title": "Payments",
      "id": "payments",
      "description": "Manage your payment settings.",
      "icon": WalletIcon,
      "iconColor": "black",
      "color": "#eaf4ff",
      "url": "shopify:admin/settings/payments/customizations"
    },
    {
      "title": "Checkout editor",
      "id": "checkout-editor",
      "description": "Customize the look and feel of your checkout.",
      "icon": CartIcon,
      "iconColor": "#fff",
      "color": "#303030",
      "url": "shopify:admin/settings/checkout/editor"
    }
  ]

  useEffect(() => {
    if (navigation.state === "idle") {
      setIsLoading(false);
    }
  }, [navigation.state]);

  function LoadingState({ children }) {
    return (
      <Layout>
        <Layout.Section variant="fullWidth">
          <Card padding="800">
            <SkeletonDisplayText size="medium" />
          </Card>
        </Layout.Section>

        {items.map((_, index) => {
          return (
            <Layout.AnnotatedSection
              id="storeDetails"
              title="Store details"
              description="Shopify and your customers will use this information to contact you."
              key={index}
            >
              <Card padding="600">
                <BlockStack gap="400">
                  <SkeletonThumbnail size="large" />
                  <SkeletonDisplayText size="medium" />
                  <Button loading fullWidth></Button>
                </BlockStack>
              </Card>
            </Layout.AnnotatedSection>
          );
        })};
      </Layout>
    );
  }

  function PageMarkup() {
    return (
      <Layout>
        <Layout.Section variant="fullWidth">
          <Card padding="800" background="bg-fill-brand">
            <BlockStack gap="500">
              <Text as="h1" variant="headingXl" tone="text-inverse">
                Checkout customizations
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>

        {items.map((item, index) => {
          return (
            <Layout.AnnotatedSection
              id={item.id}
              title={item.title}
              description={item.description}
              key={index}
            >
              <Card padding="600" sectioned>
                <BlockStack gap="400">
                  <div
                    style={
                      {
                        "--p-color-icon-secondary": item.iconColor,
                        "--p-color-bg-surface": item.color,
                      }
                    }
                  >
                    <Thumbnail source={item.icon} size="large" alt={item.title} />
                  </div>

                  <Text as="strong" variant="headingMd">
                    {item.title}
                  </Text>

                  <Button
                    size="large"
                    fullWidth={true}
                    url={item.url}
                    variant="primary"
                  >
                    Customize
                  </Button>
                </BlockStack>
              </Card>
            </Layout.AnnotatedSection>
          )
        })}
      </Layout>
    )
  }

  return (
    <Page fullWidth>
      <ui-title-bar title="Skechers Functions"></ui-title-bar>
      {isLoading ? <LoadingState /> : <PageMarkup />}
    </Page>
  );
}
