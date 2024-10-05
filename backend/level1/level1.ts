import type { PackageData, Carrier, Package } from "../types";

type DeliveryGuidelines = {
  [carrierCode: string]: number;
};

const getDeliveryGuidelines = (packageData: PackageData) =>
  packageData.carriers.reduce(
    (acc: DeliveryGuidelines, carrier: Carrier) => ({
      ...acc,
      [carrier.code]: carrier.delivery_promise,
    }),
    {}
  );

export const getExpectedDeliveries = (packageData: PackageData) => {
  const deliveryGuidelines = getDeliveryGuidelines(packageData);

  const deliveries = packageData.packages.map((pkg: Package) => {
    let expectedDelivery = new Date(pkg.shipping_date);

    expectedDelivery.setDate(
      expectedDelivery.getDate() + deliveryGuidelines[pkg.carrier] + 1
    );

    return {
      package_id: pkg.id,
      expected_delivery: expectedDelivery.toISOString().split("T")[0],
    };
  });

  return { deliveries };
};
