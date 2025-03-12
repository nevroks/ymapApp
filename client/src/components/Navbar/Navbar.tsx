import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from "./style.module.css"
import idreLogoImg from './../../assets/icons/logo.svg'
import backIcon from './../../assets/icons/backicon.svg'
import mobileLogo from './../../assets/icons/mobileLogo.svg'

import { filtersType } from '../../utils/types';
import { filterInitValues } from '../../utils/consts';

import useDropdownOptions from '../../utils/hooks/useDropdownOptions';
import { ApiResponseCategories } from '../../utils/api/api';
import { DropdownOptionType } from '../ui/RadioDropdown/types';
import { toCurrency } from '../../utils/numbers';
import { Button, PopOver, RadioDropdown } from '../ui';
import ArrowIcon from './../../assets/icons/arrow-down.svg'
import classNames from 'classnames';
// import useDebounce from '../../utils/hooks/useDebouce';

import NumberInput from '../ui/NumberInput/NumberInput';
import useMediaQuery from '../../utils/hooks/useMediaQuery';

import { motion } from "framer-motion";

type NavbarProps = {
    setFilters: Dispatch<SetStateAction<filtersType>>
    filters: filtersType
    categories: ApiResponseCategories
    tubes: string[]
    openSetings: boolean
    countData: number
    setOpenSetings: Dispatch<SetStateAction<boolean>>
    placeState: string[]
    placeReadiness: string[]
    placeArea: string[]
    placeSpace: { min: number, max: number }
    priceRange: { min: number, max: number }
    filtersPriceRange: { min: number, max: number }
}

