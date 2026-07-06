import { load } from "cheerio/slim";

export interface TradeMeListing {
  listingId: number;
  title: string;
  address: string;
  price?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  landArea?: number;
  floorArea?: number;
  propertyType?: string;
  agency?: string;
  office?: string;
  agent?: string;
  photos: string[];
  openHomes: any[];
  raw: any;
}

export function importTrademe(html: string): TradeMeListing {

  // MIR统一模式：仅定位script，不解析DOM
  const $ = load(html);

  const jsonText =
    $("#frend-state").html() ??
    (() => {
      throw new Error("frend-state not found");
    })();

  const state = JSON.parse(jsonText);

  const cached =
    state.NGRX_STATE
      ?.listing
      ?.cachedDetails;

  if (!cached)
    throw new Error("cachedDetails missing");

  const id = String(cached.ids[0]);

  const item =
    cached.entities[id]?.item;

  if (!item)
    throw new Error("listing item missing");

  const attrs = item.propertyAttributes ?? [];

  const findNumber = (...names: string[]) => {
    const x = attrs.find((a: any) =>
      names.includes(a.name)
    );
    return x?.value ?? x?.displayValue;
  };

  return {

    listingId: item.listingId,

    title: item.title,

    address:
      item.geographicLocation?.displayAddress ??
      item.title,

    price:
      item.priceDisplay?.displayPrice,

    description:
      item.body,

    latitude:
      item.geographicLocation?.latitude,

    longitude:
      item.geographicLocation?.longitude,

    bedrooms:
      findNumber("Bedrooms"),

    bathrooms:
      findNumber("Bathrooms"),

    parking:
      findNumber("Parking"),

    landArea:
      findNumber("Land area"),

    floorArea:
      findNumber("Floor area"),

    propertyType:
      findNumber("Property type"),

    agency:
      item.agency?.name,

    office:
      item.office?.name,

    agent:
      item.member?.displayName,

    photos:
      (item.photos ?? []).map(
        (p: any) =>
          p.large ??
          p.medium ??
          p.value ??
          p.url
      ),

    openHomes:
      item.openHomes ?? [],

    raw: item
  };
}