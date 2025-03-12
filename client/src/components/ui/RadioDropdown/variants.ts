import { Variants } from "framer-motion";

export const RadioDropdownMenuVariants: Variants = {
	hidden: { opacity: 0, height: 0 },
	visible: {
		opacity: 1,
		height: 'auto',
		transition: {
			staggerChildren: 0.1
		}
	},
	exit: { opacity: 0, height: 0 }
}
export const RadioDropdownMenuItemVariants: Variants = {
	hidden: { opacity: 0, y: -10 },
	visible: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -10 }
}