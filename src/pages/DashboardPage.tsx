import OrderList from '../components/OrderList';

const DashboardPage = () => {
  return (
    <div>
      <h2 style={{marginBottom: "32px"}} className="text-2xl font-semibold text-center color-brown-light">Dashboard</h2>
      <OrderList />
    </div>
  );
};

export default DashboardPage;
