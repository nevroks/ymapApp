import Navbar from "./components/Navbar/Navbar"
import styles from "./app.module.css"
import { useApi } from "./utils/hooks/useApi"
import { filterInitValues, } from "./utils/consts"

import { filtersType } from "./utils/types"
import useLocalStorage from "./utils/hooks/useLocalStorage"

import { Loader } from "./components/ui"
import Map from "./components/Map/Map"
import { useState } from "react"



function App() {
  const [filters, setFilters] = useLocalStorage<filtersType>('filters', filterInitValues)
  const[openSetings,setOpenSetings]=useState(false)


  const { getDataQuery } = useApi()
  const { data, isLoading, isError } = getDataQuery


  if (isLoading) {
    return <Loader />
  }
  if (isError) {
    return <h1>Error</h1>
  }
  return (
    <div className={styles["App-wrapper"]}>
      <Navbar
        categories={data!.categories}
        filters={filters}
        tubes={data!.filters.Метро}
        placeState={data!.filters.Состояние}
        placeReadiness={data!.filters["Строительная готовность"]}
        placeArea={data!.filters.Район}
        placeSpace={filters.placeSpace}
        priceRange={data!.priceRange}
        filtersPriceRange={filters.priceRange}
        setFilters={setFilters} 
        openSetings={openSetings}
        setOpenSetings={setOpenSetings}
        countData={data!.count}
        />
      <div className={styles["App-map-wrapper"]}>
        <Map
          filters={filters}
          data={data}
          isError={isError}
          isLoading={isLoading}
          setOpenSetings={setOpenSetings}
          openSetings={openSetings}
        />
      </div>

    </div>
  )
}


export default App
