export function run(input) {
  const OPERATIONS = {
    operations: [],
  };

  const configuration = JSON.parse(
    input?.deliveryCustomization?.metafield?.value ?? '{}'
  );

  const customArr = configuration.orderArr.split(',');
  const isReversed = !!configuration.reversed;

  if (!configuration.orderArr) {
    return OPERATIONS;
  }

  const deliveryOptions = input.cart.deliveryGroups.flatMap((group) => {
    return group.deliveryOptions;
  });

  deliveryOptions.sort((a, b) => {
    const indexA = customArr.indexOf(a.title);
    const indexB = customArr.indexOf(b.title);

    if (indexA === -1 && indexB === -1) {
      return 0;
    }

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) {
      return isReversed ? 1 : -1;
    }

    if (indexB !== -1) {
      return isReversed ? -1 : 1;
    }
  });

  deliveryOptions.forEach((deliveryOption, index) => {
    OPERATIONS.operations.push({
      move: {
        deliveryOptionHandle: deliveryOption.handle,
        index,
      },
    });
  });

  return OPERATIONS;
};
