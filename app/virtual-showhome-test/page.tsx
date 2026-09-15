export default function VirtualShowhomeTestPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              MoveInReady
            </h1>
            <p className="text-xs text-gray-500">
              Virtual Showhome Test
            </p >
          </div>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            TEST
          </span>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
            MIR Virtual Showhome
          </p >

          <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
            Virtual Showhome Test
          </h2>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            This is a technical test of embedding a KuJiaLe virtual showhome
            directly into the MoveInReady platform.
          </p >
        </div>

        {/* KuJiaLe Embed */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm">
          <div className="relative w-full" style={{ height: "75vh", minHeight: "600px" }}>
            <iframe
              src="https://yun.kujiale.com/design/3FO3C2HKP9UY/show?hasloding=false&hasui=false"
              title="MIR Virtual Showhome - KuJiaLe"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </div>
        </div>

        {/* Test Information */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Embed Test Information
          </h3>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex flex-col gap-1 sm:flex-row">
              <dt className="font-medium text-gray-700 sm:w-40">
                Platform
              </dt>
              <dd className="text-gray-600">
                KuJiaLe
              </dd>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row">
              <dt className="font-medium text-gray-700 sm:w-40">
                Integration
              </dt>
              <dd className="text-gray-600">
                iframe Embed
              </dd>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row">
              <dt className="font-medium text-gray-700 sm:w-40">
                MIR Integration
              </dt>
              <dd className="text-gray-600">
                Front-end only — no API or database integration
              </dd>
            </div>

            <div className="flex flex-col gap-1 sm:flex-row">
              <dt className="font-medium text-gray-700 sm:w-40">
                Source
              </dt>
              <dd className="break-all text-gray-600">
                https://yun.kujiale.com/design/3FO3C2HKP9UY/show?hasloding=false&hasui=false
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}