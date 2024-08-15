const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { Product } = require("../models/product");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const orderController = require("./order");
const emailSender = require("../helpers/email_sender");
const mailBuilder = require("../helpers/order_complete_email_builder");

exports.checkout = async function (req, res) {
  const accessToken = req.header("Authorization").replace("Bearer", "").trim();
  const tokenData = jwt.decode(accessToken);

  const user = await User.findById(tokenData.id);
  if (!user) {
    return res.status(401).json({ message: "User not found!" });
  }
  for (const cartItem of req.body.cartItems) {
    const product = await Product.findById(cartItem.product);
    if (!product) {
      return res.status(404).json({ message: `${cartItem.name} not found!` });
    } else if (cartItem.reserved && product.countInStock < cartItem.quantity) {
      return res.status(404).json({
        message: `${product.name}\nOrder for ${cartItem.quantity}, but ${product.countInStock} left in stock`,
      });
    }
  }

  let customerId;

  if (user.paymentCustomerId) {
    customerId = user.paymentCustomerId;
  } else {
    const customer = await stripe.customers.create({
      metadata: { userId: tokenData.id },
    });
    customerId = customer.id;
  }
  const session = await stripe.checkout.create({
    line_items: req.body.cartItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          productData: {
            name: item.name,
            image: item.images,
            metadata: {
              productId: item.productId,
              cartProductId: item.cartProductId,
              selectedSize: item.selectedSize ?? undefined,
              selectedColour: item.selectedColour ?? undefined,
            },
          },
          unit_amount: (item.price * 100).toFixed(0),
        },
        quantity: item.quantity,
      };
    }),
    payment_method_options: {
      card: { setup_future_usage: "on_session" },
    },
    billing_address_colection: "auto",
    shipping_address_collection: {
      allow_countries: [
        "AD",
        "AE",
        "AF",
        "AG",
        "AI",
        "AL",
        "AM",
        "AO",
        "AQ",
        "AR",
        "AS",
        "AT",
        "AU",
        "AW",
        "AX",
        "AZ",
        "BA",
        "BB",
        "BD",
        "BE",
        "BF",
        "BG",
        "BH",
        "BI",
        "BJ",
        "BL",
        "BM",
        "BN",
        "BO",
        "BQ",
        "BR",
        "BS",
        "BT",
        "BV",
        "BW",
        "BY",
        "BZ",
        "CA",
        "CC",
        "CD",
        "CF",
        "CG",
        "CH",
        "CI",
        "CK",
        "CL",
        "CM",
        "CN",
        "CO",
        "CR",
        "CU",
        "CV",
        "CW",
        "CX",
        "CY",
        "CZ",
        "DE",
        "DJ",
        "DK",
        "DM",
        "DO",
        "DZ",
        "EC",
        "EE",
        "EG",
        "EH",
        "ER",
        "ES",
        "ET",
        "FI",
        "FJ",
        "FK",
        "FM",
        "FO",
        "FR",
        "GA",
        "GB",
        "GD",
        "GE",
        "GF",
        "GG",
        "GH",
        "GI",
        "GL",
        "GM",
        "GN",
        "GP",
        "GQ",
        "GR",
        "GS",
        "GT",
        "GU",
        "GW",
        "GY",
        "HK",
        "HM",
        "HN",
        "HR",
        "HT",
        "HU",
        "ID",
        "IE",
        "IL",
        "IM",
        "IN",
        "IO",
        "IQ",
        "IR",
        "IS",
        "IT",
        "JE",
        "JM",
        "JO",
        "JP",
        "KE",
        "KG",
        "KH",
        "KI",
        "KM",
        "KN",
        "KP",
        "KR",
        "KW",
        "KY",
        "KZ",
        "LA",
        "LB",
        "LC",
        "LI",
        "LK",
        "LR",
        "LS",
        "LT",
        "LU",
        "LV",
        "LY",
        "MA",
        "MC",
        "MD",
        "ME",
        "MF",
        "MG",
        "MH",
        "MK",
        "ML",
        "MM",
        "MN",
        "MO",
        "MP",
        "MQ",
        "MR",
        "MS",
        "MT",
        "MU",
        "MV",
        "MW",
        "MX",
        "MY",
        "MZ",
        "NA",
        "NC",
        "NE",
        "NF",
        "NG",
        "NI",
        "NL",
        "NO",
        "NP",
        "NR",
        "NU",
        "NZ",
        "OM",
        "PA",
        "PE",
        "PF",
        "PG",
        "PH",
        "PK",
        "PL",
        "PM",
        "PN",
        "PR",
        "PS",
        "PT",
        "PW",
        "PY",
        "QA",
        "RE",
        "RO",
        "RS",
        "RU",
        "RW",
        "SA",
        "SB",
        "SC",
        "SD",
        "SE",
        "SG",
        "SH",
        "SI",
        "SJ",
        "SK",
        "SL",
        "SM",
        "SN",
        "SO",
        "SR",
        "SS",
        "ST",
        "SV",
        "SX",
        "SY",
        "SZ",
        "TC",
        "TD",
        "TF",
        "TG",
        "TH",
        "TJ",
        "TK",
        "TL",
        "TM",
        "TN",
        "TO",
        "TR",
        "TT",
        "TV",
        "TW",
        "TZ",
        "UA",
        "UG",
        "UM",
        "US",
        "UY",
        "UZ",
        "VA",
        "VC",
        "VE",
        "VG",
        "VI",
        "VN",
        "VU",
        "WF",
        "WS",
        "YE",
        "YT",
        "ZA",
        "ZM",
        "ZW",
      ],
    },
    phone_number_collection: { enabled: true },
    customer: customerId,
    mode: "payment",
    success_url: "",
    cancel_url: "",
  });
  res.status(201).json({ url: session.url });
};

