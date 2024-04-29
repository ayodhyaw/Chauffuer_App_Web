export interface Amenitydto {
    id: number;
    name: string;
    amenityType: AmenityType;
    price: string;
  }
  enum AmenityType {
    Champagne = "Champagne",
    Snacks = "Snacks",
    Beer = "Beer",
  }