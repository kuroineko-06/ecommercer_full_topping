const { Schema, model } = require("mongoose");

const cartProductSchema = Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", require: true },
  productName: { type: String, require: true },
  productImage: { type: String, require: true },
  productPrice: { type: Number, require: true },
  quantity: { type: Number, default: 1 },
  selectSize: String,
  selectColour: String,
  reservationExpiry: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 60 * 1000),
  },
  reserved: { type: Boolean, default: true },
});

cartProductSchema.set("toObject", { virtuals: true });
cartProductSchema.set("toJSON", { virtuals: true });

exports.CartProduct = model("CartProduct", cartProductSchema);
