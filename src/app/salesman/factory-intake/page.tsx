import { getBrands } from "@/actions/salesman.actions";
import FactoryIntakeForm from "@/components/salesman/factory-intake-form";

export default async function FactoryIntakePage() {
  const brands = await getBrands();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-3 lg:p-10 md:pl-20!">
      <div className="mb-8">
        <p className="text-[#64748B] text-xs font-bold tracking-widest uppercase mb-1">
          Inventory Control
        </p>
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">
          Factory Intake
        </h1>
        <p className="text-gray-500 text-[clamp(14px,1vw,16px)]">
          Record incoming stock from the production facility to update central inventory levels.
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[450px] shrink-0">
          <FactoryIntakeForm brands={brands} />
        </div>
      </div>
    </div>
  );
}
