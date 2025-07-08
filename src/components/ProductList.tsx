// src/components/ProductList.tsx

import { Table } from "antd";

interface Product {
  productId: number;
  name: string;
  price: number;
  createdAt: string;
}

const ProductList = ({
  products,
  loading,
  error,
}: {
  products: Product[];
  loading: boolean;
  error: string;
}) => {
  return (
    <>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <main className="h-full overflow-y-auto lg:max-w-5xl m-auto">
        <Table
          className="custom-table"
          rowKey="productId"
          dataSource={products}
          loading={loading}
          pagination={false}
          scroll={{ y: 300 }}
          columns={[
            {
              title: "Name",
              dataIndex: "name",
            },
            {
              title: "Price",
              dataIndex: "price",
              render: (value: number) =>
                `$ ${value.toLocaleString("es-CO", {
                  style: "decimal",
                  minimumFractionDigits: 0,
                })}`,
            },
          ]}
        />
      </main>
    </>
  );
};

export default ProductList;
