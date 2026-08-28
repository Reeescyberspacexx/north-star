// data/mockOrders.js
// Task: Mock order database (owner: Alphonce)
//
// This is our fake "database" for the MVP. In a real system this would
// live in Postgres/Mongo/etc, but for a 5-day prototype an in-memory
// array is enough to prove the whole flow works end to end.
//
// 10 seed customer accounts, 120 orders spread across them with
// realistically mixed statuses (some still preparing, some in transit,
// some delivered recently, some delivered long enough ago that their
// return window has expired) — this is what actually demonstrates the
// support team's real problem: a high volume of repetitive tickets,
// not just one or two orders.
//
// New accounts created through the signup page get added to this same
// in-memory list at runtime (see routes/auth.js) — they start with no
// orders of their own, same as a brand new customer would.

const mockOrders = [
  {
    "orderId": "NS-1001",
    "username": "felix",
    "item": "Cutting Board Set",
    "status": "arrived",
    "orderDate": "2026-05-14",
    "eta": "2026-05-18",
    "deliveredDate": "2026-05-18",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1002",
    "username": "irene",
    "item": "Electric Kettle - 1.7L",
    "status": "arrived",
    "orderDate": "2026-08-05",
    "eta": "2026-08-10",
    "deliveredDate": "2026-08-10",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1003",
    "username": "irene",
    "item": "Kitchen Knife Set",
    "status": "arrived",
    "orderDate": "2026-07-28",
    "eta": "2026-08-03",
    "deliveredDate": "2026-08-03",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1004",
    "username": "felix",
    "item": "Umbrella - Compact",
    "status": "preparing",
    "orderDate": "2026-08-12",
    "eta": "2026-08-20",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1005",
    "username": "esther",
    "item": "Backpack - Waterproof",
    "status": "in_transit",
    "orderDate": "2026-08-07",
    "eta": "2026-08-17",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1006",
    "username": "esther",
    "item": "Bluetooth Speaker - Blue",
    "status": "arrived",
    "orderDate": "2026-08-01",
    "eta": "2026-08-07",
    "deliveredDate": "2026-08-07",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1007",
    "username": "amina",
    "item": "Office Chair - Grey",
    "status": "preparing",
    "orderDate": "2026-08-11",
    "eta": "2026-08-28",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1008",
    "username": "hassan",
    "item": "Wallet - Leather",
    "status": "in_transit",
    "orderDate": "2026-08-06",
    "eta": "2026-08-16",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1009",
    "username": "james",
    "item": "Table Lamp - Brass",
    "status": "in_transit",
    "orderDate": "2026-08-08",
    "eta": "2026-08-16",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1010",
    "username": "hassan",
    "item": "Ceramic Mug Set",
    "status": "arrived",
    "orderDate": "2026-07-24",
    "eta": "2026-07-29",
    "deliveredDate": "2026-07-29",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1011",
    "username": "grace",
    "item": "Laptop Stand - Aluminum",
    "status": "preparing",
    "orderDate": "2026-08-12",
    "eta": "2026-08-22",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1012",
    "username": "amina",
    "item": "Backpack - Waterproof",
    "status": "arrived",
    "orderDate": "2026-08-04",
    "eta": "2026-08-10",
    "deliveredDate": "2026-08-10",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1013",
    "username": "david",
    "item": "Desk Lamp - Warm White",
    "status": "in_transit",
    "orderDate": "2026-08-10",
    "eta": "2026-08-15",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1014",
    "username": "amina",
    "item": "Coffee Maker - 1.2L",
    "status": "arrived",
    "orderDate": "2026-07-22",
    "eta": "2026-07-26",
    "deliveredDate": "2026-07-26",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1015",
    "username": "amina",
    "item": "Wallet - Leather",
    "status": "preparing",
    "orderDate": "2026-08-13",
    "eta": "2026-08-21",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1016",
    "username": "amina",
    "item": "Bluetooth Speaker - Blue",
    "status": "preparing",
    "orderDate": "2026-08-13",
    "eta": "2026-08-19",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1017",
    "username": "felix",
    "item": "Wireless Mouse",
    "status": "in_transit",
    "orderDate": "2026-08-07",
    "eta": "2026-08-16",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1018",
    "username": "david",
    "item": "Cutting Board Set",
    "status": "preparing",
    "orderDate": "2026-08-13",
    "eta": "2026-08-23",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1019",
    "username": "amina",
    "item": "Backpack - Waterproof",
    "status": "in_transit",
    "orderDate": "2026-08-07",
    "eta": "2026-08-19",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1020",
    "username": "david",
    "item": "Kitchen Knife Set",
    "status": "arrived",
    "orderDate": "2026-07-31",
    "eta": "2026-08-05",
    "deliveredDate": "2026-08-05",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1021",
    "username": "james",
    "item": "Wall Clock - Minimalist",
    "status": "preparing",
    "orderDate": "2026-08-13",
    "eta": "2026-08-22",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1022",
    "username": "irene",
    "item": "Picture Frame - A4",
    "status": "arrived",
    "orderDate": "2026-06-11",
    "eta": "2026-06-18",
    "deliveredDate": "2026-06-18",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1023",
    "username": "amina",
    "item": "Yoga Mat - Purple",
    "status": "arrived",
    "orderDate": "2026-07-19",
    "eta": "2026-07-23",
    "deliveredDate": "2026-07-23",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1024",
    "username": "brian",
    "item": "Picture Frame - A4",
    "status": "in_transit",
    "orderDate": "2026-08-09",
    "eta": "2026-08-16",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1025",
    "username": "carol",
    "item": "Phone Case - Clear",
    "status": "preparing",
    "orderDate": "2026-08-13",
    "eta": "2026-08-22",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1026",
    "username": "esther",
    "item": "Sunglasses - Polarized",
    "status": "in_transit",
    "orderDate": "2026-08-08",
    "eta": "2026-08-19",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1027",
    "username": "brian",
    "item": "Sunglasses - Polarized",
    "status": "in_transit",
    "orderDate": "2026-08-10",
    "eta": "2026-08-16",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1028",
    "username": "grace",
    "item": "Umbrella - Compact",
    "status": "preparing",
    "orderDate": "2026-08-13",
    "eta": "2026-08-19",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1029",
    "username": "carol",
    "item": "Office Chair - Grey",
    "status": "in_transit",
    "orderDate": "2026-08-08",
    "eta": "2026-08-17",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1030",
    "username": "felix",
    "item": "Ceramic Mug Set",
    "status": "arrived",
    "orderDate": "2026-07-26",
    "eta": "2026-08-02",
    "deliveredDate": "2026-08-02",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1031",
    "username": "david",
    "item": "Water Bottle - 1L Steel",
    "status": "preparing",
    "orderDate": "2026-08-12",
    "eta": "2026-08-19",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1032",
    "username": "james",
    "item": "Phone Case - Clear",
    "status": "arrived",
    "orderDate": "2026-07-17",
    "eta": "2026-07-20",
    "deliveredDate": "2026-07-20",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1033",
    "username": "esther",
    "item": "Bookshelf - 5 Tier",
    "status": "in_transit",
    "orderDate": "2026-08-10",
    "eta": "2026-08-16",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1034",
    "username": "grace",
    "item": "Office Chair - Grey",
    "status": "in_transit",
    "orderDate": "2026-08-09",
    "eta": "2026-08-20",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1035",
    "username": "amina",
    "item": "Bookshelf - 5 Tier",
    "status": "arrived",
    "orderDate": "2026-07-19",
    "eta": "2026-07-23",
    "deliveredDate": "2026-07-23",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1036",
    "username": "david",
    "item": "Wireless Mouse",
    "status": "arrived",
    "orderDate": "2026-07-15",
    "eta": "2026-07-20",
    "deliveredDate": "2026-07-20",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1037",
    "username": "felix",
    "item": "Table Lamp - Brass",
    "status": "in_transit",
    "orderDate": "2026-08-09",
    "eta": "2026-08-20",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1038",
    "username": "brian",
    "item": "Kitchen Knife Set",
    "status": "preparing",
    "orderDate": "2026-08-13",
    "eta": "2026-08-24",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1039",
    "username": "brian",
    "item": "Laptop Stand - Aluminum",
    "status": "in_transit",
    "orderDate": "2026-08-07",
    "eta": "2026-08-18",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1040",
    "username": "hassan",
    "item": "Running Shoes - Size 42",
    "status": "arrived",
    "orderDate": "2026-07-17",
    "eta": "2026-07-22",
    "deliveredDate": "2026-07-22",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1041",
    "username": "james",
    "item": "Running Shoes - Size 42",
    "status": "arrived",
    "orderDate": "2026-07-13",
    "eta": "2026-07-20",
    "deliveredDate": "2026-07-20",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1042",
    "username": "amina",
    "item": "Cutting Board Set",
    "status": "arrived",
    "orderDate": "2026-06-07",
    "eta": "2026-06-13",
    "deliveredDate": "2026-06-13",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1043",
    "username": "irene",
    "item": "Umbrella - Compact",
    "status": "arrived",
    "orderDate": "2026-07-31",
    "eta": "2026-08-04",
    "deliveredDate": "2026-08-04",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1044",
    "username": "david",
    "item": "Bluetooth Speaker - Blue",
    "status": "arrived",
    "orderDate": "2026-05-23",
    "eta": "2026-05-28",
    "deliveredDate": "2026-05-28",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1045",
    "username": "brian",
    "item": "Backpack - Waterproof",
    "status": "arrived",
    "orderDate": "2026-07-22",
    "eta": "2026-07-27",
    "deliveredDate": "2026-07-27",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1046",
    "username": "irene",
    "item": "Bookshelf - 5 Tier",
    "status": "arrived",
    "orderDate": "2026-08-06",
    "eta": "2026-08-13",
    "deliveredDate": "2026-08-13",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1047",
    "username": "amina",
    "item": "Picture Frame - A4",
    "status": "in_transit",
    "orderDate": "2026-08-10",
    "eta": "2026-08-17",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1048",
    "username": "brian",
    "item": "Wireless Mouse",
    "status": "preparing",
    "orderDate": "2026-08-11",
    "eta": "2026-08-23",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1049",
    "username": "amina",
    "item": "Sunglasses - Polarized",
    "status": "preparing",
    "orderDate": "2026-08-11",
    "eta": "2026-08-27",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1050",
    "username": "james",
    "item": "Mechanical Keyboard",
    "status": "arrived",
    "orderDate": "2026-05-29",
    "eta": "2026-06-04",
    "deliveredDate": "2026-06-04",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1051",
    "username": "james",
    "item": "Wireless Earbuds - Black",
    "status": "arrived",
    "orderDate": "2026-06-16",
    "eta": "2026-06-22",
    "deliveredDate": "2026-06-22",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1052",
    "username": "brian",
    "item": "Yoga Mat - Purple",
    "status": "arrived",
    "orderDate": "2026-07-17",
    "eta": "2026-07-21",
    "deliveredDate": "2026-07-21",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1053",
    "username": "esther",
    "item": "Bookshelf - 5 Tier",
    "status": "preparing",
    "orderDate": "2026-08-11",
    "eta": "2026-08-20",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1054",
    "username": "david",
    "item": "Backpack - Waterproof",
    "status": "in_transit",
    "orderDate": "2026-08-07",
    "eta": "2026-08-16",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1055",
    "username": "brian",
    "item": "Storage Bins - Set of 3",
    "status": "arrived",
    "orderDate": "2026-07-29",
    "eta": "2026-08-02",
    "deliveredDate": "2026-08-02",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1056",
    "username": "brian",
    "item": "Umbrella - Compact",
    "status": "preparing",
    "orderDate": "2026-08-13",
    "eta": "2026-08-23",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1057",
    "username": "grace",
    "item": "Backpack - Waterproof",
    "status": "arrived",
    "orderDate": "2026-07-30",
    "eta": "2026-08-06",
    "deliveredDate": "2026-08-06",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1058",
    "username": "felix",
    "item": "Coffee Maker - 1.2L",
    "status": "arrived",
    "orderDate": "2026-07-28",
    "eta": "2026-08-04",
    "deliveredDate": "2026-08-04",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1059",
    "username": "irene",
    "item": "Wireless Mouse",
    "status": "arrived",
    "orderDate": "2026-06-06",
    "eta": "2026-06-10",
    "deliveredDate": "2026-06-10",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1060",
    "username": "david",
    "item": "Umbrella - Compact",
    "status": "arrived",
    "orderDate": "2026-07-13",
    "eta": "2026-07-20",
    "deliveredDate": "2026-07-20",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1061",
    "username": "irene",
    "item": "Air Fryer - 4L",
    "status": "in_transit",
    "orderDate": "2026-08-11",
    "eta": "2026-08-17",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1062",
    "username": "grace",
    "item": "Yoga Mat - Purple",
    "status": "arrived",
    "orderDate": "2026-08-02",
    "eta": "2026-08-09",
    "deliveredDate": "2026-08-09",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1063",
    "username": "grace",
    "item": "Mechanical Keyboard",
    "status": "arrived",
    "orderDate": "2026-07-28",
    "eta": "2026-08-04",
    "deliveredDate": "2026-08-04",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1064",
    "username": "grace",
    "item": "Wall Clock - Minimalist",
    "status": "arrived",
    "orderDate": "2026-07-26",
    "eta": "2026-08-02",
    "deliveredDate": "2026-08-02",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1065",
    "username": "david",
    "item": "Kitchen Knife Set",
    "status": "in_transit",
    "orderDate": "2026-08-10",
    "eta": "2026-08-18",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1066",
    "username": "esther",
    "item": "Table Lamp - Brass",
    "status": "arrived",
    "orderDate": "2026-07-15",
    "eta": "2026-07-20",
    "deliveredDate": "2026-07-20",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1067",
    "username": "esther",
    "item": "Standing Desk Converter",
    "status": "arrived",
    "orderDate": "2026-07-17",
    "eta": "2026-07-20",
    "deliveredDate": "2026-07-20",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1068",
    "username": "hassan",
    "item": "Backpack - Waterproof",
    "status": "in_transit",
    "orderDate": "2026-08-06",
    "eta": "2026-08-15",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1069",
    "username": "brian",
    "item": "Running Shoes - Size 42",
    "status": "arrived",
    "orderDate": "2026-07-19",
    "eta": "2026-07-25",
    "deliveredDate": "2026-07-25",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1070",
    "username": "david",
    "item": "Electric Kettle - 1.7L",
    "status": "preparing",
    "orderDate": "2026-08-11",
    "eta": "2026-08-21",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1071",
    "username": "grace",
    "item": "Desk Lamp - Warm White",
    "status": "preparing",
    "orderDate": "2026-08-12",
    "eta": "2026-08-21",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1072",
    "username": "brian",
    "item": "Throw Blanket - Grey",
    "status": "in_transit",
    "orderDate": "2026-08-07",
    "eta": "2026-08-18",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1073",
    "username": "david",
    "item": "Sunglasses - Polarized",
    "status": "in_transit",
    "orderDate": "2026-08-07",
    "eta": "2026-08-17",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1074",
    "username": "esther",
    "item": "Kitchen Knife Set",
    "status": "arrived",
    "orderDate": "2026-07-30",
    "eta": "2026-08-03",
    "deliveredDate": "2026-08-03",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1075",
    "username": "carol",
    "item": "Bookshelf - 5 Tier",
    "status": "arrived",
    "orderDate": "2026-06-14",
    "eta": "2026-06-19",
    "deliveredDate": "2026-06-19",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1076",
    "username": "esther",
    "item": "Yoga Mat - Purple",
    "status": "arrived",
    "orderDate": "2026-07-30",
    "eta": "2026-08-02",
    "deliveredDate": "2026-08-02",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1077",
    "username": "esther",
    "item": "Bath Towel Set",
    "status": "in_transit",
    "orderDate": "2026-08-07",
    "eta": "2026-08-15",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1078",
    "username": "felix",
    "item": "Throw Blanket - Grey",
    "status": "arrived",
    "orderDate": "2026-05-24",
    "eta": "2026-05-29",
    "deliveredDate": "2026-05-29",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1079",
    "username": "carol",
    "item": "Water Bottle - 1L Steel",
    "status": "arrived",
    "orderDate": "2026-06-26",
    "eta": "2026-07-03",
    "deliveredDate": "2026-07-03",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1080",
    "username": "brian",
    "item": "Plant Pot - Ceramic",
    "status": "preparing",
    "orderDate": "2026-08-13",
    "eta": "2026-08-25",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1081",
    "username": "brian",
    "item": "Coffee Maker - 1.2L",
    "status": "arrived",
    "orderDate": "2026-07-19",
    "eta": "2026-07-25",
    "deliveredDate": "2026-07-25",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1082",
    "username": "carol",
    "item": "Wireless Mouse",
    "status": "arrived",
    "orderDate": "2026-07-29",
    "eta": "2026-08-01",
    "deliveredDate": "2026-08-01",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1083",
    "username": "grace",
    "item": "Throw Blanket - Grey",
    "status": "arrived",
    "orderDate": "2026-05-25",
    "eta": "2026-05-28",
    "deliveredDate": "2026-05-28",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1084",
    "username": "hassan",
    "item": "Ceramic Mug Set",
    "status": "arrived",
    "orderDate": "2026-05-29",
    "eta": "2026-06-03",
    "deliveredDate": "2026-06-03",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1085",
    "username": "amina",
    "item": "Office Chair - Grey",
    "status": "arrived",
    "orderDate": "2026-06-04",
    "eta": "2026-06-10",
    "deliveredDate": "2026-06-10",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1086",
    "username": "brian",
    "item": "Office Chair - Grey",
    "status": "arrived",
    "orderDate": "2026-07-31",
    "eta": "2026-08-05",
    "deliveredDate": "2026-08-05",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1087",
    "username": "james",
    "item": "Bath Towel Set",
    "status": "in_transit",
    "orderDate": "2026-08-10",
    "eta": "2026-08-16",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1088",
    "username": "esther",
    "item": "Plant Pot - Ceramic",
    "status": "arrived",
    "orderDate": "2026-07-25",
    "eta": "2026-07-30",
    "deliveredDate": "2026-07-30",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1089",
    "username": "carol",
    "item": "Picture Frame - A4",
    "status": "arrived",
    "orderDate": "2026-07-17",
    "eta": "2026-07-23",
    "deliveredDate": "2026-07-23",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1090",
    "username": "brian",
    "item": "Storage Bins - Set of 3",
    "status": "arrived",
    "orderDate": "2026-07-23",
    "eta": "2026-07-27",
    "deliveredDate": "2026-07-27",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1091",
    "username": "hassan",
    "item": "Wall Clock - Minimalist",
    "status": "in_transit",
    "orderDate": "2026-08-07",
    "eta": "2026-08-18",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1092",
    "username": "james",
    "item": "Air Fryer - 4L",
    "status": "arrived",
    "orderDate": "2026-05-27",
    "eta": "2026-06-03",
    "deliveredDate": "2026-06-03",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1093",
    "username": "irene",
    "item": "Backpack - Waterproof",
    "status": "preparing",
    "orderDate": "2026-08-11",
    "eta": "2026-08-23",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1094",
    "username": "david",
    "item": "Wall Clock - Minimalist",
    "status": "in_transit",
    "orderDate": "2026-08-08",
    "eta": "2026-08-16",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1095",
    "username": "felix",
    "item": "Electric Kettle - 1.7L",
    "status": "preparing",
    "orderDate": "2026-08-11",
    "eta": "2026-08-22",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1096",
    "username": "esther",
    "item": "Wallet - Leather",
    "status": "arrived",
    "orderDate": "2026-05-11",
    "eta": "2026-05-16",
    "deliveredDate": "2026-05-16",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1097",
    "username": "carol",
    "item": "Phone Case - Clear",
    "status": "arrived",
    "orderDate": "2026-07-23",
    "eta": "2026-07-26",
    "deliveredDate": "2026-07-26",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1098",
    "username": "carol",
    "item": "Phone Case - Clear",
    "status": "in_transit",
    "orderDate": "2026-08-10",
    "eta": "2026-08-18",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1099",
    "username": "brian",
    "item": "Standing Desk Converter",
    "status": "preparing",
    "orderDate": "2026-08-13",
    "eta": "2026-08-25",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1100",
    "username": "felix",
    "item": "Phone Case - Clear",
    "status": "preparing",
    "orderDate": "2026-08-13",
    "eta": "2026-08-23",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1101",
    "username": "james",
    "item": "Bluetooth Speaker - Blue",
    "status": "preparing",
    "orderDate": "2026-08-11",
    "eta": "2026-08-24",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1102",
    "username": "amina",
    "item": "Storage Bins - Set of 3",
    "status": "in_transit",
    "orderDate": "2026-08-10",
    "eta": "2026-08-16",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1103",
    "username": "amina",
    "item": "Desk Lamp - Warm White",
    "status": "arrived",
    "orderDate": "2026-06-18",
    "eta": "2026-06-21",
    "deliveredDate": "2026-06-21",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1104",
    "username": "david",
    "item": "Desk Lamp - Warm White",
    "status": "preparing",
    "orderDate": "2026-08-12",
    "eta": "2026-08-21",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1105",
    "username": "felix",
    "item": "Water Bottle - 1L Steel",
    "status": "in_transit",
    "orderDate": "2026-08-09",
    "eta": "2026-08-17",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1106",
    "username": "grace",
    "item": "Wireless Earbuds - Black",
    "status": "in_transit",
    "orderDate": "2026-08-06",
    "eta": "2026-08-15",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1107",
    "username": "james",
    "item": "Standing Desk Converter",
    "status": "preparing",
    "orderDate": "2026-08-11",
    "eta": "2026-08-20",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1108",
    "username": "esther",
    "item": "Office Chair - Grey",
    "status": "preparing",
    "orderDate": "2026-08-11",
    "eta": "2026-08-25",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1109",
    "username": "irene",
    "item": "Office Chair - Grey",
    "status": "arrived",
    "orderDate": "2026-08-07",
    "eta": "2026-08-11",
    "deliveredDate": "2026-08-11",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1110",
    "username": "irene",
    "item": "Laptop Stand - Aluminum",
    "status": "arrived",
    "orderDate": "2026-07-24",
    "eta": "2026-07-27",
    "deliveredDate": "2026-07-27",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1111",
    "username": "grace",
    "item": "Laptop Stand - Aluminum",
    "status": "preparing",
    "orderDate": "2026-08-12",
    "eta": "2026-08-21",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1112",
    "username": "carol",
    "item": "Coffee Maker - 1.2L",
    "status": "arrived",
    "orderDate": "2026-07-27",
    "eta": "2026-07-31",
    "deliveredDate": "2026-07-31",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1113",
    "username": "amina",
    "item": "Coffee Maker - 1.2L",
    "status": "in_transit",
    "orderDate": "2026-08-07",
    "eta": "2026-08-19",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1114",
    "username": "brian",
    "item": "Office Chair - Grey",
    "status": "in_transit",
    "orderDate": "2026-08-07",
    "eta": "2026-08-17",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1115",
    "username": "hassan",
    "item": "Wireless Mouse",
    "status": "arrived",
    "orderDate": "2026-07-22",
    "eta": "2026-07-27",
    "deliveredDate": "2026-07-27",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1116",
    "username": "james",
    "item": "Bath Towel Set",
    "status": "arrived",
    "orderDate": "2026-07-24",
    "eta": "2026-07-31",
    "deliveredDate": "2026-07-31",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1117",
    "username": "amina",
    "item": "Electric Kettle - 1.7L",
    "status": "in_transit",
    "orderDate": "2026-08-06",
    "eta": "2026-08-18",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1118",
    "username": "esther",
    "item": "Mechanical Keyboard",
    "status": "arrived",
    "orderDate": "2026-08-09",
    "eta": "2026-08-12",
    "deliveredDate": "2026-08-12",
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1119",
    "username": "james",
    "item": "Wireless Earbuds - Black",
    "status": "in_transit",
    "orderDate": "2026-08-09",
    "eta": "2026-08-20",
    "deliveredDate": null,
    "returnWindowDays": 30
  },
  {
    "orderId": "NS-1120",
    "username": "david",
    "item": "Standing Desk Converter",
    "status": "arrived",
    "orderDate": "2026-06-05",
    "eta": "2026-06-09",
    "deliveredDate": "2026-06-09",
    "returnWindowDays": 30
  }
];

