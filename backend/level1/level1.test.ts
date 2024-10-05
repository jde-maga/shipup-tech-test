import input from "./data/input.json";
import expectedOutput from "./data/expected_output.json";

import { getExpectedDeliveries } from "./level1";

describe("Level 1", () => {
  it("should be working with the default input and expect output", () => {
    expect(getExpectedDeliveries(input)).toStrictEqual(expectedOutput);
  });

  it("should be bubbling dates properly", () => {
    const bubblingInput = {
      carriers: [{ code: "colissimo", delivery_promise: 3 }],
      packages: [{ id: 1, carrier: "colissimo", shipping_date: "2018-12-31" }],
    };

    expect(getExpectedDeliveries(bubblingInput)).toStrictEqual({
      deliveries: [
        {
          package_id: 1,
          expected_delivery: "2019-01-04",
        },
      ],
    });
  });
});