const Navbar: FC<NavbarProps> = ({ countData, openSetings, setOpenSetings, setFilters, filters, categories, tubes, placeState, placeReadiness, placeArea, placeSpace, priceRange, filtersPriceRange }) => {

    const isTabletOrSmaller = useMediaQuery(1150);
    const isPhone = useMediaQuery(500);

    const categoryRadioDropdownOptions: DropdownOptionType[] = Object.entries(categories)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([key, _value]) => key === 'АРЕНДА' || key === 'ПРОДАЖА ГАБ' || key === 'ПРОДАЖА СВОБОДНЫХ ПОМЕЩЕНИЙ')
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, value]) => ({ selected: false, text: key, value: value }));

    const tubeRadioDropdownOptions: DropdownOptionType[] = tubes.sort((a, b) => a.localeCompare(b)).map(tube => ({ selected: false, text: tube, value: tube }))
    const stateRadioDropdownOptions: DropdownOptionType[] = placeState.sort((a, b) => a.localeCompare(b)).map(state => ({ selected: false, text: state, value: state }))
    const placeReadinessRadioDropdownOptions: DropdownOptionType[] = placeReadiness.sort((a, b) => a.localeCompare(b)).map(readiness => ({ selected: false, text: readiness, value: readiness }))
    const placeAreaRadioDropdownOptions: DropdownOptionType[] = placeArea.sort((a, b) => a.localeCompare(b)).map(area => ({ selected: false, text: area, value: area }))

    const { dropdownOptions: categoryDropdownState, setDropdownOptions: setCategoryDropdownState } = useDropdownOptions(categoryRadioDropdownOptions, filters, setFilters, "category")
    const { dropdownOptions: tubesDropdownState, setDropdownOptions: setTubesDropdownState } = useDropdownOptions(tubeRadioDropdownOptions, filters, setFilters, "tube")
    const { dropdownOptions: placeStateDropdownState, setDropdownOptions: setPlaceStateDropdownState } = useDropdownOptions(stateRadioDropdownOptions, filters, setFilters, "placeState")
    const { dropdownOptions: placeReadinessDropdownState, setDropdownOptions: setPlaceReadinessDropdownState } = useDropdownOptions(placeReadinessRadioDropdownOptions, filters, setFilters, "placeReadiness")
    const { dropdownOptions: placeAreaDropdownState, setDropdownOptions: setPlaceAreaDropdownState } = useDropdownOptions(placeAreaRadioDropdownOptions, filters, setFilters, "placeArea")

    const [filterPriceRange, setFilterPriceRange] = useState({
        min: filtersPriceRange.min !== filterInitValues.priceRange.min ? filtersPriceRange.min : priceRange.min,
        max: filtersPriceRange.max !== filterInitValues.priceRange.max ? filtersPriceRange.max : priceRange.max
    })
    // const deboucedFilterPriceRange = useDebounce(filterPriceRange, 500)
    const [isPriceRangePopOverOpen, setIsPriceRangePopOverOpen] = useState(false)
    const popOverAnchorRef = useRef<HTMLDivElement>(null)

    const [placeSpaceRange, setPlaceSpaceRange] = useState({
        min: placeSpace.min,
        max: placeSpace.max
    })
    // const deboucedPlaceSpaceRange = useDebounce(placeSpaceRange, 500)
    const [isSpacePlacePopOverOpen, setIsSpacePlacePopOverOpen] = useState(false)
    const placeSpacePopOverAnchorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            priceRange: filterPriceRange,
            placeSpace: placeSpaceRange
        }));
    }, [filterPriceRange, placeSpaceRange]);

    // useUpdateEffect(() => {

    //     setFilters(prev => ({
    //         ...prev,
    //         priceRange: deboucedFilterPriceRange,
    //         placeSpace: deboucedPlaceSpaceRange
    //     }));


    // }, [deboucedFilterPriceRange.max, deboucedFilterPriceRange.min, deboucedPlaceSpaceRange.max, deboucedPlaceSpaceRange.min])
    const handleClearFilters = () => {
        setCategoryDropdownState(categoryRadioDropdownOptions)
        setTubesDropdownState(tubeRadioDropdownOptions)
        setPlaceStateDropdownState(stateRadioDropdownOptions)
        setPlaceReadinessDropdownState(placeReadinessRadioDropdownOptions)
        setPlaceAreaDropdownState(placeAreaRadioDropdownOptions)
        setFilters({
            ...filterInitValues,
            priceRange: { min: priceRange.min, max: priceRange.max },
            placeSpace: { min: filterInitValues.placeSpace.min, max: filterInitValues.placeSpace.max }
        })
    }

    const [isMobileFilterPopOverOpen, setIsMobileFilterPopOverOpen] = useState(false)
    const mobileFilterAnchorRef = useRef<HTMLParagraphElement>(null)
    const heightVariants = {
        opened: { height: '100px', transition: { duration: 0.3 } },
        closed: { height: '20px', transition: { duration: 0.3 } }
    };
    return (
        <>
            <nav className={styles["Navbar"]}>
                <img className={styles["Navbar-logo"]} src={idreLogoImg} alt="" />
                {!isTabletOrSmaller ?
                    <div className={styles["Navbar-filtersList"]}>
                        <RadioDropdown optionsArr={categoryDropdownState} text="Категория" setOptionsArr={setCategoryDropdownState} />
                        <div className={classNames(styles['Navbar-filtersList-range'], {
                            [styles['active']]: isPriceRangePopOverOpen
                        })} ref={popOverAnchorRef} onClick={() => setIsPriceRangePopOverOpen(prevState => !prevState)}>
                            <p className='text-small'>
                                Цена{filtersPriceRange.min !== priceRange.min || filtersPriceRange.max !== priceRange.max ? '(изм*)' : ''}
                            </p>
                            <img src={ArrowIcon} alt="" />
                        </div>
                        {isPriceRangePopOverOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className={styles["overlay"]}
                                onClick={() => setIsPriceRangePopOverOpen(false)}
                            />
                        )}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={isPriceRangePopOverOpen ? { x: 0 } : { x: "-200%" }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={styles["Navbar-filtersList-popOver"]}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div>
                                <p className='text-small'>От ({toCurrency({ number: filterPriceRange.min, floor: true })})</p>
                                <NumberInput
                                    controlledValue={filterPriceRange.min}
                                    onChange={(value) => setFilterPriceRange({ ...filterPriceRange, min: value })}
                                />
                            </div>
                            <div>
                                <p className='text-small'>До ({toCurrency({ number: filterPriceRange.max, floor: true })})</p>
                                <NumberInput
                                    controlledValue={filterPriceRange.max}
                                    onChange={(value) => setFilterPriceRange({ ...filterPriceRange, max: value })}
                                />
                            </div>
                        </motion.div>


                        {isSpacePlacePopOverOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className={styles["overlay"]}
                                onClick={() => setIsSpacePlacePopOverOpen(false)}
                            />
                        )}

                        <div className={classNames(styles['Navbar-filtersList-range'], {
                            [styles['active']]: isSpacePlacePopOverOpen
                        })} ref={placeSpacePopOverAnchorRef} onClick={() => setIsSpacePlacePopOverOpen(prevState => !prevState)}>
                            <p className='text-small'>
                                Площадь{(filterInitValues.placeSpace.min !== placeSpaceRange.min || filterInitValues.placeSpace.max !== placeSpaceRange.max) ? '(изм*)' : ''}
                            </p>
                            <img src={ArrowIcon} alt="" />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={isSpacePlacePopOverOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={styles["Navbar-filtersList-popOver"]}
                        >
                            <div>
                                <p className='text-small'>От ({placeSpaceRange.min})кв.м</p>
                                <NumberInput
                                    controlledValue={placeSpaceRange.min}
                                    onChange={(value) => setPlaceSpaceRange({ ...placeSpaceRange, min: value })}
                                />
                            </div>
                            <div>
                                <p className='text-small'>До ({placeSpaceRange.max})кв.м</p>
                                <NumberInput
                                    controlledValue={placeSpaceRange.max}
                                    onChange={(value) => setPlaceSpaceRange({ ...placeSpaceRange, max: value })}
                                />
                            </div>
                        </motion.div>
                        <RadioDropdown className={styles["Navbar-filtersList-radioDropdown"]} optionsArr={placeReadinessDropdownState} text="Строительная готовность" setOptionsArr={setPlaceReadinessDropdownState} />
                        <RadioDropdown optionsArr={placeStateDropdownState} text="Состояние" setOptionsArr={setPlaceStateDropdownState} />
                        <RadioDropdown optionsArr={placeAreaDropdownState} text="Район" setOptionsArr={setPlaceAreaDropdownState} />
                        <RadioDropdown optionsArr={tubesDropdownState} text="Метро" setOptionsArr={setTubesDropdownState} />
                        <Button onClick={handleClearFilters}>
                            <p>Сбросить фильтры</p>
                        </Button>
                    </div>
                    :
                    <div className={styles["Navbar-filtersList"]}>
                        <p ref={mobileFilterAnchorRef} onClick={() => setIsMobileFilterPopOverOpen(prevState => !prevState)} className='text-medium'>Фильтры</p>

                        {/* мобилка */}
                        <PopOver offset={{ top: -50, left: 25 }} className={styles["Navbar-filtersList-mobile-popOver"]} isOpened={isMobileFilterPopOverOpen} setIsOpened={setIsMobileFilterPopOverOpen} popOverAnchorRef={mobileFilterAnchorRef}>
                            <div className={styles["Navbar-filtersList-mobile-popOver-content"]}>


                                <div className={styles['Navbar-filtersList-mobile-popOver-content-header']}>
                                    <div className={styles['Navbar-filtersList-mobile-popOver-content-header-close-container']}>
                                        <img onClick={() => setIsMobileFilterPopOverOpen(prevState => !prevState)} src={backIcon} alt="backIcon" className={styles['Navbar-filtersList-mobile-popOver-content-header-closeImg']} />
                                        <p className={`${styles['Navbar-filtersList-mobile-popOver-content-header-close']} text-medium`}>Фильтры</p>
                                    </div>
                                    <Button className={styles['Navbar-filtersList-mobile-popOver-content-header-clear']} onClick={handleClearFilters}>
                                        <p>Сбросить</p>
                                    </Button>
                                </div>

                                <RadioDropdown className={styles["Navbar-filtersList-mobile-popOver-content-dropdown"]} optionsArr={categoryDropdownState} text="Категория" setOptionsArr={setCategoryDropdownState} />
                                <div className={styles['Navbar-filtersList-mobile-popOver-content-divider']}></div>
                                <div className={classNames(styles['Navbar-filtersList-range'], {
                                    [styles['active']]: isPriceRangePopOverOpen
                                })} ref={popOverAnchorRef} onClick={() => setIsPriceRangePopOverOpen(prevState => !prevState)}>
                                    <p className='text-small'>
                                        Цена{filtersPriceRange.min !== priceRange.min || filtersPriceRange.max !== priceRange.max ? '(изм*)' : ''}
                                    </p>
                                    <img src={ArrowIcon} alt="" />
                                </div>
                                <div className={styles['Navbar-filtersList-mobile-popOver-content-divider']}></div>
                                <PopOver
                                    className={styles["Navbar-filtersList-popOver"]}
                                    offset={{ top: 20, left: 0 }}
                                    isOpened={isPriceRangePopOverOpen}
                                    setIsOpened={setIsPriceRangePopOverOpen}
                                    popOverAnchorRef={popOverAnchorRef}
                                >
                                    <div>
                                        <p className='text-small'>От ({toCurrency({ number: filterPriceRange.min, floor: true })})</p>
                                        <NumberInput
                                            controlledValue={filterPriceRange.min}
                                            onChange={(value) => setFilterPriceRange({ ...filterPriceRange, min: value })}
                                        />
                                    </div>
                                    <div>
                                        <p className='text-small'>До ({toCurrency({ number: filterPriceRange.max, floor: true })})</p>
                                        <NumberInput
                                            controlledValue={filterPriceRange.max}
                                            onChange={(value) => setFilterPriceRange({ ...filterPriceRange, max: value })}
                                        />
                                    </div>


                                </PopOver>

                                <div className={classNames(styles['Navbar-filtersList-range'], {
                                    [styles['active']]: isSpacePlacePopOverOpen
                                })} ref={placeSpacePopOverAnchorRef} onClick={() => setIsSpacePlacePopOverOpen(prevState => !prevState)}>
                                    <p className='text-small'>
                                        Площадь{(filterInitValues.placeSpace.min !== placeSpaceRange.min || filterInitValues.placeSpace.max !== placeSpaceRange.max) ? '(изм*)' : ''}
                                    </p>
                                    <img src={ArrowIcon} alt="" />
                                </div>
                                <div className={styles['Navbar-filtersList-mobile-popOver-content-divider']}></div>
                                <PopOver
                                    className={styles["Navbar-filtersList-popOver"]}
                                    offset={{ top: 20, left: isPhone ? 40 : 140 }}
                                    isOpened={isSpacePlacePopOverOpen}
                                    setIsOpened={setIsSpacePlacePopOverOpen}
                                    popOverAnchorRef={placeSpacePopOverAnchorRef}
                                >
                                    <div>
                                        <p className='text-small'>От ({placeSpaceRange.min})кв.м</p>
                                        <NumberInput
                                            controlledValue={placeSpaceRange.min}
                                            onChange={(value) => setPlaceSpaceRange({ ...placeSpaceRange, min: value })}
                                        />
                                    </div>
                                    <div>
                                        <p className='text-small'>До ({placeSpaceRange.max})кв.м</p>
                                        <NumberInput
                                            controlledValue={placeSpaceRange.max}
                                            onChange={(value) => setPlaceSpaceRange({ ...placeSpaceRange, max: value })}
                                        />
                                    </div>


                                </PopOver>

                                <RadioDropdown className={styles["Navbar-filtersList-mobile-popOver-content-dropdown"]} optionsArr={placeReadinessDropdownState} text="Строительная готовность" setOptionsArr={setPlaceReadinessDropdownState} />
                                <div className={styles['Navbar-filtersList-mobile-popOver-content-divider']}></div>
                                <RadioDropdown className={styles["Navbar-filtersList-mobile-popOver-content-dropdown"]} optionsArr={placeStateDropdownState} text="Состояние" setOptionsArr={setPlaceStateDropdownState} />
                                <div className={styles['Navbar-filtersList-mobile-popOver-content-divider']}></div>
                                <RadioDropdown className={styles["Navbar-filtersList-mobile-popOver-content-dropdown"]} optionsArr={placeAreaDropdownState} text="Район" setOptionsArr={setPlaceAreaDropdownState} />
                                <div className={styles['Navbar-filtersList-mobile-popOver-content-divider']}></div>
                                <RadioDropdown className={styles["Navbar-filtersList-mobile-popOver-content-dropdown"]} optionsArr={tubesDropdownState} text="Метро" setOptionsArr={setTubesDropdownState} />
                            </div>
                        </PopOver>
                        <Button onClick={handleClearFilters}>
                            <p>Сбросить фильтры</p>
                        </Button>
                    </div>
                }

                <a className={styles[""]} href="https://idre.pro/catalog" target="_blank">
                    <Button className={styles["Navbar-catalog"]}>
                        <p >Каталог объектов</p>
                    </Button>
                </a>
                <div className={styles['Navbar-number']}>
                    <a className={styles['Navbar-number_item']} href="tel:+79252745495"> +7 (925) 274 54 95</a>
                </div>

            </nav>
            {
                openSetings && <div className={styles["Navbar-filtersList"]}>

                    {/* мобилка */}
                    <PopOver offset={{ top: -50, left: 25 }} className={styles["Navbar-filtersList-mobile-popOver"]} isOpened={openSetings} setIsOpened={setOpenSetings} popOverAnchorRef={mobileFilterAnchorRef}>
                        <div className={styles["Navbar-filtersList-mobile-popOver-content"]}>


                            <div className={styles['Navbar-filtersList-mobile-popOver-content-header']}>
                                <div className={styles['Navbar-filtersList-mobile-popOver-content-header-close-container']}>
                                    <img onClick={() => setOpenSetings(prevState => !prevState)} src={backIcon} alt="backIcon" className={styles['Navbar-filtersList-mobile-popOver-content-header-closeImg']} />
                                    <p className={`${styles['Navbar-filtersList-mobile-popOver-content-header-close']} text-medium`}>Фильтры</p>
                                </div>
                                <Button className={styles['Navbar-filtersList-mobile-popOver-content-header-clear']} onClick={handleClearFilters}>
                                    <p>Сбросить</p>
                                </Button>
                            </div>

                            <RadioDropdown className={styles["Navbar-filtersList-mobile-popOver-content-dropdown"]} optionsArr={categoryDropdownState} text="Категория" setOptionsArr={setCategoryDropdownState} />
                            <div className={styles['Navbar-filtersList-mobile-popOver-content-divider']}></div>


                            <motion.div
                                initial="closed"
                                animate={isPriceRangePopOverOpen ? "opened" : "closed"}
                                variants={heightVariants}
                                className={classNames(styles['Navbar-filtersList-range'], {
                                    [styles['active']]: isPriceRangePopOverOpen
                                })} ref={popOverAnchorRef} onClick={() => setIsPriceRangePopOverOpen(prevState => !prevState)}>
                              <p className={`${filtersPriceRange.min !== 40000 || filtersPriceRange.max !== 963357000 ? styles["Navbar-filtersList-range-text-active"] : styles["Navbar-filtersList-range-text"]} text-small`}>
                                    Цена{filtersPriceRange.min !== priceRange.min || filtersPriceRange.max !== priceRange.max ? '(изм*)' : ''}
                                </p>
                                <img src={ArrowIcon} alt="" />
                            </motion.div>
                            <div className={styles['Navbar-filtersList-mobile-popOver-content-divider']}></div>
                            <PopOver
                                className={styles["Navbar-filtersList-popOver"]}
                                offset={{ top: 1, left: 0 }}
                                isOpened={isPriceRangePopOverOpen}
                                setIsOpened={setIsPriceRangePopOverOpen}
                                popOverAnchorRef={popOverAnchorRef}
                            >
                                <div>
                                    <p className='text-small'>От ({toCurrency({ number: filterPriceRange.min, floor: true })})</p>
                                    <NumberInput
                                        controlledValue={filterPriceRange.min}
                                        onChange={(value) => setFilterPriceRange({ ...filterPriceRange, min: value })}
                                    />
                                </div>
                                <div>
                                    <p className='text-small'>До ({toCurrency({ number: filterPriceRange.max, floor: true })})</p>
                                    <NumberInput
                                        controlledValue={filterPriceRange.max}
                                        onChange={(value) => setFilterPriceRange({ ...filterPriceRange, max: value })}
                                    />
                                </div>
                            </PopOver>

                            <motion.div
                                initial="closed"
                                animate={isSpacePlacePopOverOpen ? "opened" : "closed"}
                                variants={heightVariants}
                                className={classNames(styles['Navbar-filtersList-range'], {
                                    [styles['active']]: isSpacePlacePopOverOpen
                                })} ref={placeSpacePopOverAnchorRef} onClick={() => setIsSpacePlacePopOverOpen(prevState => !prevState)}>
                                <p className={`${placeSpaceRange.min !== 0 || placeSpaceRange.max !== 5000 ? styles["Navbar-filtersList-range-text-active"] : styles["Navbar-filtersList-range-text"]} text-small`}>
                                    Площадь{(filterInitValues.placeSpace.min !== placeSpaceRange.min || filterInitValues.placeSpace.max !== placeSpaceRange.max) ? '(изм*)' : ''}
                                </p>
                                <img src={ArrowIcon} alt="" />
                            </motion.div>
                            <div className={styles['Navbar-filtersList-mobile-popOver-content-divider']}></div>
                            <PopOver
                                className={`${styles["Navbar-filtersList-popOver"]} ${styles["place-space"]}`}
                                offset={{ top: 0, left: 0 }}
                                isOpened={isSpacePlacePopOverOpen}
                                setIsOpened={setIsSpacePlacePopOverOpen}
                                popOverAnchorRef={placeSpacePopOverAnchorRef}
                            >
                                <div>
                                    <p className='text-small'>От ({placeSpaceRange.min})кв.м</p>
                                    <NumberInput
                                        controlledValue={placeSpaceRange.min}
                                        onChange={(value) => setPlaceSpaceRange({ ...placeSpaceRange, min: value })}
                                    />
                                </div>
                                <div>
                                    <p className='text-small'>До ({placeSpaceRange.max})кв.м</p>
                                    <NumberInput
                                        controlledValue={placeSpaceRange.max}
                                        onChange={(value) => setPlaceSpaceRange({ ...placeSpaceRange, max: value })}
                                    />
                                </div>


                            </PopOver>

                            <RadioDropdown className={styles["Navbar-filtersList-mobile-popOver-content-dropdown"]} optionsArr={placeReadinessDropdownState} text="Строительная готовность" setOptionsArr={setPlaceReadinessDropdownState} />
                            <div className={styles['Navbar-filtersList-mobile-popOver-content-divider']}></div>
                            <RadioDropdown className={styles["Navbar-filtersList-mobile-popOver-content-dropdown"]} optionsArr={placeStateDropdownState} text="Состояние" setOptionsArr={setPlaceStateDropdownState} />
                            <div className={styles['Navbar-filtersList-mobile-popOver-content-divider']}></div>
                            <RadioDropdown className={styles["Navbar-filtersList-mobile-popOver-content-dropdown"]} optionsArr={placeAreaDropdownState} text="Район" setOptionsArr={setPlaceAreaDropdownState} />
                            <div className={styles['Navbar-filtersList-mobile-popOver-content-divider']}></div>
                            <RadioDropdown className={styles["Navbar-filtersList-mobile-popOver-content-dropdown"]} optionsArr={tubesDropdownState} text="Метро" setOptionsArr={setTubesDropdownState} />

                            <div className={styles['Navbar-filtersList-mobile-popOver-content-info']}>
                                <div className={styles['Navbar-filtersList-mobile-popOver-content-info-box']}>
                                    <Button onClick={() => setOpenSetings(prevState => !prevState)} className={styles["Navbar-catalog-mobile-counter"]}>
                                        <p >Показать {countData} объектов</p>
                                    </Button>
                                    <a className={styles[""]} href="https://idre.pro/catalog" target="_blank">
                                        <Button className={styles["Navbar-catalog-mobile"]}>
                                            <p >Перейти в каталог</p>
                                        </Button>
                                    </a>
                                </div>
                                <div className={styles['Navbar-filtersList-mobile-popOver-content-info-box']}>
                                    <a href="tel:+79252745495" className={styles['Navbar-filtersList-mobile-popOver-content-info-telefone']}>+7 925 274 54 95</a>
                                    <a href="mailto:info@idre.pro" className={styles['Navbar-filtersList-mobile-popOver-content-info-mail']}>info@idre.pro</a>
                                    <img className={styles['Navbar-filtersList-mobile-popOver-content-info-logo']} src={mobileLogo} alt="mobileLogo" />
                                </div>
                            </div>
                        </div>

                    </PopOver>

                </div>}
        </>
    );
}

export default Navbar;
