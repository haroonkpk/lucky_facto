export default async function Page({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold text-[#111827]">
            Sorry, something went wrong.
          </h1>

          {/* Error Message */}
          <div className="pt-2">
            {params?.error ? (
              <p className="text-sm text-[#64748B]">
                Code error: <span className="font-mono">{params.error}</span>
              </p>
            ) : (
              <p className="text-sm text-[#64748B]">
                An unspecified error occurred.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}