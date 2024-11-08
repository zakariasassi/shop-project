import './invoice.css'
const Invoice = React.forwardRef(({ orders }, ref) => (
    <div ref={ref} className="p-8 bg-white">
      {orders?.map((order) => (
        <div key={order.id} className="p-4 mb-4 border">
          <h2 className="text-xl font-bold">Invoice for Order #{order.id}</h2>
          <p>Customer: {order.Customer.fullName}</p>
          <p>Phone: {order.Customer.phone}</p>
          <p>Email: {order.Customer.email}</p>
          <p>Total Amount: ${order.totalAmount}</p>
          <p>Status: {order.status}</p>
          <p>Order Date: {moment(order.createdAt).format('YYYY-MM-DD')}</p>
          <p>Last Update: {moment(order.updatedAt).format('YYYY-MM-DD')}</p>
  
          <h3 className="mt-4 text-lg font-bold">Order Items</h3>
          <ul>
            {order.OrderItems.map((item) => (
              <li key={item.id} className="py-2 border-b">
                <img src={URL + item.Product.images.split(',')[0]} alt={item.Product.TradeName} className="w-16 h-16" />
                <p>Product: {item.Product.TradeName}</p>
                <p>Scientific Name: {item.Product.ScientificName}</p>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Package Type: {item.Product.PackageType}</p>
                <p>Size: {item.Product.Size}</p>
                <p>Description: {item.Product.shortDescription}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  ));


   export default Invoice;