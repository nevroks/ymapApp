import { DependencyList, useEffect, useRef } from 'react'

export const useUpdateEffect = (
	effect: () => void | (() => void),
	deps: DependencyList
) => {
	const isInitialMount = useRef(true)

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false
		} else {
			return effect()
		}
	}, deps)
}