exports.webhook = function (req, res) {
  const sig = request.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook error:", err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "checkout.session.complete") {
    const session = event.data.object;
    stripe.customers
      .retrieve(session.customer)
      .then(async (customer) => {
        const line_items = await stripe.checkout.session.listLineItems(
          session.id,
          { expand: ["data.price.product"] }
        );
        const orderItems = lineItems.data.map((item) => {
          return {
            quantity: item.quantity,
            product: item.price.product.metadata.productId,
            cartProductId: item.price.product.metadata.cartProductId,
            productPrice: item.price.unit_amount / 100,
            productName: item.price.product.name,
            productImage: item.price.product.images[0],
            selectedSize: item.price.product.metadata.selectedSize ?? undefined,
            selectedColour:
              item.price.product.metadata.selectedColour ?? undefined,
          };
        });
        const address =
          session.shipping_details?.address ?? session.customer_details.address;
        const order = await orderController.addOrder({
          orderItems: orderItems,
          shippingAddress:
            address.line1 === "N/A" ? address.line2 : address.line1,
          city: address.city,
          postalCode: address.postal_code,
          country: address.country,
          phone: session.customer_details.phone,
          totalPrice: session.amount_total / 100,
          user: customer.metadata.userId,
          paymentId: session.payment_intent,
        });

        let user = await User.findById(customer.metadata.userId);
        if (user && !user.paymentCustomerId) {
          user = await User.findByIdAndUpdate(
            customer.metadata.userId,
            { paymentCustomerId: session.customer },
            { new: true }
          );
        }

        const leanOrder = order.toObject();
        leanOrder["orderItems"] = orderItems;
        await emailSender.sendMail(
          session.customer_details.email ?? user.email,
          "Your Ecomly Order",
          mailBuilder.buildEmail(
            user.name,
            leanOrder,
            session.customer_details.name
          )
        );
      })
      .catch((error) =>
        console.error("WEBHOOK ERROR CATCHER: ", error.message)
      );
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  res.send().end();
};
