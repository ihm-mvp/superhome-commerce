"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Session = {
  id: string;
  edition: number;
  phase: number;
  name: string;
  start_date: string | null;
  end_date: string | null;
};

type Area = {
  id: string;
  session_id: string;
  area_name: string;
  category_key: string | null;
};

type Exhibitor = {
  id: string;
  session_id: string;
  area_id: string;
  company_name: string;
  company_name_en: string | null;
  canton_fair_code: string | null;
  booth_type: string | null;
  booth_number: string | null;
  booth_count: number | null;
  source_area_name?: string | null;
};

type DirectoryRecord = Exhibitor & {
  session: Session;
  area: Area;
};

const PAGE_SIZE = 30;

const boothCollator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

function compareBoothNumbers(a: string | null, b: string | null) {
  const boothA = (a ?? "").replace(/\s+/g, "").trim();
  const boothB = (b ?? "").replace(/\s+/g, "").trim();

  // 有展位号的记录排在没有展位号的记录前面。
  if (!boothA && !boothB) return 0;
  if (!boothA) return 1;
  if (!boothB) return -1;

  return boothCollator.compare(boothA, boothB);
}

export default function ExhibitorDirectory() {
  const [records, setRecords] = useState<DirectoryRecord[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState("all");
  const [areaId, setAreaId] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDirectory() {
      setLoading(true);
      setError("");

      const sessionsResult = await supabase
        .from("canton_fair_sessions")
        .select("id, edition, phase, name, start_date, end_date")
        .eq("edition", 140)
        .order("phase", { ascending: true });

      if (sessionsResult.error) {
        if (!cancelled) {
          setError("We couldn't load the fair sessions. Please refresh and try again.");
          setLoading(false);
        }
        return;
      }

      const loadedSessions = (sessionsResult.data ?? []) as Session[];
      const sessionIds = loadedSessions.map((item) => item.id);

      if (sessionIds.length === 0) {
        if (!cancelled) {
          setSessions([]);
          setAreas([]);
          setRecords([]);
          setLoading(false);
        }
        return;
      }

      const [areasResult, exhibitorsResult] = await Promise.all([
        supabase
          .from("canton_fair_areas")
          .select("id, session_id, area_name, category_key")
          .in("session_id", sessionIds)
          .order("area_name", { ascending: true }),
        supabase
          .from("canton_fair_exhibitors")
          .select(
            "id, session_id, area_id, company_name, company_name_en, canton_fair_code, booth_type, booth_number, booth_count, source_area_name",
          )
          .in("session_id", sessionIds)
          .order("company_name_en", { ascending: true }),
      ]);

      if (areasResult.error || exhibitorsResult.error) {
        if (!cancelled) {
          setError("We couldn't load the exhibitor directory. Please refresh and try again.");
          setLoading(false);
        }
        return;
      }

      const loadedAreas = (areasResult.data ?? []) as Area[];
      const loadedExhibitors = (exhibitorsResult.data ?? []) as Exhibitor[];
      const sessionById = new Map(loadedSessions.map((item) => [item.id, item]));
      const areaById = new Map(loadedAreas.map((item) => [item.id, item]));

      const joined: DirectoryRecord[] = loadedExhibitors.flatMap((exhibitor) => {
        const session = sessionById.get(exhibitor.session_id);
        const area = areaById.get(exhibitor.area_id);
        if (!session || !area) return [];
        return [{ ...exhibitor, session, area }];
      });

      if (!cancelled) {
        setSessions(loadedSessions);
        setAreas(loadedAreas);
        setRecords(joined);
        setLoading(false);
      }
    }

    void loadDirectory();
    return () => {
      cancelled = true;
    };
  }, []);

  const availableAreas = useMemo(() => {
    const matching = phase === "all"
      ? areas
      : areas.filter((area) => records.some((record) => record.area_id === area.id && String(record.session.phase) === phase));
    return matching.sort((a, b) => a.area_name.localeCompare(b.area_name));
  }, [areas, phase, records]);

