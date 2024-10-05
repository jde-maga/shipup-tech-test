import { Carrier, Package, PackageData } from "../types";

type DeliveryGuidelines = {
  [carrierCode: string]: DeliveryGuidelinesCarrier;
};

type DeliveryGuidelinesCarrier = {
  deliveryPromise: number;
  saturdayDeliveries?: boolean;
};

const isWorkingDay = (carrier: DeliveryGuidelinesCarrier, date: Date) => {
  const day = date.getDay();

  return !(day === 0 || (day === 6 && !carrier.saturdayDeliveries));
};

const getDeliveryGuidelines = (packageData: PackageData) =>
  packageData.carriers.reduce((acc: DeliveryGuidelines, carrier: Carrier) => {
    if (typeof carrier.saturday_deliveries === undefined) {
      throw `Error : No Saturday deliveries set for the carrier ${carrier.code}`;
    }

    return {
      ...acc,
      [carrier.code]: {
        deliveryPromise: carrier.delivery_promise,
        saturdayDeliveries: carrier.saturday_deliveries,
      },
    };
  }, {});

export const getExpectedDeliveries = (packageData: PackageData) => {
  const deliveryGuidelines = getDeliveryGuidelines(packageData);

  const deliveries = packageData.packages.map((pkg: Package) => {
    let shippingDate = new Date(pkg.shipping_date);

    for (
      let i = deliveryGuidelines[pkg.carrier].deliveryPromise + 1;
      i != 0;

    ) {
      shippingDate.setDate(shippingDate.getDate() + 1);
      if (isWorkingDay(deliveryGuidelines[pkg.carrier], shippingDate)) {
        --i;
      }
    }

    return {
      package_id: pkg.id,
      expected_delivery: shippingDate.toISOString().split("T")[0],
    };
  });

  return { deliveries };
};
