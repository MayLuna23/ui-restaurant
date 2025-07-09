import OrderForm from '../components/OrderForm';


const OrdersPage = () => {
  return (
    <div>
      <h2 style={{marginBottom: "32px"}} className="text-2xl font-semibold text-center color-brown-light">Create Order</h2>
      <OrderForm />
    </div>
  );
};

export default OrdersPage;
