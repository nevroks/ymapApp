import {
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react'
import styles from './style.module.css'
import ArrowIcon from "./../../../assets/icons/arrow-down.svg"
import ArrowIconActiv from "./../../../assets/icons/arrow-downblu.svg"
import { AnimatePresence, motion } from 'framer-motion'
import classNames from 'classnames'
import { RadioDropdownMenuItemVariants, RadioDropdownMenuVariants } from './variants'
import Checkbox from '../Checkbox/Checkbox'
import { DropdownOptionType, DropdownPropsType } from './types'

const dropdownVariants = {
	opened: { height: '170px', transition: { duration: 0.3 } },
	closed: { height: '20px', transition: { duration: 0.3 } }
}

function RadioDropdown({
	menuClassname,
	optionsArr,
	text,
	setOptionsArr,
	className
}: DropdownPropsType) {
	const [isMenuOpened, setIsMenuOpened] = useState(false)
	const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
	const DropdownRef = useRef<HTMLDivElement | null>(null)

	const countSelectedOptions = useMemo(() => {
		return optionsArr.filter(option => option.selected).length;
	}, [JSON.stringify(optionsArr)])

	const handleOptionClick = (option: DropdownOptionType) => {
		setOptionsArr(optionsArr.map(o =>
			o.value === option.value
				? { ...o, selected: !o.selected }
				: o
		));
	}

	const toggleMenu = () => {
		setIsMenuOpened(prev => !prev);
	}

	useEffect(() => {
		const handler = (event: MouseEvent) => {
			if (
				DropdownRef.current &&
				!DropdownRef.current.contains(event.target as Node)
			) {
				setIsMenuOpened(false)
			}
		}

		document.addEventListener('click', handler)

		return () => {
			document.removeEventListener('click', handler)
		}
	}, [])

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 500);
		}

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		}
	}, []);

	return (
		<motion.div 
			ref={DropdownRef} 
			className={classNames(styles['Dropdown-wrapper'], {
				[className!]: Boolean(className),
			})}
			initial={{ height: '20px' }}
			animate={isMenuOpened ? (isMobile ? 'opened' : { height: 'auto' }) : 'closed'}
			variants={dropdownVariants}
		>
			<button className={classNames(styles['DropdownButton'], {
				[styles.active]: isMenuOpened
			})} onClick={toggleMenu}>
				<p className={classNames('text-small', styles['DropdownButton-text'], {
					[styles.selected]: countSelectedOptions > 0
				})}>{text}</p>

				<img className={classNames(styles['DropdownButton-arrow'])} src={countSelectedOptions > 0 ? ArrowIconActiv : ArrowIcon} alt="" />
			</button>
			<AnimatePresence>
				{isMenuOpened && (
					<motion.ul
						className={classNames(styles['DropdownMenu'], {
							[styles.opened]: isMenuOpened,
							[menuClassname!]: Boolean(menuClassname)
						})}
						initial='hidden'
						animate='visible'
						exit='exit'
						variants={RadioDropdownMenuVariants}
					>
						{optionsArr.map((option, index) => (
							<motion.li
								key={index}
								onClick={() => handleOptionClick(option)}
								className={classNames(styles['DropdownMenuItem'])}
								variants={RadioDropdownMenuItemVariants}
								initial='hidden'
								animate='visible'
								exit='exit'
							>
								<label className='text-small'>{option.text}</label>
								<Checkbox id={`${text}-${option}-${index}`} checked={option.selected} handleChange={() => handleOptionClick(option)} />
							</motion.li>
						))}
					</motion.ul>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

export default RadioDropdown
