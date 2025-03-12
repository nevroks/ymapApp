export type filtersType = {
  category: string[] | []
  tube: string[] | [] //Метро
  placeState: string[] | [] //Состояние
  placeReadiness: string[] | [] //Строительная готовность
  placeArea: string[] | []  //Район
  placeSpace: {
    min: number
    max: number
  }, //Площадь
  priceRange: {
    min: number
    max: number
  }
}

export type placeMarkGeometryCoordinatesType = [number, number]