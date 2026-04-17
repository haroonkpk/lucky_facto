import { getShops } from "@/actions/salesman.actions";
import PaymentForm from "@/components/salesman/payment-form";

export default async function PaymentsPage() {
  const shops = await getShops();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-3 lg:p-10">
      <div className="mb-8">
        <p className="text-[#64748B] text-xs font-bold tracking-widest uppercase mb-1">
          Financial Management
        </p>
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">
          Payments & Collections
        </h1>
        <p className="text-gray-500 text-[clamp(14px,1vw,16px)]">
          Record collections from shops or log factory payments to maintain an accurate cash flow ledger.
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[500px] shrink-0">
          <PaymentForm shops={shops} />
        </div>
      </div>
    </div>
  );
}
