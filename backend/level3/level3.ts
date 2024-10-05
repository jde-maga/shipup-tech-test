import { PackageData, Carrier, Package, CountryDistance } from "../types";

type DeliveryGuidelines = {
  [carrierCode: string]: DeliveryGuidelinesCarrier;
};

type DeliveryGuidelinesCarrier = {
  deliveryPromise: number;
  saturdayDeliveries?: boolean;
  overseaDelayThreshold?: number;
};

const getDeliveryGuidelines = (packageData: PackageData) =>
  packageData.carriers.reduce(
    (acc: DeliveryGuidelines, carrier: Carrier) => ({
      ...acc,
      [carrier.code]: {
        deliveryPromise: carrier.delivery_promise,
        saturdayDeliveries: carrier.saturday_deliveries,
        overseaDelayThreshold: carrier.oversea_delay_threshold,
      },
    }),
    {}
  );

const isWorkingDay = (carrier: DeliveryGuidelinesCarrier, date: Date) => {
  const day = date.getDay();

  return !(day === 0 || (day === 6 && !carrier.saturdayDeliveries));
};

const getOverseaDelay = (
  pkg: Package,
  carrier: DeliveryGuidelinesCarrier,
  countryDistances: CountryDistance
) => {
  if (!pkg.origin_country || !pkg.destination_country) {
    throw "Error, no origin or dest country";
  }
  if (!carrier.overseaDelayThreshold) {
    throw "Error, no oversea threshold";
  }

  const getDistance =
    countryDistances[pkg.origin_country][pkg.destination_country];

  return Math.floor(getDistance / carrier.overseaDelayThreshold);
};

export const getExpectedDeliveries = (packageData: PackageData) => {
  const deliveryGuidelines = getDeliveryGuidelines(packageData);

  const deliveries = packageData.packages.map((pkg: Package) => {
    if (!packageData.country_distance) {
      throw "Error, no country distance";
    }

    let shippingDate = new Date(pkg.shipping_date);

    const overseaDelay = getOverseaDelay(
      pkg,
      deliveryGuidelines[pkg.carrier],
      packageData.country_distance
    );

    for (
      let i =
        deliveryGuidelines[pkg.carrier].deliveryPromise + 1 + overseaDelay;
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
      oversea_delay: overseaDelay,
    };
  });

  return { deliveries };
};
