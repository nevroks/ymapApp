import { Dispatch, SetStateAction } from "react"

export type DropdownOptionType = {
    selected: boolean
    text: string
    value: string
}

export type DropdownPropsType = {
    className?: string
    optionsArr: DropdownOptionType[]
    setOptionsArr: Dispatch<SetStateAction<DropdownOptionType[]>>
    text: string
    menuClassname?: string
}