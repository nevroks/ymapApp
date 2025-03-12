import { useQuery } from "@tanstack/react-query"
import { api } from "../api/api"


export const useApi = () => {

    const getDataQuery = useQuery({
        queryKey: ['data'],
        queryFn: api.getData,
    })

    return { getDataQuery }
}