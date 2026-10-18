export type Phase = "phase1" | "phase2" | "phase3";

export const PHASES: Record<Phase, { label: string; categories: { value: string; label: string }[] }> = {
  phase1: {
    label: 'Phase 1',
    categories: [
      { value: 'household_electrical_appliances', label: 'Household Electrical Appliances' },
      { value: 'electronic_electrical_products', label: 'Electronic and Electrical Products' },
      { value: 'new_energy_resources', label: 'New Energy Resources' },
      { value: 'hardware', label: 'Hardware' },
      { value: 'processing_machinery_equipment', label: 'Processing Machinery Equipment' },
      { value: 'general_machinery_mechanical_basic_parts', label: 'General Machinery and Mechanical Basic Parts' },
      { value: 'construction_machinery', label: 'Construction Machinery' },
      { value: 'new_energy_vehicles_smart_mobility', label: 'New Energy Vehicles and Smart Mobility' },
      { value: 'bicycles', label: 'Bicycles' },
      { value: 'vehicles', label: 'Vehicles' },
      { value: 'consumer_electronics_information_products', label: 'Consumer Electronics and Information Products' },
      { value: 'lighting_equipment', label: 'Lighting Equipment' },
      { value: 'new_materials_chemical_products', label: 'New Materials and Chemical Products' },
      { value: 'tools', label: 'Tools' },
      { value: 'power_machinery_electric_power', label: 'Power Machinery and Electric Power' },
      { value: 'industrial_automation_intelligent_manufacturing', label: 'Industrial Automation and Intelligent Manufacturing' },
      { value: 'agricultural_machinery', label: 'Agricultural Machinery' },
      { value: 'motorcycles', label: 'Motorcycles' },
      { value: 'vehicle_spare_parts', label: 'Vehicle Spare Parts' },
    ],
  },
  phase2: {
    label: 'Phase 2',
    categories: [
      { value: 'building_decorative_materials', label: 'Building and Decorative Materials' },
      { value: 'furniture', label: 'Furniture' },
      { value: 'general_ceramics', label: 'General Ceramics' },
      { value: 'clocks_watches_optical_instruments', label: 'Clocks, Watches and Optical Instruments' },
      { value: 'festival_products', label: 'Festival Products' },
      { value: 'art_ceramics', label: 'Art Ceramics' },
      { value: 'gardening_products', label: 'Gardening Products' },
      { value: 'household_items', label: 'Household Items' },
      { value: 'sanitary_bathroom_equipment', label: 'Sanitary and Bathroom Equipment' },
      { value: 'kitchenware_tableware', label: 'Kitchenware and Tableware' },
      { value: 'gifts_premiums', label: 'Gifts and Premiums' },
      { value: 'home_decorations', label: 'Home Decorations' },
      { value: 'glass_artware', label: 'Glass Artware' },
      { value: 'weaving_rattan_iron_products', label: 'Weaving, Rattan and Iron Products' },
    ],
  },
  phase3: {
    label: 'Phase 3',
    categories: [
      { value: 'personal_care_products', label: 'Personal Care Products' },
      { value: 'medicines_health_products_medical_devices', label: 'Medicines, Health Products and Medical Devices' },
      { value: 'children_baby_maternity_products', label: 'Children, Baby and Maternity Products' },
      { value: 'kids_wear', label: "Kids' Wear" },
      { value: 'sports_casual_wear', label: 'Sports and Casual Wear' },
      { value: 'furs_leather_downs_related_products', label: 'Furs, Leather, Downs and Related Products' },
      { value: 'home_textiles', label: 'Home Textiles' },
      { value: 'carpets_tapestries', label: 'Carpets and Tapestries' },
      { value: 'office_supplies', label: 'Office Supplies' },
      { value: 'sports_travel_recreation_products', label: 'Sports, Travel and Recreation Products' },
      { value: 'traditional_chinese_specialties', label: 'Traditional Chinese Specialties' },
      { value: 'toiletries', label: 'Toiletries' },
      { value: 'pet_products_food', label: 'Pet Products and Food' },
      { value: 'toys', label: 'Toys' },
      { value: 'men_women_clothing', label: "Men and Women's Clothing" },
      { value: 'underwear', label: 'Underwear' },
      { value: 'fashion_accessories_fittings', label: 'Fashion Accessories and Fittings' },
      { value: 'textile_raw_materials_fabrics', label: 'Textile Raw Materials and Fabrics' },
      { value: 'shoes', label: 'Shoes' },
      { value: 'cases_bags', label: 'Cases and Bags' },
      { value: 'food', label: 'Food' },
    ],
  },
};

export function normalisePhase(value: unknown): Phase {
  const phase = String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (phase === "1" || phase === "phase1") return "phase1";
  if (phase === "3" || phase === "phase3") return "phase3";
  return "phase2";
}