const filtered = useMemo(() => {
  const needle = query.trim().toLocaleLowerCase();

  return records
    .filter((record) => {
      if (phase !== "all" && String(record.session.phase) !== phase) return false;
      if (areaId !== "all" && record.area_id !== areaId) return false;
      if (!needle) return true;
      return [
        record.company_name_en,
        record.company_name,
        record.canton_fair_code,
        record.booth_number,
        record.area.area_name,
      ].some((value) => value?.toLocaleLowerCase().includes(needle));
    })
    .sort((a, b) => compareBoothNumbers(
      a.booth_number,
      b.booth_number,
    ));
}, [records, query, phase, areaId]);

  useEffect(() => setPage(1), [query, phase, areaId]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleRecords = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function formatBoothNumber(value: string | null) {
    if (!value) return "Not listed";
    // Separate the hall number (e.g. 9.3) from the booth identifier (e.g. A01-02).
    return value.replace(/^(\d+\.\d+)([A-Za-z].*)$/, "$1 $2");
  }

  const chineseAreaNames: Record<string, string> = {
    household_electrical_appliances: "家用电器",
    electronic_electrical_products: "电子及电气产品",
    new_energy_resources: "新能源",
    hardware: "五金",
    processing_machinery_equipment: "加工机械设备",
    general_machinery_mechanical_basic_parts: "通用机械及机械基础件",
    construction_machinery: "工程机械",
    new_energy_vehicles_smart_mobility: "新能源汽车及智慧出行",
    bicycles: "自行车",
    vehicles: "车辆",
    consumer_electronics_information_products: "电子消费品及信息产品",
    lighting_equipment: "照明产品",
    new_materials_chemical_products: "新材料及化工产品",
    tools: "工具",
    power_machinery_electric_power: "动力、电力设备",
    industrial_automation_intelligent_manufacturing: "工业自动化及智能制造",
    agricultural_machinery: "农业机械",
    motorcycles: "摩托车",
    vehicle_spare_parts: "汽车配件",
    building_decorative_materials: "建筑及装饰材料",
    furniture: "家具",
    general_ceramics: "日用陶瓷",
    clocks_watches_optical_instruments: "钟表眼镜",
    festival_products: "节日用品",
    art_ceramics: "工艺陶瓷",
    gardening_products: "园林用品",
    household_items: "家居用品",
    sanitary_bathroom_equipment: "卫浴设备",
    kitchenware_tableware: "餐厨用具",
    gifts_premiums: "礼品及赠品",
    home_decorations: "家居装饰品",
    glass_artware: "玻璃工艺品",
    weaving_rattan_iron_products: "编织及藤铁工艺品",
    personal_care_products: "个人护理用具",
    medicines_health_products_medical_devices: "医药保健品及医疗器械",
    children_baby_maternity_products: "孕婴童用品",
    kids_wear: "童装",
    sports_casual_wear: "运动及休闲服",
    furs_leather_downs_related_products: "裘革皮羽绒及制品",
    home_textiles: "家用纺织品",
    carpets_tapestries: "地毯及挂毯",
    office_supplies: "办公文具",
    sports_travel_recreation_products: "体育及旅游休闲用品",
    traditional_chinese_specialties: "乡村振兴特色产品",
    toiletries: "浴室用品",
    pet_products_food: "宠物用品",
    toys: "玩具",
    men_women_clothing: "男女装",
    underwear: "内衣",
    fashion_accessories_fittings: "服装饰物及配件",
    textile_raw_materials_fabrics: "纺织原料面料",
    shoes: "鞋",
    cases_bags: "箱包",
    food: "食品",
  };

  function changePhase(value: string) {
    setPhase(value);
    setAreaId("all");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        <header className="mb-7 border-b border-slate-200 pb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Shunde · Canton Fair · October 2026
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Shunde Exhibitor Directory</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Find exhibitors and booth locations by company name, product section, or booth number.
          </p>
        </header>

        <section aria-label="Search and filters" className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <label htmlFor="exhibitor-search" className="mb-2 block text-sm font-semibold text-slate-800">
            Search exhibitors
          </label>
          <div className="relative">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">
              <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
              <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              id="exhibitor-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Company, Canton Fair code, or booth number"
              className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-base outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FilterSelect label="Phase" value={phase} onChange={changePhase}>
              <option value="all">All phases</option>
              {sessions.map((session) => (
                <option key={session.id} value={String(session.phase)}>Phase {session.phase}</option>
              ))}
            </FilterSelect>
            <FilterSelect label="Exhibition section" value={areaId} onChange={setAreaId}>
              <option value="all">All sections</option>
              {availableAreas.map((area) => (
                <option key={area.id} value={area.id}>{area.area_name}</option>
              ))}
            </FilterSelect>

          </div>
        </section>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-600">
            {loading ? "Loading exhibitors…" : `${filtered.length} exhibitor records found`}
          </p>
          {(query || phase !== "all" || areaId !== "all") && (
            <button
              type="button"
              onClick={() => { setQuery(""); setPhase("all"); setAreaId("all");}}
              className="min-h-10 rounded-lg px-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              Clear filters
            </button>
          )}
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {!error && !loading && visibleRecords.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <h2 className="text-lg font-semibold">No exhibitors found</h2>
            <p className="mt-2 text-sm text-slate-600">Try another company name, code, or filter.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {visibleRecords.map((record) => (
            <article key={record.id} className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Phase {record.session.phase}</span>
                <span aria-hidden="true">·</span>
                <span className="normal-case tracking-normal">{record.area.area_name}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {chineseAreaNames[record.area.category_key ?? ""] || record.source_area_name || ""}
              </p>
              <h2 className="mt-2 break-words text-lg font-bold leading-6 text-slate-900">
                {record.company_name_en?.trim() || record.company_name}
              </h2>
              <p className="mt-1 break-words text-sm text-slate-500">{record.company_name}</p>
              <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">Booth number</p>
                <p className="mt-1 break-words text-xl font-bold tracking-tight text-emerald-950">
                  {formatBoothNumber(record.booth_number)}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                {record.canton_fair_code && <span>Code: <strong className="font-semibold text-slate-800">{record.canton_fair_code}</strong></span>}
                {record.booth_type && <span>{record.booth_type}</span>}
              </div>
            </article>
          ))}
        </div>

        {!error && !loading && filtered.length > PAGE_SIZE && (
          <nav aria-label="Directory pages" className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >Previous</button>
            <span className="text-sm tabular-nums text-slate-600">Page {page} of {pageCount}</span>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >Next</button>
          </nav>
        )}

        <footer className="mt-10 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">
          Directory based on Shunde exhibitor booth-arrangement data for the 140th Canton Fair, October 2026. Booth details may change; please confirm on site.
        </footer>
      </div>
    </main>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  const id = `filter-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
      >
        {children}
      </select>
    </div>
  );
}
