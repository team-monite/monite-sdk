export type MccCodeType = {
  label: string;
  code: number;
  short: string;
};

const mccCodes: readonly MccCodeType[] = [
  {
    label: 'A/C, Refrigeration Repair',
    short: 'ac_refrigeration_repair',
    code: 7623,
  },
  {
    label: 'Accounting/Bookkeeping Services',
    short: 'accounting_bookkeeping_services',
    code: 8931,
  },
  {
    label: 'Advertising Services',
    short: 'advertising_services',
    code: 7311,
  },
  {
    label: 'Agricultural Cooperative',
    short: 'agricultural_cooperative',
    code: 763,
  },
  {
    label: 'Airlines, Air Carriers',
    short: 'airlines_air_carriers',
    code: 4511,
  },
  {
    label: 'Airports, Flying Fields',
    short: 'airports_flying_fields',
    code: 4582,
  },
  {
    label: 'Ambulance Services',
    short: 'ambulance_services',
    code: 4119,
  },
  {
    label: 'Amusement Parks/Carnivals',
    short: 'amusement_parks_carnivals',
    code: 7996,
  },
  {
    label: 'Antique Reproductions',
    short: 'antique_reproductions',
    code: 5937,
  },
  {
    label: 'Antique Shops',
    short: 'antique_shops',
    code: 5932,
  },
  {
    label: 'Aquariums',
    short: 'aquariums',
    code: 7998,
  },
  {
    label: 'Architectural/Surveying Services',
    short: 'architectural_surveying_services',
    code: 8911,
  },
  {
    label: 'Art Dealers and Galleries',
    short: 'art_dealers_and_galleries',
    code: 5971,
  },
  {
    label: 'Artists Supply and Craft Shops',
    short: 'artists_supply_and_craft_shops',
    code: 5970,
  },
  {
    label: 'Auto Body Repair Shops',
    short: 'auto_body_repair_shops',
    code: 7531,
  },
  {
    label: 'Auto Paint Shops',
    short: 'auto_paint_shops',
    code: 7535,
  },
  {
    label: 'Auto Service Shops',
    short: 'auto_service_shops',
    code: 7538,
  },
  {
    label: 'Auto and Home Supply Stores',
    short: 'auto_and_home_supply_stores',
    code: 5531,
  },
  {
    label: 'Automated Cash Disburse',
    short: 'automated_cash_disburse',
    code: 6011,
  },
  {
    label: 'Automated Fuel Dispensers',
    short: 'automated_fuel_dispensers',
    code: 5542,
  },
  {
    label: 'Automobile Associations',
    short: 'automobile_associations',
    code: 8675,
  },
  {
    label: 'Automotive Parts and Accessories Stores',
    short: 'automotive_parts_and_accessories_stores',
    code: 5533,
  },
  {
    label: 'Automotive Tire Stores',
    short: 'automotive_tire_stores',
    code: 5532,
  },
  {
    label:
      'Bail and Bond Payments (payment to the surety for the bond, not the actual bond paid to the government agency)',
    short: 'bail_and_bond_payments',
    code: 9223,
  },
  {
    label: 'Bakeries',
    short: 'bakeries',
    code: 5462,
  },
  {
    label: 'Bands, Orchestras',
    short: 'bands_orchestras',
    code: 7929,
  },
  {
    label: 'Barber and Beauty Shops',
    short: 'barber_and_beauty_shops',
    code: 7230,
  },
  {
    label: 'Betting/Casino Gambling',
    short: 'betting_casino_gambling',
    code: 7995,
  },
  {
    label: 'Bicycle Shops',
    short: 'bicycle_shops',
    code: 5940,
  },
  {
    label: 'Billiard/Pool Establishments',
    short: 'billiard_pool_establishments',
    code: 7932,
  },
  {
    label: 'Boat Dealers',
    short: 'boat_dealers',
    code: 5551,
  },
  {
    label: 'Boat Rentals and Leases',
    short: 'boat_rentals_and_leases',
    code: 4457,
  },
  {
    label: 'Book Stores',
    short: 'book_stores',
    code: 5942,
  },
  {
    label: 'Books, Periodicals, and Newspapers',
    short: 'books_periodicals_and_newspapers',
    code: 5192,
  },
  {
    label: 'Bowling Alleys',
    short: 'bowling_alleys',
    code: 7933,
  },
  {
    label: 'Bus Lines',
    short: 'bus_lines',
    code: 4131,
  },
  {
    label: 'Business/Secretarial Schools',
    short: 'business_secretarial_schools',
    code: 8244,
  },
  {
    label: 'Buying/Shopping Services',
    short: 'buying_shopping_services',
    code: 7278,
  },
  {
    label: 'Cable, Satellite, and Other Pay Television and Radio',
    short: 'cable_satellite_and_other_pay_television_and_radio',
    code: 4899,
  },
  {
    label: 'Camera and Photographic Supply Stores',
    short: 'camera_and_photographic_supply_stores',
    code: 5946,
  },
  {
    label: 'Candy, Nut, and Confectionery Stores',
    short: 'candy_nut_and_confectionery_stores',
    code: 5441,
  },
  {
    label: 'Car Rental Agencies',
    short: 'car_rental_agencies',
    code: 7512,
  },
  {
    label: 'Car Washes',
    short: 'car_washes',
    code: 7542,
  },
  {
    label:
      'Car and Truck Dealers (New &amp; Used) Sales, Service, Repairs Parts and Leasing',
    short: 'car_and_truck_dealers_new_used',
    code: 5511,
  },
  {
    label:
      'Car and Truck Dealers (Used Only) Sales, Service, Repairs Parts and Leasing',
    short: 'car_and_truck_dealers_used_only',
    code: 5521,
  },
  {
    label: 'Carpentry Services',
    short: 'carpentry_services',
    code: 1750,
  },
  {
    label: 'Carpet/Upholstery Cleaning',
    short: 'carpet_upholstery_cleaning',
    code: 7217,
  },
  {
    label: 'Caterers',
    short: 'caterers',
    code: 5811,
  },
  {
    label: 'Charitable and Social Service Organizations - Fundraising',
    short: 'charitable_and_social_service_organizations_fundraising',
    code: 8398,
  },
  {
    label: 'Chemicals and Allied Products (Not Elsewhere Classified)',
    short: 'chemicals_and_allied_products',
    code: 5169,
  },
  {
    label: 'Child Care Services',
    short: 'child_care_services',
    code: 8351,
  },
  {
    label: 'Childrens and Infants Wear Stores',
    short: 'childrens_and_infants_wear_stores',
    code: 5641,
  },
  {
    label: 'Chiropodists, Podiatrists',
    short: 'chiropodists_podiatrists',
    code: 8049,
  },
  {
    label: 'Chiropractors',
    short: 'chiropractors',
    code: 8041,
  },
  {
    label: 'Cigar Stores and Stands',
    short: 'cigar_stores_and_stands',
    code: 5993,
  },
  {
    label: 'Civic, Social, Fraternal Associations',
    short: 'civic_social_fraternal_associations',
    code: 8641,
  },
  {
    label: 'Cleaning and Maintenance',
    short: 'cleaning_and_maintenance',
    code: 7349,
  },
  {
    label: 'Clothing Rental',
    short: 'clothing_rental',
    code: 7296,
  },
  {
    label: 'Colleges, Universities',
    short: 'colleges_universities',
    code: 8220,
  },
  {
    label: 'Commercial Equipment (Not Elsewhere Classified)',
    short: 'commercial_equipment',
    code: 5046,
  },
  {
    label: 'Commercial Footwear',
    short: 'commercial_footwear',
    code: 5139,
  },
  {
    label: 'Commercial Photography, Art and Graphics',
    short: 'commercial_photography_art_and_graphics',
    code: 7333,
  },
  {
    label: 'Commuter Transport, Ferries',
    short: 'commuter_transport_and_ferries',
    code: 4111,
  },
  {
    label: 'Computer Network Services',
    short: 'computer_network_services',
    code: 4816,
  },
  {
    label: 'Computer Programming',
    short: 'computer_programming',
    code: 7372,
  },
  {
    label: 'Computer Repair',
    short: 'computer_repair',
    code: 7379,
  },
  {
    label: 'Computer Software Stores',
    short: 'computer_software_stores',
    code: 5734,
  },
  {
    label: 'Computers, Peripherals, and Software',
    short: 'computers_peripherals_and_software',
    code: 5045,
  },
  {
    label: 'Concrete Work Services',
    short: 'concrete_work_services',
    code: 1771,
  },
  {
    label: 'Construction Materials (Not Elsewhere Classified)',
    short: 'construction_materials',
    code: 5039,
  },
  {
    label: 'Consulting, Public Relations',
    short: 'consulting_public_relations',
    code: 7392,
  },
  {
    label: 'Correspondence Schools',
    short: 'correspondence_schools',
    code: 8241,
  },
  {
    label: 'Cosmetic Stores',
    short: 'cosmetic_stores',
    code: 5977,
  },
  {
    label: 'Counseling Services',
    short: 'counseling_services',
    code: 7277,
  },
  {
    label: 'Country Clubs',
    short: 'country_clubs',
    code: 7997,
  },
  {
    label: 'Courier Services',
    short: 'courier_services',
    code: 4215,
  },
  {
    label: 'Court Costs, Including Alimony and Child Support - Courts of Law',
    short: 'court_costs',
    code: 9211,
  },
  {
    label: 'Credit Reporting Agencies',
    short: 'credit_reporting_agencies',
    code: 7321,
  },
  {
    label: 'Cruise Lines',
    short: 'cruise_lines',
    code: 4411,
  },
  {
    label: 'Dairy Products Stores',
    short: 'dairy_products_stores',
    code: 5451,
  },
  {
    label: 'Dance Hall, Studios, Schools',
    short: 'dance_hall_studios_schools',
    code: 7911,
  },
  {
    label: 'Dating/Escort Services',
    short: 'dating_escort_services',
    code: 7273,
  },
  {
    label: 'Dentists, Orthodontists',
    short: 'dentists_orthodontists',
    code: 8021,
  },
  {
    label: 'Department Stores',
    short: 'department_stores',
    code: 5311,
  },
  {
    label: 'Detective Agencies',
    short: 'detective_agencies',
    code: 7393,
  },
  {
    label: 'Digital Goods Media \u2013 Books, Movies, Music',
    short: 'digital_goods_media',
    code: 5815,
  },
  {
    label: 'Digital Goods \u2013 Applications (Excludes Games)',
    short: 'digital_goods_applications',
    code: 5817,
  },
  {
    label: 'Digital Goods \u2013 Games',
    short: 'digital_goods_games',
    code: 5816,
  },
  {
    label: 'Digital Goods \u2013 Large Digital Goods Merchant',
    short: 'digital_goods_large_volume',
    code: 5818,
  },
  {
    label: 'Direct Marketing - Catalog Merchant',
    short: 'direct_marketing_catalog_merchant',
    code: 5964,
  },
  {
    label: 'Direct Marketing - Combination Catalog and Retail Merchant',
    short: 'direct_marketing_combination_catalog_and_retail_merchant',
    code: 5965,
  },
  {
    label: 'Direct Marketing - Inbound Telemarketing',
    short: 'direct_marketing_inbound_telemarketing',
    code: 5967,
  },
  {
    label: 'Direct Marketing - Insurance Services',
    short: 'direct_marketing_insurance_services',
    code: 5960,
  },
  {
    label: 'Direct Marketing - Other',
    short: 'direct_marketing_other',
    code: 5969,
  },
  {
    label: 'Direct Marketing - Outbound Telemarketing',
    short: 'direct_marketing_outbound_telemarketing',
    code: 5966,
  },
  {
    label: 'Direct Marketing - Subscription',
    short: 'direct_marketing_subscription',
    code: 5968,
  },
  {
    label: 'Direct Marketing - Travel',
    short: 'direct_marketing_travel',
    code: 5962,
  },
  {
    label: 'Discount Stores',
    short: 'discount_stores',
    code: 5310,
  },
  {
    label: 'Doctors',
    short: 'doctors',
    code: 8011,
  },
  {
    label: 'Door-To-Door Sales',
    short: 'door_to_door_sales',
    code: 5963,
  },
  {
    label: 'Drapery, Window Covering, and Upholstery Stores',
    short: 'drapery_window_covering_and_upholstery_stores',
    code: 5714,
  },
  {
    label: 'Drinking Places',
    short: 'drinking_places',
    code: 5813,
  },
  {
    label: 'Drug Stores and Pharmacies',
    short: 'drug_stores_and_pharmacies',
    code: 5912,
  },
  {
    label: 'Drugs, Drug Proprietaries, and Druggist Sundries',
    short: 'drugs_drug_proprietaries_and_druggist_sundries',
    code: 5122,
  },
  {
    label: 'Dry Cleaners',
    short: 'dry_cleaners',
    code: 7216,
  },
  {
    label: 'Durable Goods (Not Elsewhere Classified)',
    short: 'durable_goods',
    code: 5099,
  },
  {
    label: 'Duty Free Stores',
    short: 'duty_free_stores',
    code: 5309,
  },
  {
    label: 'Eating Places, Restaurants',
    short: 'eating_places_restaurants',
    code: 5812,
  },
  {
    label: 'Educational Services',
    short: 'educational_services',
    code: 8299,
  },
  {
    label: 'Electric Razor Stores',
    short: 'electric_razor_stores',
    code: 5997,
  },
  {
    label: 'Electrical Parts and Equipment',
    short: 'electrical_parts_and_equipment',
    code: 5065,
  },
  {
    label: 'Electrical Services',
    short: 'electrical_services',
    code: 1731,
  },
  {
    label: 'Electronics Repair Shops',
    short: 'electronics_repair_shops',
    code: 7622,
  },
  {
    label: 'Electronics Stores',
    short: 'electronics_stores',
    code: 5732,
  },
  {
    label: 'Elementary, Secondary Schools',
    short: 'elementary_secondary_schools',
    code: 8211,
  },
  {
    label: 'Employment/Temp Agencies',
    short: 'employment_temp_agencies',
    code: 7361,
  },
  {
    label: 'Equipment Rental',
    short: 'equipment_rental',
    code: 7394,
  },
  {
    label: 'Exterminating Services',
    short: 'exterminating_services',
    code: 7342,
  },
  {
    label: 'Family Clothing Stores',
    short: 'family_clothing_stores',
    code: 5651,
  },
  {
    label: 'Fast Food Restaurants',
    short: 'fast_food_restaurants',
    code: 5814,
  },
  {
    label: 'Financial Institutions',
    short: 'financial_institutions',
    code: 6012,
  },
  {
    label: 'Fines - Government Administrative Entities',
    short: 'fines_government_administrative_entities',
    code: 9222,
  },
  {
    label: 'Fireplace, Fireplace Screens, and Accessories Stores',
    short: 'fireplace_fireplace_screens_and_accessories_stores',
    code: 5718,
  },
  {
    label: 'Floor Covering Stores',
    short: 'floor_covering_stores',
    code: 5713,
  },
  {
    label: 'Florists',
    short: 'florists',
    code: 5992,
  },
  {
    label: 'Florists Supplies, Nursery Stock, and Flowers',
    short: 'florists_supplies_nursery_stock_and_flowers',
    code: 5193,
  },
  {
    label: 'Freezer and Locker Meat Provisioners',
    short: 'freezer_and_locker_meat_provisioners',
    code: 5422,
  },
  {
    label: 'Fuel Dealers (Non Automotive)',
    short: 'fuel_dealers_non_automotive',
    code: 5983,
  },
  {
    label: 'Funeral Services, Crematories',
    short: 'funeral_services_crematories',
    code: 7261,
  },
  {
    label: 'Furniture Repair, Refinishing',
    short: 'furniture_repair_refinishing',
    code: 7641,
  },
  {
    label:
      'Furniture, Home Furnishings, and Equipment Stores, Except Appliances',
    short: 'furniture_home_furnishings_and_equipment_stores_except_appliances',
    code: 5712,
  },
  {
    label: 'Furriers and Fur Shops',
    short: 'furriers_and_fur_shops',
    code: 5681,
  },
  {
    label: 'General Services',
    short: 'general_services',
    code: 1520,
  },
  {
    label: 'Gift, Card, Novelty, and Souvenir Shops',
    short: 'gift_card_novelty_and_souvenir_shops',
    code: 5947,
  },
  {
    label: 'Glass, Paint, and Wallpaper Stores',
    short: 'glass_paint_and_wallpaper_stores',
    code: 5231,
  },
  {
    label: 'Glassware, Crystal Stores',
    short: 'glassware_crystal_stores',
    code: 5950,
  },
  {
    label: 'Golf Courses - Public',
    short: 'golf_courses_public',
    code: 7992,
  },
  {
    label: 'Government Services (Not Elsewhere Classified)',
    short: 'government_services',
    code: 9399,
  },
  {
    label: 'Grocery Stores, Supermarkets',
    short: 'grocery_stores_supermarkets',
    code: 5411,
  },
  {
    label: 'Hardware Stores',
    short: 'hardware_stores',
    code: 5251,
  },
  {
    label: 'Hardware, Equipment, and Supplies',
    short: 'hardware_equipment_and_supplies',
    code: 5072,
  },
  {
    label: 'Health and Beauty Spas',
    short: 'health_and_beauty_spas',
    code: 7298,
  },
  {
    label: 'Hearing Aids Sales and Supplies',
    short: 'hearing_aids_sales_and_supplies',
    code: 5975,
  },
  {
    label: 'Heating, Plumbing, A/C',
    short: 'heating_plumbing_a_c',
    code: 1711,
  },
  {
    label: 'Hobby, Toy, and Game Shops',
    short: 'hobby_toy_and_game_shops',
    code: 5945,
  },
  {
    label: 'Home Supply Warehouse Stores',
    short: 'home_supply_warehouse_stores',
    code: 5200,
  },
  {
    label: 'Hospitals',
    short: 'hospitals',
    code: 8062,
  },
  {
    label: 'Hotels, Motels, and Resorts',
    short: 'hotels_motels_and_resorts',
    code: 7011,
  },
  {
    label: 'Household Appliance Stores',
    short: 'household_appliance_stores',
    code: 5722,
  },
  {
    label: 'Industrial Supplies (Not Elsewhere Classified)',
    short: 'industrial_supplies',
    code: 5085,
  },
  {
    label: 'Information Retrieval Services',
    short: 'information_retrieval_services',
    code: 7375,
  },
  {
    label: 'Insurance - Default',
    short: 'insurance_default',
    code: 6399,
  },
  {
    label: 'Insurance Underwriting, Premiums',
    short: 'insurance_underwriting_premiums',
    code: 6300,
  },
  {
    label: 'Intra-Company Purchases',
    short: 'intra_company_purchases',
    code: 9950,
  },
  {
    label: 'Jewelry Stores, Watches, Clocks, and Silverware Stores',
    short: 'jewelry_stores_watches_clocks_and_silverware_stores',
    code: 5944,
  },
  {
    label: 'Landscaping Services',
    short: 'landscaping_services',
    code: 780,
  },
  {
    label: 'Laundries',
    short: 'laundries',
    code: 7211,
  },
  {
    label: 'Laundry, Cleaning Services',
    short: 'laundry_cleaning_services',
    code: 7210,
  },
  {
    label: 'Legal Services, Attorneys',
    short: 'legal_services_attorneys',
    code: 8111,
  },
  {
    label: 'Luggage and Leather Goods Stores',
    short: 'luggage_and_leather_goods_stores',
    code: 5948,
  },
  {
    label: 'Lumber, Building Materials Stores',
    short: 'lumber_building_materials_stores',
    code: 5211,
  },
  {
    label: 'Manual Cash Disburse',
    short: 'manual_cash_disburse',
    code: 6010,
  },
  {
    label: 'Marinas, Service and Supplies',
    short: 'marinas_service_and_supplies',
    code: 4468,
  },
  {
    label: 'Masonry, Stonework, and Plaster',
    short: 'masonry_stonework_and_plaster',
    code: 1740,
  },
  {
    label: 'Massage Parlors',
    short: 'massage_parlors',
    code: 7297,
  },
  {
    label: 'Medical Services',
    short: 'medical_services',
    code: 8099,
  },
  {
    label: 'Medical and Dental Labs',
    short: 'medical_and_dental_labs',
    code: 8071,
  },
  {
    label: 'Medical, Dental, Ophthalmic, and Hospital Equipment and Supplies',
    short: 'medical_dental_ophthalmic_and_hospital_equipment_and_supplies',
    code: 5047,
  },
  {
    label: 'Membership Organizations',
    short: 'membership_organizations',
    code: 8699,
  },
  {
    label: 'Mens and Boys Clothing and Accessories Stores',
    short: 'mens_and_boys_clothing_and_accessories_stores',
    code: 5611,
  },
  {
    label: 'Mens, Womens Clothing Stores',
    short: 'mens_womens_clothing_stores',
    code: 5691,
  },
  {
    label: 'Metal Service Centers',
    short: 'metal_service_centers',
    code: 5051,
  },
  {
    label: 'Miscellaneous Apparel and Accessory Shops',
    short: 'miscellaneous_apparel_and_accessory_shops',
    code: 5699,
  },
  {
    label: 'Miscellaneous Auto Dealers',
    short: 'miscellaneous_auto_dealers',
    code: 5599,
  },
  {
    label: 'Miscellaneous Business Services',
    short: 'miscellaneous_business_services',
    code: 7399,
  },
  {
    label:
      'Miscellaneous Food Stores - Convenience Stores and Specialty Markets',
    short: 'miscellaneous_food_stores',
    code: 5499,
  },
  {
    label: 'Miscellaneous General Merchandise',
    short: 'miscellaneous_general_merchandise',
    code: 5399,
  },
  {
    label: 'Miscellaneous General Services',
    short: 'miscellaneous_general_services',
    code: 7299,
  },
  {
    label: 'Miscellaneous Home Furnishing Specialty Stores',
    short: 'miscellaneous_home_furnishing_specialty_stores',
    code: 5719,
  },
  {
    label: 'Miscellaneous Publishing and Printing',
    short: 'miscellaneous_publishing_and_printing',
    code: 2741,
  },
  {
    label: 'Miscellaneous Recreation Services',
    short: 'miscellaneous_recreation_services',
    code: 7999,
  },
  {
    label: 'Miscellaneous Repair Shops',
    short: 'miscellaneous_repair_shops',
    code: 7699,
  },
  {
    label: 'Miscellaneous Specialty Retail',
    short: 'miscellaneous_specialty_retail',
    code: 5999,
  },
  {
    label: 'Mobile Home Dealers',
    short: 'mobile_home_dealers',
    code: 5271,
  },
  {
    label: 'Motion Picture Theaters',
    short: 'motion_picture_theaters',
    code: 7832,
  },
  {
    label:
      'Motor Freight Carriers and Trucking - Local and Long Distance, Moving and Storage Companies, and Local Delivery Services',
    short: 'motor_freight_carriers_and_trucking',
    code: 4214,
  },
  {
    label: 'Motor Homes Dealers',
    short: 'motor_homes_dealers',
    code: 5592,
  },
  {
    label: 'Motor Vehicle Supplies and New Parts',
    short: 'motor_vehicle_supplies_and_new_parts',
    code: 5013,
  },
  {
    label: 'Motorcycle Shops and Dealers',
    short: 'motorcycle_shops_and_dealers',
    code: 5571,
  },
  {
    label: 'Motorcycle Shops, Dealers',
    short: 'motorcycle_shops_dealers',
    code: 5561,
  },
  {
    label: 'Music Stores-Musical Instruments, Pianos, and Sheet Music',
    short: 'music_stores_musical_instruments_pianos_and_sheet_music',
    code: 5733,
  },
  {
    label: 'News Dealers and Newsstands',
    short: 'news_dealers_and_newsstands',
    code: 5994,
  },
  {
    label: 'Non-FI, Money Orders',
    short: 'non_fi_money_orders',
    code: 6051,
  },
  {
    label: 'Non-FI, Stored Value Card Purchase/Load',
    short: 'non_fi_stored_value_card_purchase_load',
    code: 6540,
  },
  {
    label: 'Nondurable Goods (Not Elsewhere Classified)',
    short: 'nondurable_goods',
    code: 5199,
  },
  {
    label: 'Nurseries, Lawn and Garden Supply Stores',
    short: 'nurseries_lawn_and_garden_supply_stores',
    code: 5261,
  },
  {
    label: 'Nursing/Personal Care',
    short: 'nursing_personal_care',
    code: 8050,
  },
  {
    label: 'Office and Commercial Furniture',
    short: 'office_and_commercial_furniture',
    code: 5021,
  },
  {
    label: 'Opticians, Eyeglasses',
    short: 'opticians_eyeglasses',
    code: 8043,
  },
  {
    label: 'Optometrists, Ophthalmologist',
    short: 'optometrists_ophthalmologist',
    code: 8042,
  },
  {
    label: 'Orthopedic Goods - Prosthetic Devices',
    short: 'orthopedic_goods_prosthetic_devices',
    code: 5976,
  },
  {
    label: 'Osteopaths',
    short: 'osteopaths',
    code: 8031,
  },
  {
    label: 'Package Stores-Beer, Wine, and Liquor',
    short: 'package_stores_beer_wine_and_liquor',
    code: 5921,
  },
  {
    label: 'Paints, Varnishes, and Supplies',
    short: 'paints_varnishes_and_supplies',
    code: 5198,
  },
  {
    label: 'Parking Lots, Garages',
    short: 'parking_lots_garages',
    code: 7523,
  },
  {
    label: 'Passenger Railways',
    short: 'passenger_railways',
    code: 4112,
  },
  {
    label: 'Pawn Shops',
    short: 'pawn_shops',
    code: 5933,
  },
  {
    label: 'Pet Shops, Pet Food, and Supplies',
    short: 'pet_shops_pet_food_and_supplies',
    code: 5995,
  },
  {
    label: 'Petroleum and Petroleum Products',
    short: 'petroleum_and_petroleum_products',
    code: 5172,
  },
  {
    label: 'Photo Developing',
    short: 'photo_developing',
    code: 7395,
  },
  {
    label: 'Photographic Studios',
    short: 'photographic_studios',
    code: 7221,
  },
  {
    label: 'Photographic, Photocopy, Microfilm Equipment, and Supplies',
    short: 'photographic_photocopy_microfilm_equipment_and_supplies',
    code: 5044,
  },
  {
    label: 'Picture/Video Production',
    short: 'picture_video_production',
    code: 7829,
  },
  {
    label: 'Piece Goods, Notions, and Other Dry Goods',
    short: 'piece_goods_notions_and_other_dry_goods',
    code: 5131,
  },
  {
    label: 'Plumbing, Heating Equipment, and Supplies',
    short: 'plumbing_heating_equipment_and_supplies',
    code: 5074,
  },
  {
    label: 'Political Organizations',
    short: 'political_organizations',
    code: 8651,
  },
  {
    label: 'Postal Services - Government Only',
    short: 'postal_services_government_only',
    code: 9402,
  },
  {
    label: 'Precious Stones and Metals, Watches and Jewelry',
    short: 'precious_stones_and_metals_watches_and_jewelry',
    code: 5094,
  },
  {
    label: 'Professional Services',
    short: 'professional_services',
    code: 8999,
  },
  {
    label:
      'Public Warehousing and Storage - Farm Products, Refrigerated Goods, Household Goods, and Storage',
    short: 'public_warehousing_and_storage',
    code: 4225,
  },
  {
    label: 'Quick Copy, Repro, and Blueprint',
    short: 'quick_copy_repro_and_blueprint',
    code: 7338,
  },
  {
    label: 'Railroads',
    short: 'railroads',
    code: 4011,
  },
  {
    label: 'Real Estate Agents and Managers - Rentals',
    short: 'real_estate_agents_and_managers_rentals',
    code: 6513,
  },
  {
    label: 'Record Stores',
    short: 'record_stores',
    code: 5735,
  },
  {
    label: 'Recreational Vehicle Rentals',
    short: 'recreational_vehicle_rentals',
    code: 7519,
  },
  {
    label: 'Religious Goods Stores',
    short: 'religious_goods_stores',
    code: 5973,
  },
  {
    label: 'Religious Organizations',
    short: 'religious_organizations',
    code: 8661,
  },
  {
    label: 'Roofing/Siding, Sheet Metal',
    short: 'roofing_siding_sheet_metal',
    code: 1761,
  },
  {
    label: 'Secretarial Support Services',
    short: 'secretarial_support_services',
    code: 7339,
  },
  {
    label: 'Security Brokers/Dealers',
    short: 'security_brokers_dealers',
    code: 6211,
  },
  {
    label: 'Service Stations',
    short: 'service_stations',
    code: 5541,
  },
  {
    label: 'Sewing, Needlework, Fabric, and Piece Goods Stores',
    short: 'sewing_needlework_fabric_and_piece_goods_stores',
    code: 5949,
  },
  {
    label: 'Shoe Repair/Hat Cleaning',
    short: 'shoe_repair_hat_cleaning',
    code: 7251,
  },
  {
    label: 'Shoe Stores',
    short: 'shoe_stores',
    code: 5661,
  },
  {
    label: 'Small Appliance Repair',
    short: 'small_appliance_repair',
    code: 7629,
  },
  {
    label: 'Snowmobile Dealers',
    short: 'snowmobile_dealers',
    code: 5598,
  },
  {
    label: 'Special Trade Services',
    short: 'special_trade_services',
    code: 1799,
  },
  {
    label: 'Specialty Cleaning',
    short: 'specialty_cleaning',
    code: 2842,
  },
  {
    label: 'Sporting Goods Stores',
    short: 'sporting_goods_stores',
    code: 5941,
  },
  {
    label: 'Sporting/Recreation Camps',
    short: 'sporting_recreation_camps',
    code: 7032,
  },
  {
    label: 'Sports Clubs/Fields',
    short: 'sports_clubs_fields',
    code: 7941,
  },
  {
    label: 'Sports and Riding Apparel Stores',
    short: 'sports_and_riding_apparel_stores',
    code: 5655,
  },
  {
    label: 'Stamp and Coin Stores',
    short: 'stamp_and_coin_stores',
    code: 5972,
  },
  {
    label: 'Stationary, Office Supplies, Printing and Writing Paper',
    short: 'stationary_office_supplies_printing_and_writing_paper',
    code: 5111,
  },
  {
    label: 'Stationery Stores, Office, and School Supply Stores',
    short: 'stationery_stores_office_and_school_supply_stores',
    code: 5943,
  },
  {
    label: 'Swimming Pools Sales',
    short: 'swimming_pools_sales',
    code: 5996,
  },
  {
    label: 'TUI Travel - Germany',
    short: 't_ui_travel_germany',
    code: 4723,
  },
  {
    label: 'Tailors, Alterations',
    short: 'tailors_alterations',
    code: 5697,
  },
  {
    label: 'Tax Payments - Government Agencies',
    short: 'tax_payments_government_agencies',
    code: 9311,
  },
  {
    label: 'Tax Preparation Services',
    short: 'tax_preparation_services',
    code: 7276,
  },
  {
    label: 'Taxicabs/Limousines',
    short: 'taxicabs_limousines',
    code: 4121,
  },
  {
    label: 'Telecommunication Equipment and Telephone Sales',
    short: 'telecommunication_equipment_and_telephone_sales',
    code: 4812,
  },
  {
    label: 'Telecommunication Services',
    short: 'telecommunication_services',
    code: 4814,
  },
  {
    label: 'Telegraph Services',
    short: 'telegraph_services',
    code: 4821,
  },
  {
    label: 'Tent and Awning Shops',
    short: 'tent_and_awning_shops',
    code: 5998,
  },
  {
    label: 'Testing Laboratories',
    short: 'testing_laboratories',
    code: 8734,
  },
  {
    label: 'Theatrical Ticket Agencies',
    short: 'theatrical_ticket_agencies',
    code: 7922,
  },
  {
    label: 'Timeshares',
    short: 'timeshares',
    code: 7012,
  },
  {
    label: 'Tire Retreading and Repair',
    short: 'tire_retreading_and_repair',
    code: 7534,
  },
  {
    label: 'Tolls/Bridge Fees',
    short: 'tolls_bridge_fees',
    code: 4784,
  },
  {
    label: 'Tourist Attractions and Exhibits',
    short: 'tourist_attractions_and_exhibits',
    code: 7991,
  },
  {
    label: 'Towing Services',
    short: 'towing_services',
    code: 7549,
  },
  {
    label: 'Trailer Parks, Campgrounds',
    short: 'trailer_parks_campgrounds',
    code: 7033,
  },
  {
    label: 'Transportation Services (Not Elsewhere Classified)',
    short: 'transportation_services',
    code: 4789,
  },
  {
    label: 'Travel Agencies, Tour Operators',
    short: 'travel_agencies_tour_operators',
    code: 4722,
  },
  {
    label: 'Truck StopIteration',
    short: 'truck_stop_iteration',
    code: 7511,
  },
  {
    label: 'Truck/Utility Trailer Rentals',
    short: 'truck_utility_trailer_rentals',
    code: 7513,
  },
  {
    label: 'Typesetting, Plate Making, and Related Services',
    short: 'typesetting_plate_making_and_related_services',
    code: 2791,
  },
  {
    label: 'Typewriter Stores',
    short: 'typewriter_stores',
    code: 5978,
  },
  {
    label: 'U.S. Federal Government Agencies or Departments',
    short: 'u_s_federal_government_agencies_or_departments',
    code: 9405,
  },
  {
    label: 'Uniforms, Commercial Clothing',
    short: 'uniforms_commercial_clothing',
    code: 5137,
  },
  {
    label: 'Used Merchandise and Secondhand Stores',
    short: 'used_merchandise_and_secondhand_stores',
    code: 5931,
  },
  {
    label: 'Utilities',
    short: 'utilities',
    code: 4900,
  },
  {
    label: 'Variety Stores',
    short: 'variety_stores',
    code: 5331,
  },
  {
    label: 'Veterinary Services',
    short: 'veterinary_services',
    code: 742,
  },
  {
    label: 'Video Amusement Game Supplies',
    short: 'video_amusement_game_supplies',
    code: 7993,
  },
  {
    label: 'Video Game Arcades',
    short: 'video_game_arcades',
    code: 7994,
  },
  {
    label: 'Video Tape Rental Stores',
    short: 'video_tape_rental_stores',
    code: 7841,
  },
  {
    label: 'Vocational/Trade Schools',
    short: 'vocational_trade_schools',
    code: 8249,
  },
  {
    label: 'Watch/Jewelry Repair',
    short: 'watch_jewelry_repair',
    code: 7631,
  },
  {
    label: 'Welding Repair',
    short: 'welding_repair',
    code: 7692,
  },
  {
    label: 'Wholesale Clubs',
    short: 'wholesale_clubs',
    code: 5300,
  },
  {
    label: 'Wig and Toupee Stores',
    short: 'wig_and_toupee_stores',
    code: 5698,
  },
  {
    label: 'Wires, Money Orders',
    short: 'wires_money_orders',
    code: 4829,
  },
  {
    label: 'Womens Accessory and Specialty Shops',
    short: 'womens_accessory_and_specialty_shops',
    code: 5631,
  },
  {
    label: 'Womens Ready-To-Wear Stores',
    short: 'womens_ready_to_wear_stores',
    code: 5621,
  },
  {
    label: 'Wrecking and Salvage Yards',
    short: 'wrecking_and_salvage_yards',
    code: 5935,
  },
];

export default mccCodes;
