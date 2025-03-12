import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useState } from "react";
import { filtersType } from "../types";
import { DropdownOptionType } from "../../components/ui/RadioDropdown/types";

const useDropdownOptions = (initialOptions: DropdownOptionType[], filters: filtersType, setFilters: Dispatch<SetStateAction<filtersType>>, filterKey: keyof filtersType) => {
    const [dropdownOptions, setDropdownOptions] = useState(initialOptions)
    useLayoutEffect(() => {
        // @ts-ignore
        if (filters[filterKey].length) {
            setDropdownOptions(dropdownOptions.map(option => {
                if (filters[filterKey]) {
                    // @ts-ignore
                    if (filters[filterKey].includes(option.value)) {
                        return { ...option, selected: true }
                    }
                }
                return option
            }))
        }
    }, [])
    useEffect(() => {
        const categoryFilterValue = dropdownOptions.filter(option => option.selected).map(option => option.value)
        setFilters(prev => ({ ...prev, [filterKey]: categoryFilterValue }))
    }, [JSON.stringify(dropdownOptions)])

    return { dropdownOptions, setDropdownOptions }
};

export default useDropdownOptions;