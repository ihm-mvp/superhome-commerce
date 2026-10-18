// Official Canton Fair Exhibition Sections — October 2026
// Shared category configuration for:
// 1. Sourcing Requests
// 2. Post-Tour Survey

var PHASES = {
  phase1: {
    label: 'Phase 1',
    categories: [
      ['household_electrical_appliances', 'Household Electrical Appliances'],
      ['electronic_electrical_products', 'Electronic and Electrical Products'],
      ['new_energy_resources', 'New Energy Resources'],
      ['hardware', 'Hardware'],
      ['processing_machinery_equipment', 'Processing Machinery Equipment'],
      ['general_machinery_mechanical_basic_parts', 'General Machinery and Mechanical Basic Parts'],
      ['construction_machinery', 'Construction Machinery'],
      ['new_energy_vehicles_smart_mobility', 'New Energy Vehicles and Smart Mobility'],
      ['bicycles', 'Bicycles'],
      ['vehicles', 'Vehicles'],
      ['consumer_electronics_information_products', 'Consumer Electronics and Information Products'],
      ['lighting_equipment', 'Lighting Equipment'],
      ['new_materials_chemical_products', 'New Materials and Chemical Products'],
      ['tools', 'Tools'],
      ['power_machinery_electric_power', 'Power Machinery and Electric Power'],
      ['industrial_automation_intelligent_manufacturing', 'Industrial Automation and Intelligent Manufacturing'],
      ['agricultural_machinery', 'Agricultural Machinery'],
      ['motorcycles', 'Motorcycles'],
      ['vehicle_spare_parts', 'Vehicle Spare Parts']
    ]
  },

  phase2: {
    label: 'Phase 2',
    categories: [
      ['building_decorative_materials', 'Building and Decorative Materials'],
      ['furniture', 'Furniture'],
      ['general_ceramics', 'General Ceramics'],
      ['clocks_watches_optical_instruments', 'Clocks, Watches and Optical Instruments'],
      ['festival_products', 'Festival Products'],
      ['art_ceramics', 'Art Ceramics'],
      ['gardening_products', 'Gardening Products'],
      ['household_items', 'Household Items'],
      ['sanitary_bathroom_equipment', 'Sanitary and Bathroom Equipment'],
      ['kitchenware_tableware', 'Kitchenware and Tableware'],
      ['gifts_premiums', 'Gifts and Premiums'],
      ['home_decorations', 'Home Decorations'],
      ['glass_artware', 'Glass Artware'],
      ['weaving_rattan_iron_products', 'Weaving, Rattan and Iron Products']
    ]
  },

  phase3: {
    label: 'Phase 3',
    categories: [
      ['personal_care_products', 'Personal Care Products'],
      ['medicines_health_products_medical_devices', 'Medicines, Health Products and Medical Devices'],
      ['children_baby_maternity_products', 'Children, Baby and Maternity Products'],
      ['kids_wear', "Kids' Wear"],
      ['sports_casual_wear', 'Sports and Casual Wear'],
      ['furs_leather_downs_related_products', 'Furs, Leather, Downs and Related Products'],
      ['home_textiles', 'Home Textiles'],
      ['carpets_tapestries', 'Carpets and Tapestries'],
      ['office_supplies', 'Office Supplies'],
      ['sports_travel_recreation_products', 'Sports, Travel and Recreation Products'],
      ['traditional_chinese_specialties', 'Traditional Chinese Specialties'],
      ['toiletries', 'Toiletries'],
      ['pet_products_food', 'Pet Products and Food'],
      ['toys', 'Toys'],
      ['men_women_clothing', "Men and Women's Clothing"],
      ['underwear', 'Underwear'],
      ['fashion_accessories_fittings', 'Fashion Accessories and Fittings'],
      ['textile_raw_materials_fabrics', 'Textile Raw Materials and Fabrics'],
      ['shoes', 'Shoes'],
      ['cases_bags', 'Cases and Bags'],
      ['food', 'Food']
    ]
  }
};


// Convert incoming phase values into a standard format.
function normalisePhase(value) {
  var phase = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  if (phase === '1' || phase === 'phase1') {
    return 'phase1';
  }

  if (phase === '2' || phase === 'phase2') {
    return 'phase2';
  }

  if (phase === '3' || phase === 'phase3') {
    return 'phase3';
  }

  // Preserve the existing default behaviour.
  return 'phase2';
}


// Return categories in the format expected by the mini-program forms.
function getCategories(phase) {
  var config = PHASES[normalisePhase(phase)];

  return config.categories.map(function (item) {
    return {
      value: item[0],
      label: item[1],
      checked: false
    };
  });
}


// Export shared configuration for both forms.
module.exports = {
  PHASES: PHASES,
  normalisePhase: normalisePhase,
  getCategories: getCategories
};