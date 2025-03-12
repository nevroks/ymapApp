import { filtersType } from "../types";

export const filterInitValues: filtersType = {
  category: [],
  tube: [],
  placeState: [],
  placeArea: [],
  placeReadiness: [],
  placeSpace: {
    min: 0,
    max: 5000
  },
  priceRange: {
    min: 0,
    max: 0
  }
}


