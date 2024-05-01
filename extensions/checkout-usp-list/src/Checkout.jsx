import React from "react";
import {
  reactExtension,
  Icon,
  List,
  ListItem,
  useSettings,
} from "@shopify/ui-extensions-react/checkout";

const checkoutBlock = reactExtension("purchase.checkout.block.render", () => <App />);
export { checkoutBlock };

function App() {
  const {
    text,
    text2,
    text3
  } = useSettings();

  return (
    <>
      <List>
        {text ?? <ListItem>USP12</ListItem>}
        {text2 ?? <ListItem>USP2</ListItem>}
        {text3 ?? <ListItem>USP3</ListItem>}
      </List>
    </>
  );
}
