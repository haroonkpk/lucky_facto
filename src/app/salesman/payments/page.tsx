import { getShops } from "@/actions/salesman.actions";
import { getFilteredActivities } from "@/actions/salesmanDashboard.actions";
import { PaymentForm } from "@/components/salesman";
import { ActivityDataTable } from "@/components/shared";
import { DateRangeFilter } from "@/components/owner/dashboard/filters";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const startDate = params.startDate
    ? new Date(params.startDate as string)
    : undefined;
  const endDate = params.endDate
    ? new Date(params.endDate as string)
    : undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [shops, activityData] = await Promise.all([
    getShops(),
    getFilteredActivities({
      userId: user.id,
      type: "payment",
      startDate,
      endDate,
      page,
      pageSize: 10,
    }),
  ]);

  return (
    <div className="min-h-screen bg-(--color-page-bg) sm:p-[clamp(1rem,3vw,2.5rem)] pb-24 relative">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-[#64748B] text-xs font-bold tracking-widest uppercase mb-1">
          Financial Management
        </p>
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">
          Payments & Collections
        </h1>
        <p className="text-gray-500 text-[clamp(14px,1vw,16px)]">
          Record collections from shops or log factory payments to maintain an
          accurate cash flow ledger.
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col-reverse xl:flex-row gap-8 items-start">
        {/* ── RIGHT: History Section ── */}
        <div className="flex-1 w-full lg:min-w-2xl">
          <div className="bg-[#E5F0F6] rounded-[clamp(12px,2vw,20px)] p-[clamp(12px,2vw,24px)] flex flex-col gap-6">
            <div className="flex flex-col justify-between items-start gap-4 px-1">
              <div>
                <h2 className="text-[#053B70] font-bold text-xl">
                  Recent Payments
                </h2>
                <p className="text-[#64748B] text-sm font-medium mt-0.5">
                  History of collections recorded by you
                </p>
              </div>
              <div className="w-full flex justify-end ">
                <DateRangeFilter />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <ActivityDataTable
                activities={activityData.activities}
                currentPage={activityData.currentPage}
                totalPages={activityData.totalPages}
                title="Payment Logs"
                headers={[
                  { key: "date", label: "Date" },
                  { key: "subtitle", label: "Target/Shop" },
                  { key: "title", label: "Type/Activity" },
                  { key: "amount", label: "Amount" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* ── LEFT: Payment Form ── */}
        <div className="w-full xl:w-fit">
          <PaymentForm shops={shops} />
        </div>
      </div>
    </div>
  );
}