// Mock login accounts (kept alongside orders since this is a mock DB,
// not a real auth system). Passwords are plaintext ONLY because this
// is a throwaway class prototype — never do this in a real product.
const mockUsers = [
  {
    "username": "amina",
    "password": "password123",
    "name": "Amina Yusuf"
  },
  {
    "username": "brian",
    "password": "password123",
    "name": "Brian Otieno"
  },
  {
    "username": "carol",
    "password": "password123",
    "name": "Carol Wanjiru"
  },
  {
    "username": "david",
    "password": "password123",
    "name": "David Kamau"
  },
  {
    "username": "esther",
    "password": "password123",
    "name": "Esther Achieng"
  },
  {
    "username": "felix",
    "password": "password123",
    "name": "Felix Mwangi"
  },
  {
    "username": "grace",
    "password": "password123",
    "name": "Grace Njeri"
  },
  {
    "username": "hassan",
    "password": "password123",
    "name": "Hassan Ali"
  },
  {
    "username": "irene",
    "password": "password123",
    "name": "Irene Wambui"
  },
  {
    "username": "james",
    "password": "password123",
    "name": "James Odhiambo"
  }
];

function findUser(username, password) {
  return mockUsers.find(
    (u) => u.username === username && u.password === password
  );
}

function usernameExists(username) {
  return mockUsers.some((u) => u.username === username);
}

function createUser({ username, password, name }) {
  const user = { username, password, name };
  mockUsers.push(user);
  return user;
}

function getOrdersByUsername(username) {
  return mockOrders.filter((o) => o.username === username);
}

function getOrderById(orderId) {
  return mockOrders.find((o) => o.orderId === orderId);
}

module.exports = {
  mockOrders,
  mockUsers,
  findUser,
  usernameExists,
  createUser,
  getOrdersByUsername,
  getOrderById,
};
