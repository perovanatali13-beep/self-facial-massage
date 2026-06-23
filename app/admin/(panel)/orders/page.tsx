import { getOrders } from "@/lib/orders";
import OrdersManager from "./OrdersManager";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();
  return <OrdersManager initial={orders} />;
}
