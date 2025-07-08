import OrderList from '../components/OrderList';

const DashboardPage = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard de Órdenes 📊</h2>
      <OrderList />
    </div>
  );
};

export default DashboardPage;
