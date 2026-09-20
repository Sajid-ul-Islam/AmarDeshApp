// Bangladesh Divisions and Districts
// Source: Bangladesh Geographical Data

export interface Division {
  id: string;
  name: string;
  nameEn: string;
  districts: District[];
}

export interface District {
  id: string;
  name: string;
  nameEn: string;
}

export const divisions: Division[] = [
  {
    id: 'dhaka',
    name: 'ঢাকা',
    nameEn: 'Dhaka',
    districts: [
      { id: 'dhaka', name: 'ঢাকা', nameEn: 'Dhaka' },
      { id: 'faridpur', name: 'ফরিদপুর', nameEn: 'Faridpur' },
      { id: 'gazipur', name: 'গাজীপুর', nameEn: 'Gazipur' },
      { id: 'gopalganj', name: 'গোপালগঞ্জ', nameEn: 'Gopalganj' },
      { id: 'jamalpur', name: 'জামালপুর', nameEn: 'Jamalpur' },
      { id: 'kishoreganj', name: 'কিশোরগঞ্জ', nameEn: 'Kishoreganj' },
      { id: 'madaripur', name: 'মাদারীপুর', nameEn: 'Madaripur' },
      { id: 'manikganj', name: 'মানিকগঞ্জ', nameEn: 'Manikganj' },
      { id: 'munshiganj', name: 'মুন্সিগঞ্জ', nameEn: 'Munshiganj' },
      { id: 'mymensingh', name: 'ময়মনসিংহ', nameEn: 'Mymensingh' },
      { id: 'narayanganj', name: 'নারায়ণগঞ্জ', nameEn: 'Narayanganj' },
      { id: 'narsingdi', name: 'নরসিংদী', nameEn: 'Narsingdi' },
      { id: 'netrokona', name: 'নেত্রকোণা', nameEn: 'Netrokona' },
      { id: 'rajbari', name: 'রাজবাড়ী', nameEn: 'Rajbari' },
      { id: 'shariatpur', name: 'শরীয়তপুর', nameEn: 'Shariatpur' },
      { id: 'sherpur', name: 'শেরপুর', nameEn: 'Sherpur' },
      { id: 'tangail', name: 'টাঙ্গাইল', nameEn: 'Tangail' },
    ],
  },
  {
    id: 'chattogram',
    name: 'চট্টগ্রাম',
    nameEn: 'Chattogram',
    districts: [
      { id: 'chattogram', name: 'চট্টগ্রাম', nameEn: 'Chattogram' },
      { id: 'coxs-bazar', name: 'কক্সবাজার', nameEn: "Cox's Bazar" },
      { id: 'bandarban', name: 'বান্দরবান', nameEn: 'Bandarban' },
      { id: 'brahmanbaria', name: 'ব্রাহ্মণবাড়িয়া', nameEn: 'Brahmanbaria' },
      { id: 'chandpur', name: 'চাঁদপুর', nameEn: 'Chandpur' },
      { id: 'cumilla', name: 'কুমিল্লা', nameEn: 'Cumilla' },
      { id: 'feni', name: 'ফেনী', nameEn: 'Feni' },
      { id: 'khagrachhari', name: 'খাগড়াছড়ি', nameEn: 'Khagrachhari' },
      { id: 'lakshmipur', name: 'লক্ষ্মীপুর', nameEn: 'Lakshmipur' },
      { id: 'noakhali', name: 'নোয়াখালী', nameEn: 'Noakhali' },
      { id: 'rangamati', name: 'রাঙামাটি', nameEn: 'Rangamati' },
    ],
  },
  {
    id: 'rajshahi',
    name: 'রাজশাহী',
    nameEn: 'Rajshahi',
    districts: [
      { id: 'rajshahi', name: 'রাজশাহী', nameEn: 'Rajshahi' },
      { id: 'bogura', name: 'বগুড়া', nameEn: 'Bogura' },
      { id: 'joypurhat', name: 'জয়পুরহাট', nameEn: 'Joypurhat' },
      { id: 'naogaon', name: 'নওগাঁ', nameEn: 'Naogaon' },
      { id: 'natore', name: 'নাটোর', nameEn: 'Natore' },
      { id: 'chapai-nawabganj', name: 'চাঁপাইনবাবগঞ্জ', nameEn: 'Chapai Nawabganj' },
      { id: 'pabna', name: 'পাবনা', nameEn: 'Pabna' },
      { id: 'sirajganj', name: 'সিরাজগঞ্জ', nameEn: 'Sirajganj' },
    ],
  },
  {
    id: 'khulna',
    name: 'খুলনা',
    nameEn: 'Khulna',
    districts: [
      { id: 'khulna', name: 'খুলনা', nameEn: 'Khulna' },
      { id: 'bagerhat', name: 'বাগেরহাট', nameEn: 'Bagerhat' },
      { id: 'chuadanga', name: 'চুয়াডাঙ্গা', nameEn: 'Chuadanga' },
      { id: 'jashore', name: 'যশোর', nameEn: 'Jashore' },
      { id: 'jhinaidah', name: 'ঝিনাইদহ', nameEn: 'Jhenaidah' },
      { id: 'kushtia', name: 'কুষ্টিয়া', nameEn: 'Kushtia' },
      { id: 'magura', name: 'মাগুরা', nameEn: 'Magura' },
      { id: 'meherpur', name: 'মেহেরপুর', nameEn: 'Meherpur' },
      { id: 'narail', name: 'নড়াইল', nameEn: 'Narail' },
      { id: 'satkhira', name: 'সাতক্ষীরা', nameEn: 'Satkhira' },
    ],
  },
  {
    id: 'barishal',
    name: 'বরিশাল',
    nameEn: 'Barishal',
    districts: [
      { id: 'barishal', name: 'বরিশাল', nameEn: 'Barishal' },
      { id: 'barguna', name: 'বরগুনা', nameEn: 'Barguna' },
      { id: 'bhola', name: 'ভোলা', nameEn: 'Bhola' },
      { id: 'jhalokathi', name: 'ঝালকাঠি', nameEn: 'Jhalokathi' },
      { id: 'patuakhali', name: 'পটুয়াখালী', nameEn: 'Patuakhali' },
      { id: 'pirojpur', name: 'পিরোজপুর', nameEn: 'Pirojpur' },
    ],
  },
  {
    id: 'sylhet',
    name: 'সিলেট',
    nameEn: 'Sylhet',
    districts: [
      { id: 'sylhet', name: 'সিলেট', nameEn: 'Sylhet' },
      { id: 'habiganj', name: 'হবিগঞ্জ', nameEn: 'Habiganj' },
      { id: 'moulvibazar', name: 'মৌলভীবাজার', nameEn: 'Moulvibazar' },
      { id: 'sunamganj', name: 'সুনামগঞ্জ', nameEn: 'Sunamganj' },
    ],
  },
  {
    id: 'rangpur',
    name: 'রংপুর',
    nameEn: 'Rangpur',
    districts: [
      { id: 'rangpur', name: 'রংপুর', nameEn: 'Rangpur' },
      { id: 'dinajpur', name: 'দিনাজপুর', nameEn: 'Dinajpur' },
      { id: 'gaibandha', name: 'গাইবান্ধা', nameEn: 'Gaibandha' },
      { id: 'kurigram', name: 'কুড়িগ্রাম', nameEn: 'Kurigram' },
      { id: 'lalmonirhat', name: 'লালমনিরহাট', nameEn: 'Lalmonirhat' },
      { id: 'nilphamari', name: 'নীলফামারী', nameEn: 'Nilphamari' },
      { id: 'panchagarh', name: 'পঞ্চগড়', nameEn: 'Panchagarh' },
      { id: 'thakurgaon', name: 'ঠাকুরগাঁও', nameEn: 'Thakurgaon' },
    ],
  },
  {
    id: 'mymensingh',
    name: 'ময়মনসিংহ',
    nameEn: 'Mymensingh',
    districts: [
      { id: 'mymensingh', name: 'ময়মনসিংহ', nameEn: 'Mymensingh' },
      { id: 'jamalpur', name: 'জামালপুর', nameEn: 'Jamalpur' },
      { id: 'netrokona', name: 'নেত্রকোণা', nameEn: 'Netrokona' },
      { id: 'sherpur', name: 'শেরপুর', nameEn: 'Sherpur' },
    ],
  },
];

// Helper function to find district by name
export function findDistrictByName(name: string): District | null {
  for (const division of divisions) {
    const district = division.districts.find(
      (d) => d.name === name || d.nameEn.toLowerCase() === name.toLowerCase()
    );
    if (district) return district;
  }
  return null;
}

// Helper function to get division for a district
export function getDivisionForDistrict(districtName: string): Division | null {
  for (const division of divisions) {
    if (division.districts.some((d) => d.name === districtName)) {
      return division;
    }
  }
  return null;
}
