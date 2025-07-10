import useDocumentTitle from '@/hooks/useDocumentTitle';
import OrderForm from '../components/orders/OrderForm';


const OrdersPage = () => {

  useDocumentTitle("Orders | Ocean App");
  
  return (
    <div>
      <h2 style={{marginBottom: "32px"}} className="text-2xl font-semibold text-center color-brown-light">Create Order</h2>
      <OrderForm />
    </div>
  );
};

export default OrdersPage;
