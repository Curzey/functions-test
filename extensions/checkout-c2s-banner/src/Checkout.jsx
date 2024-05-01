import {
  Banner,
  reactExtension,
  useCartLines,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const lineItemsWithC2s = useCartLines()
    .map(item => item.attributes.find(attr => attr.key === 'c2s'))
    .filter(Boolean);

  if (!lineItemsWithC2s.length) return;

  return (
    <Banner title="Create 2 Stay">
      Én af produkterne i din kurv er en Create2Stay vare.
    </Banner>
  );
}
