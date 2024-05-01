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
    text, icon,
    text2, icon2,
    text3, icon3,
  } = useSettings();

  return (
    <List marker="none">
      {text ??
        <ListItem>
          <Icon source={icon} />
          {text}
        </ListItem>
      }

      {text2 ??
        <ListItem>
          <Icon source={icon2} />
          {text2}
        </ListItem>
      }

      {text3 ??
        <ListItem>
          <Icon source={icon3} />
          {text3}
        </ListItem>
      }
    </List>
  );
}
