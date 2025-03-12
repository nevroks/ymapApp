import { AnimatePresence, motion } from 'motion/react'
import styles from './style.module.css'
import { FC, ReactNode, useEffect, useRef } from 'react'

type PopUpProps = {
	isOpen: boolean
	onClose: () => void
	children: ReactNode
}

const PopUp: FC<PopUpProps> = ({ isOpen, onClose, children }) => {
	const popoverRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				popoverRef.current &&
				!popoverRef.current.contains(event.target as Node)
			) {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen, onClose])

	return (
		<AnimatePresence>
			{isOpen && (
				<div className={styles['modal-overlay']} onClick={onClose}>
					<motion.div
						ref={popoverRef}
						className={styles['modal-content']}
						initial={{ opacity: 0, translateY: -10 }}
						animate={{ opacity: 1, translateY: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={e => e.stopPropagation()}
					>
						{children}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	)
}

export default PopUp