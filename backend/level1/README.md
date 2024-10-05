# Intro

We're trying to model the expected delivery date for online orders shipped through various shipping carriers.

# Level 1

Each shipping carrier has specific delivery promises (in days).
The online retailers assigns a shipping date and a carrier to each order.

We first want to compute a list of expected delivery dates for some packages.

# Solution

We're assuming that the input data always contains packages, and that those packages always have a carrier defined alongside them.

The goal is to iterate through each of the packages on our input and return an array of objects containing his ID on the `package_id` key and the expected delivery on the `expected_delivery` key.

While the ID stays the same, we can see for the `expected_delivery` key that it expects a date following this pattern : _shipping_date_ + _`delivery_promise` days of the carriers matching the `code` + 1 day_
