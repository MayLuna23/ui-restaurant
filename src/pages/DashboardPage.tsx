import useDocumentTitle from '@/hooks/useDocumentTitle';
import OrderList from '../components/orders/OrderList';

const DashboardPage = () => {

  useDocumentTitle("Dashboard | Ocean App");
  
  return (
    <div>
      <h2 style={{marginBottom: "32px"}} className="text-2xl font-semibold text-center color-brown-light">Dashboard</h2>
      <OrderList />
    </div>
  );
};

export default DashboardPage;
