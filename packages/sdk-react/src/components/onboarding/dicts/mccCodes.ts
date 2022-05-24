import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';

export type MccCodeType = {
  label: string;
  code: string;
  short: string;
};

export const getMccCodes = (i18n: I18n): MccCodeType[] => [
  {
    label: t(i18n)`A/C, Refrigeration Repair`,
    short: 'ac_refrigeration_repair',
    code: '7623',
  },
  {
    label: t(i18n)`Accounting/Bookkeeping Services`,
    short: 'accounting_bookkeeping_services',
    code: '8931',
  },
  {
    label: t(i18n)`Advertising Services`,
    short: 'advertising_services',
    code: '7311',
  },
  {
    label: t(i18n)`Agricultural Cooperative`,
    short: 'agricultural_cooperative',
    code: '0763',
  },
  {
    label: t(i18n)`Airlines, Air Carriers`,
    short: 'airlines_air_carriers',
    code: '4511',
  },
  {
    label: t(i18n)`Airports, Flying Fields`,
    short: 'airports_flying_fields',
    code: '4582',
  },
  {
    label: t(i18n)`Ambulance Services`,
    short: 'ambulance_services',
    code: '4119',
  },
  {
    label: t(i18n)`Amusement Parks/Carnivals`,
    short: 'amusement_parks_carnivals',
    code: '7996',
  },
  {
    label: t(i18n)`Antique Reproductions`,
    short: 'antique_reproductions',
    code: '5937',
  },
  {
    label: t(i18n)`Antique Shops`,
    short: 'antique_shops',
    code: '5932',
  },
  {
    label: t(i18n)`Aquariums`,
    short: 'aquariums',
    code: '7998',
  },
  {
    label: t(i18n)`Architectural/Surveying Services`,
    short: 'architectural_surveying_services',
    code: '8911',
  },
  {
    label: t(i18n)`Art Dealers and Galleries`,
    short: 'art_dealers_and_galleries',
    code: '5971',
  },
  {
    label: t(i18n)`Artists Supply and Craft Shops`,
    short: 'artists_supply_and_craft_shops',
    code: '5970',
  },
  {
    label: t(i18n)`Auto Body Repair Shops`,
    short: 'auto_body_repair_shops',
    code: '7531',
  },
  {
    label: t(i18n)`Auto Paint Shops`,
    short: 'auto_paint_shops',
    code: '7535',
  },
  {
    label: t(i18n)`Auto Service Shops`,
    short: 'auto_service_shops',
    code: '7538',
  },
  {
    label: t(i18n)`Auto and Home Supply Stores`,
    short: 'auto_and_home_supply_stores',
    code: '5531',
  },
  {
    label: t(i18n)`Automated Cash Disburse`,
    short: 'automated_cash_disburse',
    code: '6011',
  },
  {
    label: t(i18n)`Automated Fuel Dispensers`,
    short: 'automated_fuel_dispensers',
    code: '5542',
  },
  {
    label: t(i18n)`Automobile Associations`,
    short: 'automobile_associations',
    code: '8675',
  },
  {
    label: t(i18n)`Automotive Parts and Accessories Stores`,
    short: 'automotive_parts_and_accessories_stores',
    code: '5533',
  },
  {
    label: t(i18n)`Automotive Tire Stores`,
    short: 'automotive_tire_stores',
    code: '5532',
  },
  {
    label: t(
      i18n
    )`Bail and Bond Payments (payment to the surety for the bond, not the actual bond paid to the government agency)`,
    short: 'bail_and_bond_payments',
    code: '9223',
  },
  {
    label: t(i18n)`Bakeries`,
    short: 'bakeries',
    code: '5462',
  },
  {
    label: t(i18n)`Bands, Orchestras`,
    short: 'bands_orchestras',
    code: '7929',
  },
  {
    label: t(i18n)`Barber and Beauty Shops`,
    short: 'barber_and_beauty_shops',
    code: '7230',
  },
  {
    label: t(i18n)`Betting/Casino Gambling`,
    short: 'betting_casino_gambling',
    code: '7995',
  },
  {
    label: t(i18n)`Bicycle Shops`,
    short: 'bicycle_shops',
    code: '5940',
  },
  {
    label: t(i18n)`Billiard/Pool Establishments`,
    short: 'billiard_pool_establishments',
    code: '7932',
  },
  {
    label: t(i18n)`Boat Dealers`,
    short: 'boat_dealers',
    code: '5551',
  },
  {
    label: t(i18n)`Boat Rentals and Leases`,
    short: 'boat_rentals_and_leases',
    code: '4457',
  },
  {
    label: t(i18n)`Book Stores`,
    short: 'book_stores',
    code: '5942',
  },
  {
    label: t(i18n)`Books, Periodicals, and Newspapers`,
    short: 'books_periodicals_and_newspapers',
    code: '5192',
  },
  {
    label: t(i18n)`Bowling Alleys`,
    short: 'bowling_alleys',
    code: '7933',
  },
  {
    label: t(i18n)`Bus Lines`,
    short: 'bus_lines',
    code: '4131',
  },
  {
    label: t(i18n)`Business/Secretarial Schools`,
    short: 'business_secretarial_schools',
    code: '8244',
  },
  {
    label: t(i18n)`Buying/Shopping Services`,
    short: 'buying_shopping_services',
    code: '7278',
  },
  {
    label: t(i18n)`Cable, Satellite, and Other Pay Television and Radio`,
    short: 'cable_satellite_and_other_pay_television_and_radio',
    code: '4899',
  },
  {
    label: t(i18n)`Camera and Photographic Supply Stores`,
    short: 'camera_and_photographic_supply_stores',
    code: '5946',
  },
  {
    label: t(i18n)`Candy, Nut, and Confectionery Stores`,
    short: 'candy_nut_and_confectionery_stores',
    code: '5441',
  },
  {
    label: t(i18n)`Car Rental Agencies`,
    short: 'car_rental_agencies',
    code: '7512',
  },
  {
    label: t(i18n)`Car Washes`,
    short: 'car_washes',
    code: '7542',
  },
  {
    label: t(
      i18n
    )`Car and Truck Dealers (New &amp; Used) Sales, Service, Repairs Parts and Leasing`,
    short: 'car_and_truck_dealers_new_used',
    code: '5511',
  },
  {
    label: t(
      i18n
    )`Car and Truck Dealers (Used Only) Sales, Service, Repairs Parts and Leasing`,
    short: 'car_and_truck_dealers_used_only',
    code: '5521',
  },
  {
    label: t(i18n)`Carpentry Services`,
    short: 'carpentry_services',
    code: '1750',
  },
  {
    label: t(i18n)`Carpet/Upholstery Cleaning`,
    short: 'carpet_upholstery_cleaning',
    code: '7217',
  },
  {
    label: t(i18n)`Caterers`,
    short: 'caterers',
    code: '5811',
  },
  {
    label: t(i18n)`Charitable and Social Service Organizations - Fundraising`,
    short: 'charitable_and_social_service_organizations_fundraising',
    code: '8398',
  },
  {
    label: t(i18n)`Chemicals and Allied Products (Not Elsewhere Classified)`,
    short: 'chemicals_and_allied_products',
    code: '5169',
  },
  {
    label: t(i18n)`Child Care Services`,
    short: 'child_care_services',
    code: '8351',
  },
  {
    label: t(i18n)`Childrens and Infants Wear Stores`,
    short: 'childrens_and_infants_wear_stores',
    code: '5641',
  },
  {
    label: t(i18n)`Chiropodists, Podiatrists`,
    short: 'chiropodists_podiatrists',
    code: '8049',
  },
  {
    label: t(i18n)`Chiropractors`,
    short: 'chiropractors',
    code: '8041',
  },
  {
    label: t(i18n)`Cigar Stores and Stands`,
    short: 'cigar_stores_and_stands',
    code: '5993',
  },
  {
    label: t(i18n)`Civic, Social, Fraternal Associations`,
    short: 'civic_social_fraternal_associations',
    code: '8641',
  },
  {
    label: t(i18n)`Cleaning and Maintenance`,
    short: 'cleaning_and_maintenance',
    code: '7349',
  },
  {
    label: t(i18n)`Clothing Rental`,
    short: 'clothing_rental',
    code: '7296',
  },
  {
    label: t(i18n)`Colleges, Universities`,
    short: 'colleges_universities',
    code: '8220',
  },
  {
    label: t(i18n)`Commercial Equipment (Not Elsewhere Classified)`,
    short: 'commercial_equipment',
    code: '5046',
  },
  {
    label: t(i18n)`Commercial Footwear`,
    short: 'commercial_footwear',
    code: '5139',
  },
  {
    label: t(i18n)`Commercial Photography, Art and Graphics`,
    short: 'commercial_photography_art_and_graphics',
    code: '7333',
  },
  {
    label: t(i18n)`Commuter Transport, Ferries`,
    short: 'commuter_transport_and_ferries',
    code: '4111',
  },
  {
    label: t(i18n)`Computer Network Services`,
    short: 'computer_network_services',
    code: '4816',
  },
  {
    label: t(i18n)`Computer Programming`,
    short: 'computer_programming',
    code: '7372',
  },
  {
    label: t(i18n)`Computer Repair`,
    short: 'computer_repair',
    code: '7379',
  },
  {
    label: t(i18n)`Computer Software Stores`,
    short: 'computer_software_stores',
    code: '5734',
  },
  {
    label: t(i18n)`Computers, Peripherals, and Software`,
    short: 'computers_peripherals_and_software',
    code: '5045',
  },
  {
    label: t(i18n)`Concrete Work Services`,
    short: 'concrete_work_services',
    code: '1771',
  },
  {
    label: t(i18n)`Construction Materials (Not Elsewhere Classified)`,
    short: 'construction_materials',
    code: '5039',
  },
  {
    label: t(i18n)`Consulting, Public Relations`,
    short: 'consulting_public_relations',
    code: '7392',
  },
  {
    label: t(i18n)`Correspondence Schools`,
    short: 'correspondence_schools',
    code: '8241',
  },
  {
    label: t(i18n)`Cosmetic Stores`,
    short: 'cosmetic_stores',
    code: '5977',
  },
  {
    label: t(i18n)`Counseling Services`,
    short: 'counseling_services',
    code: '7277',
  },
  {
    label: t(i18n)`Country Clubs`,
    short: 'country_clubs',
    code: '7997',
  },
  {
    label: t(i18n)`Courier Services`,
    short: 'courier_services',
    code: '4215',
  },
  {
    label: t(
      i18n
    )`Court Costs, Including Alimony and Child Support - Courts of Law`,
    short: 'court_costs',
    code: '9211',
  },
  {
    label: t(i18n)`Credit Reporting Agencies`,
    short: 'credit_reporting_agencies',
    code: '7321',
  },
  {
    label: t(i18n)`Cruise Lines`,
    short: 'cruise_lines',
    code: '4411',
  },
  {
    label: t(i18n)`Dairy Products Stores`,
    short: 'dairy_products_stores',
    code: '5451',
  },
  {
    label: t(i18n)`Dance Hall, Studios, Schools`,
    short: 'dance_hall_studios_schools',
    code: '7911',
  },
  {
    label: t(i18n)`Dating/Escort Services`,
    short: 'dating_escort_services',
    code: '7273',
  },
  {
    label: t(i18n)`Dentists, Orthodontists`,
    short: 'dentists_orthodontists',
    code: '8021',
  },
  {
    label: t(i18n)`Department Stores`,
    short: 'department_stores',
    code: '5311',
  },
  {
    label: t(i18n)`Detective Agencies`,
    short: 'detective_agencies',
    code: '7393',
  },
  {
    label: t(i18n)`Digital Goods Media \u2013 Books, Movies, Music`,
    short: 'digital_goods_media',
    code: '5815',
  },
  {
    label: t(i18n)`Digital Goods \u2013 Applications (Excludes Games)`,
    short: 'digital_goods_applications',
    code: '5817',
  },
  {
    label: t(i18n)`Digital Goods \u2013 Games`,
    short: 'digital_goods_games',
    code: '5816',
  },
  {
    label: t(i18n)`Digital Goods \u2013 Large Digital Goods Merchant`,
    short: 'digital_goods_large_volume',
    code: '5818',
  },
  {
    label: t(i18n)`Direct Marketing - Catalog Merchant`,
    short: 'direct_marketing_catalog_merchant',
    code: '5964',
  },
  {
    label: t(i18n)`Direct Marketing - Combination Catalog and Retail Merchant`,
    short: 'direct_marketing_combination_catalog_and_retail_merchant',
    code: '5965',
  },
  {
    label: t(i18n)`Direct Marketing - Inbound Telemarketing`,
    short: 'direct_marketing_inbound_telemarketing',
    code: '5967',
  },
  {
    label: t(i18n)`Direct Marketing - Insurance Services`,
    short: 'direct_marketing_insurance_services',
    code: '5960',
  },
  {
    label: t(i18n)`Direct Marketing - Other`,
    short: 'direct_marketing_other',
    code: '5969',
  },
  {
    label: t(i18n)`Direct Marketing - Outbound Telemarketing`,
    short: 'direct_marketing_outbound_telemarketing',
    code: '5966',
  },
  {
    label: t(i18n)`Direct Marketing - Subscription`,
    short: 'direct_marketing_subscription',
    code: '5968',
  },
  {
    label: t(i18n)`Direct Marketing - Travel`,
    short: 'direct_marketing_travel',
    code: '5962',
  },
  {
    label: t(i18n)`Discount Stores`,
    short: 'discount_stores',
    code: '5310',
  },
  {
    label: t(i18n)`Doctors`,
    short: 'doctors',
    code: '8011',
  },
  {
    label: t(i18n)`Door-To-Door Sales`,
    short: 'door_to_door_sales',
    code: '5963',
  },
  {
    label: t(i18n)`Drapery, Window Covering, and Upholstery Stores`,
    short: 'drapery_window_covering_and_upholstery_stores',
    code: '5714',
  },
  {
    label: t(i18n)`Drinking Places`,
    short: 'drinking_places',
    code: '5813',
  },
  {
    label: t(i18n)`Drug Stores and Pharmacies`,
    short: 'drug_stores_and_pharmacies',
    code: '5912',
  },
  {
    label: t(i18n)`Drugs, Drug Proprietaries, and Druggist Sundries`,
    short: 'drugs_drug_proprietaries_and_druggist_sundries',
    code: '5122',
  },
  {
    label: t(i18n)`Dry Cleaners`,
    short: 'dry_cleaners',
    code: '7216',
  },
  {
    label: t(i18n)`Durable Goods (Not Elsewhere Classified)`,
    short: 'durable_goods',
    code: '5099',
  },
  {
    label: t(i18n)`Duty Free Stores`,
    short: 'duty_free_stores',
    code: '5309',
  },
  {
    label: t(i18n)`Eating Places, Restaurants`,
    short: 'eating_places_restaurants',
    code: '5812',
  },
  {
    label: t(i18n)`Educational Services`,
    short: 'educational_services',
    code: '8299',
  },
  {
    label: t(i18n)`Electric Razor Stores`,
    short: 'electric_razor_stores',
    code: '5997',
  },
  {
    label: t(i18n)`Electrical Parts and Equipment`,
    short: 'electrical_parts_and_equipment',
    code: '5065',
  },
  {
    label: t(i18n)`Electrical Services`,
    short: 'electrical_services',
    code: '1731',
  },
  {
    label: t(i18n)`Electronics Repair Shops`,
    short: 'electronics_repair_shops',
    code: '7622',
  },
  {
    label: t(i18n)`Electronics Stores`,
    short: 'electronics_stores',
    code: '5732',
  },
  {
    label: t(i18n)`Elementary, Secondary Schools`,
    short: 'elementary_secondary_schools',
    code: '8211',
  },
  {
    label: t(i18n)`Employment/Temp Agencies`,
    short: 'employment_temp_agencies',
    code: '7361',
  },
  {
    label: t(i18n)`Equipment Rental`,
    short: 'equipment_rental',
    code: '7394',
  },
  {
    label: t(i18n)`Exterminating Services`,
    short: 'exterminating_services',
    code: '7342',
  },
  {
    label: t(i18n)`Family Clothing Stores`,
    short: 'family_clothing_stores',
    code: '5651',
  },
  {
    label: t(i18n)`Fast Food Restaurants`,
    short: 'fast_food_restaurants',
    code: '5814',
  },
  {
    label: t(i18n)`Financial Institutions`,
    short: 'financial_institutions',
    code: '6012',
  },
  {
    label: t(i18n)`Fines - Government Administrative Entities`,
    short: 'fines_government_administrative_entities',
    code: '9222',
  },
  {
    label: t(i18n)`Fireplace, Fireplace Screens, and Accessories Stores`,
    short: 'fireplace_fireplace_screens_and_accessories_stores',
    code: '5718',
  },
  {
    label: t(i18n)`Floor Covering Stores`,
    short: 'floor_covering_stores',
    code: '5713',
  },
  {
    label: t(i18n)`Florists`,
    short: 'florists',
    code: '5992',
  },
  {
    label: t(i18n)`Florists Supplies, Nursery Stock, and Flowers`,
    short: 'florists_supplies_nursery_stock_and_flowers',
    code: '5193',
  },
  {
    label: t(i18n)`Freezer and Locker Meat Provisioners`,
    short: 'freezer_and_locker_meat_provisioners',
    code: '5422',
  },
  {
    label: t(i18n)`Fuel Dealers (Non Automotive)`,
    short: 'fuel_dealers_non_automotive',
    code: '5983',
  },
  {
    label: t(i18n)`Funeral Services, Crematories`,
    short: 'funeral_services_crematories',
    code: '7261',
  },
  {
    label: t(i18n)`Furniture Repair, Refinishing`,
    short: 'furniture_repair_refinishing',
    code: '7641',
  },
  {
    label: t(
      i18n
    )`Furniture, Home Furnishings, and Equipment Stores, Except Appliances`,
    short: 'furniture_home_furnishings_and_equipment_stores_except_appliances',
    code: '5712',
  },
  {
    label: t(i18n)`Furriers and Fur Shops`,
    short: 'furriers_and_fur_shops',
    code: '5681',
  },
  {
    label: t(i18n)`General Services`,
    short: 'general_services',
    code: '1520',
  },
  {
    label: t(i18n)`Gift, Card, Novelty, and Souvenir Shops`,
    short: 'gift_card_novelty_and_souvenir_shops',
    code: '5947',
  },
  {
    label: t(i18n)`Glass, Paint, and Wallpaper Stores`,
    short: 'glass_paint_and_wallpaper_stores',
    code: '5231',
  },
  {
    label: t(i18n)`Glassware, Crystal Stores`,
    short: 'glassware_crystal_stores',
    code: '5950',
  },
  {
    label: t(i18n)`Golf Courses - Public`,
    short: 'golf_courses_public',
    code: '7992',
  },
  {
    label: t(i18n)`Government Services (Not Elsewhere Classified)`,
    short: 'government_services',
    code: '9399',
  },
  {
    label: t(i18n)`Grocery Stores, Supermarkets`,
    short: 'grocery_stores_supermarkets',
    code: '5411',
  },
  {
    label: t(i18n)`Hardware Stores`,
    short: 'hardware_stores',
    code: '5251',
  },
  {
    label: t(i18n)`Hardware, Equipment, and Supplies`,
    short: 'hardware_equipment_and_supplies',
    code: '5072',
  },
  {
    label: t(i18n)`Health and Beauty Spas`,
    short: 'health_and_beauty_spas',
    code: '7298',
  },
  {
    label: t(i18n)`Hearing Aids Sales and Supplies`,
    short: 'hearing_aids_sales_and_supplies',
    code: '5975',
  },
  {
    label: t(i18n)`Heating, Plumbing, A/C`,
    short: 'heating_plumbing_a_c',
    code: '1711',
  },
  {
    label: t(i18n)`Hobby, Toy, and Game Shops`,
    short: 'hobby_toy_and_game_shops',
    code: '5945',
  },
  {
    label: t(i18n)`Home Supply Warehouse Stores`,
    short: 'home_supply_warehouse_stores',
    code: '5200',
  },
  {
    label: t(i18n)`Hospitals`,
    short: 'hospitals',
    code: '8062',
  },
  {
    label: t(i18n)`Hotels, Motels, and Resorts`,
    short: 'hotels_motels_and_resorts',
    code: '7011',
  },
  {
    label: t(i18n)`Household Appliance Stores`,
    short: 'household_appliance_stores',
    code: '5722',
  },
  {
    label: t(i18n)`Industrial Supplies (Not Elsewhere Classified)`,
    short: 'industrial_supplies',
    code: '5085',
  },
  {
    label: t(i18n)`Information Retrieval Services`,
    short: 'information_retrieval_services',
    code: '7375',
  },
  {
    label: t(i18n)`Insurance - Default`,
    short: 'insurance_default',
    code: '6399',
  },
  {
    label: t(i18n)`Insurance Underwriting, Premiums`,
    short: 'insurance_underwriting_premiums',
    code: '6300',
  },
  {
    label: t(i18n)`Intra-Company Purchases`,
    short: 'intra_company_purchases',
    code: '9950',
  },
  {
    label: t(i18n)`Jewelry Stores, Watches, Clocks, and Silverware Stores`,
    short: 'jewelry_stores_watches_clocks_and_silverware_stores',
    code: '5944',
  },
  {
    label: t(i18n)`Landscaping Services`,
    short: 'landscaping_services',
    code: '0780',
  },
  {
    label: t(i18n)`Laundries`,
    short: 'laundries',
    code: '7211',
  },
  {
    label: t(i18n)`Laundry, Cleaning Services`,
    short: 'laundry_cleaning_services',
    code: '7210',
  },
  {
    label: t(i18n)`Legal Services, Attorneys`,
    short: 'legal_services_attorneys',
    code: '8111',
  },
  {
    label: t(i18n)`Luggage and Leather Goods Stores`,
    short: 'luggage_and_leather_goods_stores',
    code: '5948',
  },
  {
    label: t(i18n)`Lumber, Building Materials Stores`,
    short: 'lumber_building_materials_stores',
    code: '5211',
  },
  {
    label: t(i18n)`Manual Cash Disburse`,
    short: 'manual_cash_disburse',
    code: '6010',
  },
  {
    label: t(i18n)`Marinas, Service and Supplies`,
    short: 'marinas_service_and_supplies',
    code: '4468',
  },
  {
    label: t(i18n)`Masonry, Stonework, and Plaster`,
    short: 'masonry_stonework_and_plaster',
    code: '1740',
  },
  {
    label: t(i18n)`Massage Parlors`,
    short: 'massage_parlors',
    code: '7297',
  },
  {
    label: t(i18n)`Medical Services`,
    short: 'medical_services',
    code: '8099',
  },
  {
    label: t(i18n)`Medical and Dental Labs`,
    short: 'medical_and_dental_labs',
    code: '8071',
  },
  {
    label: t(
      i18n
    )`Medical, Dental, Ophthalmic, and Hospital Equipment and Supplies`,
    short: 'medical_dental_ophthalmic_and_hospital_equipment_and_supplies',
    code: '5047',
  },
  {
    label: t(i18n)`Membership Organizations`,
    short: 'membership_organizations',
    code: '8699',
  },
  {
    label: t(i18n)`Mens and Boys Clothing and Accessories Stores`,
    short: 'mens_and_boys_clothing_and_accessories_stores',
    code: '5611',
  },
  {
    label: t(i18n)`Mens, Womens Clothing Stores`,
    short: 'mens_womens_clothing_stores',
    code: '5691',
  },
  {
    label: t(i18n)`Metal Service Centers`,
    short: 'metal_service_centers',
    code: '5051',
  },
  {
    label: t(i18n)`Miscellaneous Apparel and Accessory Shops`,
    short: 'miscellaneous_apparel_and_accessory_shops',
    code: '5699',
  },
  {
    label: t(i18n)`Miscellaneous Auto Dealers`,
    short: 'miscellaneous_auto_dealers',
    code: '5599',
  },
  {
    label: t(i18n)`Miscellaneous Business Services`,
    short: 'miscellaneous_business_services',
    code: '7399',
  },
  {
    label: t(
      i18n
    )`Miscellaneous Food Stores - Convenience Stores and Specialty Markets`,
    short: 'miscellaneous_food_stores',
    code: '5499',
  },
  {
    label: t(i18n)`Miscellaneous General Merchandise`,
    short: 'miscellaneous_general_merchandise',
    code: '5399',
  },
  {
    label: t(i18n)`Miscellaneous General Services`,
    short: 'miscellaneous_general_services',
    code: '7299',
  },
  {
    label: t(i18n)`Miscellaneous Home Furnishing Specialty Stores`,
    short: 'miscellaneous_home_furnishing_specialty_stores',
    code: '5719',
  },
  {
    label: t(i18n)`Miscellaneous Publishing and Printing`,
    short: 'miscellaneous_publishing_and_printing',
    code: '2741',
  },
  {
    label: t(i18n)`Miscellaneous Recreation Services`,
    short: 'miscellaneous_recreation_services',
    code: '7999',
  },
  {
    label: t(i18n)`Miscellaneous Repair Shops`,
    short: 'miscellaneous_repair_shops',
    code: '7699',
  },
  {
    label: t(i18n)`Miscellaneous Specialty Retail`,
    short: 'miscellaneous_specialty_retail',
    code: '5999',
  },
  {
    label: t(i18n)`Mobile Home Dealers`,
    short: 'mobile_home_dealers',
    code: '5271',
  },
  {
    label: t(i18n)`Motion Picture Theaters`,
    short: 'motion_picture_theaters',
    code: '7832',
  },
  {
    label: t(
      i18n
    )`Motor Freight Carriers and Trucking - Local and Long Distance, Moving and Storage Companies, and Local Delivery Services`,
    short: 'motor_freight_carriers_and_trucking',
    code: '4214',
  },
  {
    label: t(i18n)`Motor Homes Dealers`,
    short: 'motor_homes_dealers',
    code: '5592',
  },
  {
    label: t(i18n)`Motor Vehicle Supplies and New Parts`,
    short: 'motor_vehicle_supplies_and_new_parts',
    code: '5013',
  },
  {
    label: t(i18n)`Motorcycle Shops and Dealers`,
    short: 'motorcycle_shops_and_dealers',
    code: '5571',
  },
  {
    label: t(i18n)`Motorcycle Shops, Dealers`,
    short: 'motorcycle_shops_dealers',
    code: '5561',
  },
  {
    label: t(i18n)`Music Stores-Musical Instruments, Pianos, and Sheet Music`,
    short: 'music_stores_musical_instruments_pianos_and_sheet_music',
    code: '5733',
  },
  {
    label: t(i18n)`News Dealers and Newsstands`,
    short: 'news_dealers_and_newsstands',
    code: '5994',
  },
  {
    label: t(i18n)`Non-FI, Money Orders`,
    short: 'non_fi_money_orders',
    code: '6051',
  },
  {
    label: t(i18n)`Non-FI, Stored Value Card Purchase/Load`,
    short: 'non_fi_stored_value_card_purchase_load',
    code: '6540',
  },
  {
    label: t(i18n)`Nondurable Goods (Not Elsewhere Classified)`,
    short: 'nondurable_goods',
    code: '5199',
  },
  {
    label: t(i18n)`Nurseries, Lawn and Garden Supply Stores`,
    short: 'nurseries_lawn_and_garden_supply_stores',
    code: '5261',
  },
  {
    label: t(i18n)`Nursing/Personal Care`,
    short: 'nursing_personal_care',
    code: '8050',
  },
  {
    label: t(i18n)`Office and Commercial Furniture`,
    short: 'office_and_commercial_furniture',
    code: '5021',
  },
  {
    label: t(i18n)`Opticians, Eyeglasses`,
    short: 'opticians_eyeglasses',
    code: '8043',
  },
  {
    label: t(i18n)`Optometrists, Ophthalmologist`,
    short: 'optometrists_ophthalmologist',
    code: '8042',
  },
  {
    label: t(i18n)`Orthopedic Goods - Prosthetic Devices`,
    short: 'orthopedic_goods_prosthetic_devices',
    code: '5976',
  },
  {
    label: t(i18n)`Osteopaths`,
    short: 'osteopaths',
    code: '8031',
  },
  {
    label: t(i18n)`Package Stores-Beer, Wine, and Liquor`,
    short: 'package_stores_beer_wine_and_liquor',
    code: '5921',
  },
  {
    label: t(i18n)`Paints, Varnishes, and Supplies`,
    short: 'paints_varnishes_and_supplies',
    code: '5198',
  },
  {
    label: t(i18n)`Parking Lots, Garages`,
    short: 'parking_lots_garages',
    code: '7523',
  },
  {
    label: t(i18n)`Passenger Railways`,
    short: 'passenger_railways',
    code: '4112',
  },
  {
    label: t(i18n)`Pawn Shops`,
    short: 'pawn_shops',
    code: '5933',
  },
  {
    label: t(i18n)`Pet Shops, Pet Food, and Supplies`,
    short: 'pet_shops_pet_food_and_supplies',
    code: '5995',
  },
  {
    label: t(i18n)`Petroleum and Petroleum Products`,
    short: 'petroleum_and_petroleum_products',
    code: '5172',
  },
  {
    label: t(i18n)`Photo Developing`,
    short: 'photo_developing',
    code: '7395',
  },
  {
    label: t(i18n)`Photographic Studios`,
    short: 'photographic_studios',
    code: '7221',
  },
  {
    label: t(i18n)`Photographic, Photocopy, Microfilm Equipment, and Supplies`,
    short: 'photographic_photocopy_microfilm_equipment_and_supplies',
    code: '5044',
  },
  {
    label: t(i18n)`Picture/Video Production`,
    short: 'picture_video_production',
    code: '7829',
  },
  {
    label: t(i18n)`Piece Goods, Notions, and Other Dry Goods`,
    short: 'piece_goods_notions_and_other_dry_goods',
    code: '5131',
  },
  {
    label: t(i18n)`Plumbing, Heating Equipment, and Supplies`,
    short: 'plumbing_heating_equipment_and_supplies',
    code: '5074',
  },
  {
    label: t(i18n)`Political Organizations`,
    short: 'political_organizations',
    code: '8651',
  },
  {
    label: t(i18n)`Postal Services - Government Only`,
    short: 'postal_services_government_only',
    code: '9402',
  },
  {
    label: t(i18n)`Precious Stones and Metals, Watches and Jewelry`,
    short: 'precious_stones_and_metals_watches_and_jewelry',
    code: '5094',
  },
  {
    label: t(i18n)`Professional Services`,
    short: 'professional_services',
    code: '8999',
  },
  {
    label: t(
      i18n
    )`Public Warehousing and Storage - Farm Products, Refrigerated Goods, Household Goods, and Storage`,
    short: 'public_warehousing_and_storage',
    code: '4225',
  },
  {
    label: t(i18n)`Quick Copy, Repro, and Blueprint`,
    short: 'quick_copy_repro_and_blueprint',
    code: '7338',
  },
  {
    label: t(i18n)`Railroads`,
    short: 'railroads',
    code: '4011',
  },
  {
    label: t(i18n)`Real Estate Agents and Managers - Rentals`,
    short: 'real_estate_agents_and_managers_rentals',
    code: '6513',
  },
  {
    label: t(i18n)`Record Stores`,
    short: 'record_stores',
    code: '5735',
  },
  {
    label: t(i18n)`Recreational Vehicle Rentals`,
    short: 'recreational_vehicle_rentals',
    code: '7519',
  },
  {
    label: t(i18n)`Religious Goods Stores`,
    short: 'religious_goods_stores',
    code: '5973',
  },
  {
    label: t(i18n)`Religious Organizations`,
    short: 'religious_organizations',
    code: '8661',
  },
  {
    label: t(i18n)`Roofing/Siding, Sheet Metal`,
    short: 'roofing_siding_sheet_metal',
    code: '1761',
  },
  {
    label: t(i18n)`Secretarial Support Services`,
    short: 'secretarial_support_services',
    code: '7339',
  },
  {
    label: t(i18n)`Security Brokers/Dealers`,
    short: 'security_brokers_dealers',
    code: '6211',
  },
  {
    label: t(i18n)`Service Stations`,
    short: 'service_stations',
    code: '5541',
  },
  {
    label: t(i18n)`Sewing, Needlework, Fabric, and Piece Goods Stores`,
    short: 'sewing_needlework_fabric_and_piece_goods_stores',
    code: '5949',
  },
  {
    label: t(i18n)`Shoe Repair/Hat Cleaning`,
    short: 'shoe_repair_hat_cleaning',
    code: '7251',
  },
  {
    label: t(i18n)`Shoe Stores`,
    short: 'shoe_stores',
    code: '5661',
  },
  {
    label: t(i18n)`Small Appliance Repair`,
    short: 'small_appliance_repair',
    code: '7629',
  },
  {
    label: t(i18n)`Snowmobile Dealers`,
    short: 'snowmobile_dealers',
    code: '5598',
  },
  {
    label: t(i18n)`Special Trade Services`,
    short: 'special_trade_services',
    code: '1799',
  },
  {
    label: t(i18n)`Specialty Cleaning`,
    short: 'specialty_cleaning',
    code: '2842',
  },
  {
    label: t(i18n)`Sporting Goods Stores`,
    short: 'sporting_goods_stores',
    code: '5941',
  },
  {
    label: t(i18n)`Sporting/Recreation Camps`,
    short: 'sporting_recreation_camps',
    code: '7032',
  },
  {
    label: t(i18n)`Sports Clubs/Fields`,
    short: 'sports_clubs_fields',
    code: '7941',
  },
  {
    label: t(i18n)`Sports and Riding Apparel Stores`,
    short: 'sports_and_riding_apparel_stores',
    code: '5655',
  },
  {
    label: t(i18n)`Stamp and Coin Stores`,
    short: 'stamp_and_coin_stores',
    code: '5972',
  },
  {
    label: t(i18n)`Stationary, Office Supplies, Printing and Writing Paper`,
    short: 'stationary_office_supplies_printing_and_writing_paper',
    code: '5111',
  },
  {
    label: t(i18n)`Stationery Stores, Office, and School Supply Stores`,
    short: 'stationery_stores_office_and_school_supply_stores',
    code: '5943',
  },
  {
    label: t(i18n)`Swimming Pools Sales`,
    short: 'swimming_pools_sales',
    code: '5996',
  },
  {
    label: t(i18n)`TUI Travel - Germany`,
    short: 't_ui_travel_germany',
    code: '4723',
  },
  {
    label: t(i18n)`Tailors, Alterations`,
    short: 'tailors_alterations',
    code: '5697',
  },
  {
    label: t(i18n)`Tax Payments - Government Agencies`,
    short: 'tax_payments_government_agencies',
    code: '9311',
  },
  {
    label: t(i18n)`Tax Preparation Services`,
    short: 'tax_preparation_services',
    code: '7276',
  },
  {
    label: t(i18n)`Taxicabs/Limousines`,
    short: 'taxicabs_limousines',
    code: '4121',
  },
  {
    label: t(i18n)`Telecommunication Equipment and Telephone Sales`,
    short: 'telecommunication_equipment_and_telephone_sales',
    code: '4812',
  },
  {
    label: t(i18n)`Telecommunication Services`,
    short: 'telecommunication_services',
    code: '4814',
  },
  {
    label: t(i18n)`Telegraph Services`,
    short: 'telegraph_services',
    code: '4821',
  },
  {
    label: t(i18n)`Tent and Awning Shops`,
    short: 'tent_and_awning_shops',
    code: '5998',
  },
  {
    label: t(i18n)`Testing Laboratories`,
    short: 'testing_laboratories',
    code: '8734',
  },
  {
    label: t(i18n)`Theatrical Ticket Agencies`,
    short: 'theatrical_ticket_agencies',
    code: '7922',
  },
  {
    label: t(i18n)`Timeshares`,
    short: 'timeshares',
    code: '7012',
  },
  {
    label: t(i18n)`Tire Retreading and Repair`,
    short: 'tire_retreading_and_repair',
    code: '7534',
  },
  {
    label: t(i18n)`Tolls/Bridge Fees`,
    short: 'tolls_bridge_fees',
    code: '4784',
  },
  {
    label: t(i18n)`Tourist Attractions and Exhibits`,
    short: 'tourist_attractions_and_exhibits',
    code: '7991',
  },
  {
    label: t(i18n)`Towing Services`,
    short: 'towing_services',
    code: '7549',
  },
  {
    label: t(i18n)`Trailer Parks, Campgrounds`,
    short: 'trailer_parks_campgrounds',
    code: '7033',
  },
  {
    label: t(i18n)`Transportation Services (Not Elsewhere Classified)`,
    short: 'transportation_services',
    code: '4789',
  },
  {
    label: t(i18n)`Travel Agencies, Tour Operators`,
    short: 'travel_agencies_tour_operators',
    code: '4722',
  },
  {
    label: t(i18n)`Truck StopIteration`,
    short: 'truck_stop_iteration',
    code: '7511',
  },
  {
    label: t(i18n)`Truck/Utility Trailer Rentals`,
    short: 'truck_utility_trailer_rentals',
    code: '7513',
  },
  {
    label: t(i18n)`Typesetting, Plate Making, and Related Services`,
    short: 'typesetting_plate_making_and_related_services',
    code: '2791',
  },
  {
    label: t(i18n)`Typewriter Stores`,
    short: 'typewriter_stores',
    code: '5978',
  },
  {
    label: t(i18n)`U.S. Federal Government Agencies or Departments`,
    short: 'u_s_federal_government_agencies_or_departments',
    code: '9405',
  },
  {
    label: t(i18n)`Uniforms, Commercial Clothing`,
    short: 'uniforms_commercial_clothing',
    code: '5137',
  },
  {
    label: t(i18n)`Used Merchandise and Secondhand Stores`,
    short: 'used_merchandise_and_secondhand_stores',
    code: '5931',
  },
  {
    label: t(i18n)`Utilities`,
    short: 'utilities',
    code: '4900',
  },
  {
    label: t(i18n)`Variety Stores`,
    short: 'variety_stores',
    code: '5331',
  },
  {
    label: t(i18n)`Veterinary Services`,
    short: 'veterinary_services',
    code: '0742',
  },
  {
    label: t(i18n)`Video Amusement Game Supplies`,
    short: 'video_amusement_game_supplies',
    code: '7993',
  },
  {
    label: t(i18n)`Video Game Arcades`,
    short: 'video_game_arcades',
    code: '7994',
  },
  {
    label: t(i18n)`Video Tape Rental Stores`,
    short: 'video_tape_rental_stores',
    code: '7841',
  },
  {
    label: t(i18n)`Vocational/Trade Schools`,
    short: 'vocational_trade_schools',
    code: '8249',
  },
  {
    label: t(i18n)`Watch/Jewelry Repair`,
    short: 'watch_jewelry_repair',
    code: '7631',
  },
  {
    label: t(i18n)`Welding Repair`,
    short: 'welding_repair',
    code: '7692',
  },
  {
    label: t(i18n)`Wholesale Clubs`,
    short: 'wholesale_clubs',
    code: '5300',
  },
  {
    label: t(i18n)`Wig and Toupee Stores`,
    short: 'wig_and_toupee_stores',
    code: '5698',
  },
  {
    label: t(i18n)`Wires, Money Orders`,
    short: 'wires_money_orders',
    code: '4829',
  },
  {
    label: t(i18n)`Womens Accessory and Specialty Shops`,
    short: 'womens_accessory_and_specialty_shops',
    code: '5631',
  },
  {
    label: t(i18n)`Womens Ready-To-Wear Stores`,
    short: 'womens_ready_to_wear_stores',
    code: '5621',
  },
  {
    label: t(i18n)`Wrecking and Salvage Yards`,
    short: 'wrecking_and_salvage_yards',
    code: '5935',
  },
];
