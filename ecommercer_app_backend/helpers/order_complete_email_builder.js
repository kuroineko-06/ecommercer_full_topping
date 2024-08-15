exports.buildEmail = (userName, order, shippingDetailsUserName) => {
  const orderTemplates = [];
  for (const orderItem of order.orderItems) {
    orderTemplates.push(
      orderItemTemplate(
        orderItem.productImage,
        orderItem.productName,
        orderItem.productPrice,
        orderItem.quatity,
        orderItem.selectedColour,
        orderItem.selectedSize
      )
    );
  }
  const orderRows = orderTemplates.join(" ");
  return `${orderRows}`;
};

function orderItemTemplate(
  itemImage,
  itemName,
  itemPrice,
  itemQuantity,
  selectedColour,
  selectedSize
) {
  let colorTemplate = "";
  let sizeTemplate = "";
  if (selectedColour) {
    colorTemplate = "";
  }
  if (selectedSize) {
    sizeTemplate = "";
  }
  return `${colorTemplate} ........+ ${sizeTemplate}`;
}
