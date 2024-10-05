import input from "./data/input.json";
import expectedOutput from "./data/expected_output.json";

import { getExpectedDeliveries } from "./level3";

describe("Level 3", () => {
  it("should be working with the default input and expect output", () => {
    expect(getExpectedDeliveries(input)).toStrictEqual(expectedOutput);
  });

  it("should be bubbling dates properly", () => {
    const bubblingInput = {
      carriers: [
        {
          code: "colissimo",
          delivery_promise: 3,
          saturday_deliveries: false,
          oversea_delay_threshold: 3000,
        },
      ],
      packages: [
        {
          id: 1,
          carrier: "colissimo",
          shipping_date: "2018-12-31",
          origin_country: "FR",
          destination_country: "JP",
        },
      ],
      country_distance: {
        FR: { US: 6000, DK: 1000, JP: 9500 },
        US: { FR: 6000, DK: 5500, JP: 11000 },
        DK: { US: 5500, FR: 1000, JP: 8500 },
        JP: { US: 11000, DK: 8500, FR: 9500 },
      },
    };

    expect(getExpectedDeliveries(bubblingInput)).toStrictEqual({
      deliveries: [
        {
          package_id: 1,
          expected_delivery: "2019-01-09",
          oversea_delay: 3,
        },
      ],
    });
  });
});
