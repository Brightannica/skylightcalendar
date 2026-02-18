// Mock Events
export const MOCK_EVENTS = [
  { id: 1, title: 'Soccer Practice', start: new Date(new Date().setHours(16, 0)), end: new Date(new Date().setHours(17, 30)), allDay: false },
  { id: 2, title: 'Piano Lesson', start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(15, 0), end: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16, 0), allDay: false },
  { id: 3, title: 'Grocery Shopping', start: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(10, 0), end: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(11, 30), allDay: false },
  { id: 4, title: 'Date Night', start: new Date(new Date().setDate(new Date().getDate() + 3)).setHours(19, 0), end: new Date(new Date().setDate(new Date().getDate() + 3)).setHours(21, 0), allDay: false },
  { id: 5, title: 'Family Brunch', start: new Date(new Date().setDate(new Date().getDate() + 4)).setHours(11, 0), end: new Date(new Date().setDate(new Date().getDate() + 4)).setHours(13, 0), allDay: false },
];

// Mock Chores
export const MOCK_CHORES = [
  { id: 1, title: 'Load Dishwasher', assignee: 'Dad', completed: false, points: 5 },
  { id: 2, title: 'Walk the Dog', assignee: 'Mom', completed: true, points: 10 },
  { id: 3, title: 'Clean Room', assignee: 'Kids', completed: false, points: 15 },
  { id: 4, title: 'Take out Trash', assignee: 'Kids', completed: false, points: 5 },
  { id: 5, title: 'Water Plants', assignee: 'Mom', completed: false, points: 5 },
];

// Mock Meals
export const MOCK_MEALS = [
  { day: 'Monday', breakfast: 'Oatmeal', lunch: 'Sandwiches', dinner: 'Spaghetti Bolognese' },
  { day: 'Tuesday', breakfast: 'Pancakes', lunch: 'Salad', dinner: 'Tacos' },
  { day: 'Wednesday', breakfast: 'Cereal', lunch: 'Soup', dinner: 'Grilled Chicken & Veggies' },
  { day: 'Thursday', breakfast: 'Eggs & Toast', lunch: 'Leftovers', dinner: 'Pizza Night' },
  { day: 'Friday', breakfast: 'Smoothies', lunch: 'Wraps', dinner: 'Fish & Chips' },
  { day: 'Saturday', breakfast: 'Waffles', lunch: 'Burgers', dinner: 'Out to Eat' },
  { day: 'Sunday', breakfast: 'Bagels', lunch: 'Picnic', dinner: 'Roast Beef' },
];

// Mock Grocery List
export const MOCK_GROCERIES = [
  { id: 1, item: 'Milk', checked: false },
  { id: 2, item: 'Bread', checked: true },
  { id: 3, item: 'Eggs', checked: false },
  { id: 4, item: 'Bananas', checked: false },
  { id: 5, item: 'Cheese', checked: false },
  { id: 6, item: 'Coffee', checked: true },
];

// Mock Weather
export const MOCK_WEATHER = {
  temp: 72,
  condition: 'Sunny',
  high: 75,
  low: 65,
  humidity: 45,
  wind: 10,
};

// Mock Settings
export const MOCK_SETTINGS = {
  wifi: 'Home_WiFi_5G',
  brightness: 80,
  volume: 50,
  displayTimeout: 15, // minutes
  syncFrequency: 30, // minutes
};
