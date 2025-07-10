import { useIsMobile } from "@/hooks/useIsMobile";
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
  const isMobile = useIsMobile();

  return (
    <>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <main className="lg:w-2/3 m-auto" >
        <Table
          className="custom-table"
          rowKey="productId"
          dataSource={products}
          loading={loading}
          pagination={false}
          scroll={{ y: isMobile ? 300 : 400 }}
          columns={[
            {
              title: "Name",
              dataIndex: "name",
              render: (text: string) =>
                text
                  .split(" ")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" "),
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
