/* eslint-disable @typescript-eslint/ban-ts-comment */
import { YMapMarker } from "ymap3-components";

import { useState } from "react";
import styles from "./style.module.css"
import classNames from "classnames";
import { placeMarkGeometryCoordinatesType } from "../../../utils/types";
import { ReturningOfferType } from "../../../utils/api/api";
import useMediaQuery from "../../../utils/hooks/useMediaQuery";
import PopUp from "../PopUp/PopUp";
import { toCurrency } from "../../../utils/numbers";
import Button from "../Button/Button";
import CloseIcon from '../../../assets/icons/crossIcon.svg'

type CustomYmapClusterMarkerProps = {
    coordinates?: placeMarkGeometryCoordinatesType,
    placeMarks: ReturningOfferType[]
}

const OfferCard = ({  placeMarks }: CustomYmapClusterMarkerProps) => {
    const isMobile = useMediaQuery(500)
    // const [chosenPlaceMark, setChosenPlaceMark] = useState<ReturningOfferType | null>(null);

    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    // const [isPlacePopUpOpen, setIsPlacePopUpOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1)

    const handlePlaceMarkClick = (_placeMark: ReturningOfferType) => {
        // setChosenPlaceMark(placeMark);
        setIsPopUpOpen(false);
        // setIsPlacePopUpOpen(true);
    }
    const offersPerPage = isMobile ? 1 : 2
    const pages = Math.ceil(placeMarks.length / offersPerPage)
    const currentPageContent = placeMarks.slice((currentPage - 1) * offersPerPage, currentPage * offersPerPage)

    const renderPaginationButtons = () => {
        const maxVisiblePages = 6; // Максимальное количество видимых страниц
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(pages, startPage + maxVisiblePages - 1);

        const buttons = [];

        // Добавляем кнопку "Предыдущая"
        if (currentPage > 1) {
            buttons.push(
                <button key="prev" onClick={() => setCurrentPage(currentPage - 1)}>
                    <p className="text-small">{'<'}</p>
                </button>
            );
        }

        // Генерируем кнопки страниц
        for (let index = startPage; index <= endPage; index++) {
            buttons.push(
                <button
                    className={classNames(styles['CustomYmapClusterMarker-popup-pagination-button'], {
                        [styles.active]: currentPage === index
                    })}
                    key={index}
                    onClick={() => setCurrentPage(index + 1 - 1)}
                >
                    <p className="text-small">{index}</p>
                </button>
            );
        }

        // Добавляем кнопку "Следующая"
        if (currentPage < pages) {
            buttons.push(
                <button key="next" onClick={() => setCurrentPage(currentPage + 1)}>
                    <p className="text-small">{'>'}</p>
                </button>
            );
        }

        return buttons;
    };

    return (
        <>

            <PopUp isOpen={isPopUpOpen} onClose={() => setIsPopUpOpen(false)}>
                <div className={styles['CustomYmapClusterMarker-popup-content']}>
                    <div className={styles['CustomYmapClusterMarker-popup-header']}>
                        <p className="text-medium">Предложения({placeMarks.length})</p>
                        <img onClick={() => setIsPopUpOpen(false)} src={CloseIcon} alt="" />
                    </div>
                    <div className={styles['CustomYmapClusterMarker-popup-offers']}>
                        {currentPageContent.map((mark) => {
                            const placeSquare = mark.param.find(param => param.name === 'Площадь')
                            const isRental = mark.name.toLocaleLowerCase().includes('аренда')
                            const havePicture = mark.picture.length
                            let pricePerMeter = 0
                            if (placeSquare) {
                                let placeSquareCount = placeSquare['#text']
                                if (typeof placeSquare['#text'] === 'string') {
                                    placeSquareCount = Number(placeSquare['#text'].replace(',', '.').replace('м2', ''))
                                }
                                // @ts-expect-error
                                pricePerMeter = mark.price / placeSquareCount
                            }

                            return (
                                <div className={styles['CustomYmapClusterMarker-popup-offers-offer']} onClick={() => handlePlaceMarkClick(mark)} key={mark.id}>
                                    <div className={styles['CustomYmapClusterMarker-popup-offers-offer-image']}>
                                        {havePicture ?
                                            <img src={mark.picture[0]} alt="" />
                                            :
                                            <div className="CustomYmapClusterMarker-popup-offers-offer-image-empty">
                                                <p className="text-small">Нет фото</p>
                                            </div>
                                        }

                                    </div>
                                    <div className={styles['CustomYmapClusterMarker-popup-offers-offer-info']}>
                                        <p className={classNames("text-small", styles['CustomYmapClusterMarker-popup-offers-offer-info-name'])}>{mark.name}</p>
                                        <div className={styles['CustomYmapClusterMarker-popup-offers-offer-info-price']}>
                                            <div>
                                                <p className="text-small">
                                                    {isRental ? 'МАП ' : 'Цена '}
                                                    {toCurrency({ number: mark.price })}
                                                </p>
                                                {pricePerMeter !== 0 &&
                                                    <p className="text-small">
                                                        За 1 м2: {toCurrency({ number: pricePerMeter })}
                                                    </p>
                                                }
                                            </div>

                                            <a href={mark.url} target="_blank">
                                                <Button>
                                                    <p className="text-extra-small">Посмотреть</p>
                                                </Button>
                                            </a>

                                        </div>


                                    </div>


                                </div>
                            )
                        }

                        )}
                    </div>
                    <div className={styles['CustomYmapClusterMarker-popup-pagination']}>
                        {renderPaginationButtons()}
                    </div>
                </div>
            </PopUp >
            {/* {chosenPlaceMark && <PlacePopUp isOpen={isPlacePopUpOpen} onClose={() => setIsPlacePopUpOpen(false)} mark={chosenPlaceMark} />
            } */}
        </>

    );
}

export default OfferCard;
