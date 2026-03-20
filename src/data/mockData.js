export const mockComplaints = [
  {
    id: "IND-2026-04821",
    category: "Roads",
    title: "Large pothole causing traffic",
    description: "There is a large pothole near the crossing that has been causing traffic jams and minor accidents.",
    location: "Lajpat Nagar",
    lat: 28.5677,
    lng: 77.2433,
    status: "Pending",
    upvotes: 42,
    comments: 5,
    timestamp: "2 hours ago",
    user: { name: "Rahul S.", avatar: "RS" },
    escalationLevel: "L1"
  },
  {
    id: "IND-2026-04822",
    category: "Garbage",
    title: "Garbage pile uncollected",
    description: "Garbage has not been collected for 4 days here. It is causing a foul smell.",
    location: "Karol Bagh",
    lat: 28.6517,
    lng: 77.1901,
    status: "In Progress",
    upvotes: 120,
    comments: 14,
    timestamp: "1 day ago",
    user: { name: "Anjali Gupta", avatar: "AG" },
    escalationLevel: "L2"
  },
  {
    id: "IND-2026-04823",
    category: "Water",
    title: "Water pipeline leak",
    description: "Fresh water is leaking rapidly onto the street since morning.",
    location: "Dwarka",
    lat: 28.5823,
    lng: 77.0500,
    status: "Resolved",
    upvotes: 15,
    comments: 2,
    timestamp: "3 days ago",
    user: { name: "Anonymous Citizen", avatar: "AC" },
    escalationLevel: "L1"
  },
  {
    id: "IND-2026-04824",
    category: "Electricity",
    title: "Streetlight not working",
    description: "The streetlights on the main road are completely out. Very unsafe at night.",
    location: "Rohini",
    lat: 28.7041,
    lng: 77.1025,
    status: "Assigned",
    upvotes: 33,
    comments: 1,
    timestamp: "5 hours ago",
    user: { name: "Vikas K.", avatar: "VK" },
    escalationLevel: "L1"
  },
  {
    id: "IND-2026-04825",
    category: "Parks",
    title: "Broken swings in park",
    description: "Children's swings in the community park are broken and dangerous.",
    location: "Saket",
    lat: 28.5246,
    lng: 77.2114,
    status: "Under Inspection",
    upvotes: 89,
    comments: 8,
    timestamp: "2 days ago",
    user: { name: "Priya Sharma", avatar: "PS" },
    escalationLevel: "L1"
  },
  {
    id: "IND-2026-04826",
    category: "Safety",
    title: "Open manhole",
    description: "Dangerous open manhole in the middle of the walking path.",
    location: "Janakpuri",
    lat: 28.6219,
    lng: 77.0878,
    status: "Pending",
    upvotes: 210,
    comments: 24,
    timestamp: "1 hour ago",
    user: { name: "Amit T.", avatar: "AT" },
    escalationLevel: "L3"
  },
  {
    id: "IND-2026-04827",
    category: "Roads",
    title: "Broken pavement",
    description: "The pavement has caved in, dangerous for pedestrians.",
    location: "Connaught Place",
    lat: 28.6304,
    lng: 77.2177,
    status: "Resolved",
    upvotes: 55,
    comments: 3,
    timestamp: "4 days ago",
    user: { name: "Meera R.", avatar: "MR" },
    escalationLevel: "L1"
  },
  {
    id: "IND-2026-04828",
    category: "Garbage",
    title: "Debris dumped by builders",
    description: "Construction debris abandoned on the side of the road.",
    location: "Pitampura",
    lat: 28.6989,
    lng: 77.1384,
    status: "Pending",
    upvotes: 18,
    comments: 1,
    timestamp: "8 hours ago",
    user: { name: "Rohit D.", avatar: "RD" },
    escalationLevel: "L1"
  }
];

export const officers = [
  { id: "OFF-101", name: "Officer Sharma", ward: "North Delhi - Ward 14", score: 87, designation: "Junior Engineer", resolutionTime: "18 hrs" }
];

export const citizens = [
  { rank: 1, name: "Arjun P.", points: 2450, badge: "🏆" },
  { rank: 2, name: "Sneha V.", points: 1980, badge: "🥇" },
  { rank: 3, name: "Rahul S.", points: 1540, badge: "🥇" },
  { rank: 4, name: "Neha M.", points: 1240, badge: "🥈" },
  { rank: 5, name: "Amit T.", points: 950, badge: "🥈" },
];

export const rewards = [
  { id: 1, title: "Metro Smart Card", pts: 200, icon: "🚇" },
  { id: 2, title: "Mobile Recharge ₹50", pts: 150, icon: "📱" },
  { id: 3, title: "Uber Ride 20% Off", pts: 350, icon: "🛵" },
  { id: 4, title: "Swiggy ₹100 Coupon", pts: 400, icon: "🍔" },
  { id: 5, title: "Movie Ticket", pts: 600, icon: "🎬" },
  { id: 6, title: "Mystery Reward", pts: 1000, icon: "🎁" },
];
