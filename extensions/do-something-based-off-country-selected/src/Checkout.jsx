import {
  Checkbox,
  reactExtension,
  useShippingAddress,
  useExtensionCapability,
  useBuyerJourneyIntercept,
} from '@shopify/ui-extensions-react/checkout';

import { useEffect, useState } from 'react';

export default reactExtension(
  'purchase.checkout.actions.render-before',
  () => <Extension />,
);

function Extension() {
  const EU_COUNTRIES = [
    'AT',
    'BE',
    'BG',
    'HR',
    'CY',
    'CZ',
    'DK',
    'EE',
    'FI',
    'FR',
    'DE',
    'GR',
    'HU',
    'IE',
    'IT',
    'LV',
    'LT',
    'LU',
    'MT',
    'NL',
    'PL',
    'PT',
    'RO',
    'SK',
    'SI',
    'ES',
    'SE',
    'GB',
  ];

  const country = useShippingAddress().countryCode;
  const canBlockProgress = useExtensionCapability("block_progress");

  const [checkboxAccepted, setCheckboxAccepted] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    console.log({checkboxAccepted, canBlockProgress, country})
  });

  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    if (canBlockProgress && !checkboxAccepted) {
      return {
        behavior: "block",
        reason: "Acceptance is required",
        perform: (result) => {
          if (result.behavior === "block") {
            setValidationError("Accept me please");
          }
        },
      };
    }

    return {
      behavior: "allow",
      perform: () => {
        setValidationError("");
      },
    };
  });

  const checkboxOnChange = (isAccepted) => {
    setCheckboxAccepted(isAccepted);

    if (isAccepted) {
      setValidationError("");
    }
  }

  return (
    <>
      {!EU_COUNTRIES.includes(country) && (
        <Checkbox
          id="accept_outside_eu"
          name="accept_outside_eu"
          onChange={(checked) => checkboxOnChange(checked)}
          required={canBlockProgress}
          error={validationError}
          value={checkboxAccepted}
        >
          Jeg accepterer at jeg handler udenfor EU. Jeg vil gerne have min vare sendt til {country}. Dette bør i øvrigt være en translation :))
        </Checkbox>
      )}
    </>
  )
}
