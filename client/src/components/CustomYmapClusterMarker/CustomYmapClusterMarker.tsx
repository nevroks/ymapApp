import { YMapMarker } from "ymap3-components";
import { placeMarkGeometryCoordinatesType } from "../../utils/types";
import { useState } from "react";
import { ReturningOfferType } from "../../utils/api/api";
import styles from "./style.module.css";
import { Button, PopUp } from "../ui";
import { toCurrency } from "../../utils/numbers";
import classNames from "classnames";
import CloseIcon from "./../../assets/icons/crossIcon.svg";
import useMediaQuery from "../../utils/hooks/useMediaQuery";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type CustomYmapClusterMarkerProps = {
    coordinates: placeMarkGeometryCoordinatesType;
    placeMarks: ReturningOfferType[];
    onMarkerClick: (placeMarks: ReturningOfferType[]) => void;
    isActive: boolean;
};

const CustomYmapClusterMarker = ({ coordinates, placeMarks, onMarkerClick, isActive }: CustomYmapClusterMarkerProps) => {
    const isMobile = useMediaQuery(800);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePlaceMarkClick = (_placeMark: ReturningOfferType) => {
        setIsPopUpOpen(false);
    };

    const offersPerPage = isMobile ? 1 : 2;
    const pages = Math.ceil(placeMarks.length / offersPerPage);
    const currentPageContent = placeMarks.slice((currentPage - 1) * offersPerPage, currentPage * offersPerPage);

    const renderPaginationButtons = () => {
        const maxVisiblePages = 6;
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(pages, startPage + maxVisiblePages - 1);

        const buttons = [];
        if (currentPage > 1) {
            buttons.push(
                <button key="prev" onClick={() => setCurrentPage(currentPage - 1)}>
                    <p className="text-small">{'<'}</p>
                </button>
            );
        }

        for (let index = startPage; index <= endPage; index++) {
            buttons.push(
                <button
                    className={classNames(styles['CustomYmapClusterMarker-popup-pagination-button'], {
                        [styles.active]: currentPage === index,
                    })}
                    key={index}
                    onClick={() => setCurrentPage(index)}
                >
                    <p className="text-small">{index}</p>
                </button>
            );
        }

        if (currentPage < pages) {
            buttons.push(
                <button key="next" onClick={() => setCurrentPage(currentPage + 1)}>
                    <p className="text-small">{'>'}</p>
                </button>
            );
        }

        return buttons;
    };

    const handleClick = () => {
        setIsPopUpOpen(true);
        onMarkerClick(placeMarks);
    };

    // Slider settings
    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: <button onClick={(e) => e.stopPropagation()}>{'<'}</button>,
        nextArrow: <button onClick={(e) => e.stopPropagation()}>{'>'}</button>,
    };

    return (
        <>
            <YMapMarker onClick={handleClick} coordinates={coordinates}>
                <span
                    className={classNames(styles["CustomYmapClusterMarker-content"], {
                        [styles["CustomYmapClusterMarker-content-active"]]: isActive,
                    })}
                ></span>
            </YMapMarker>
            {isMobile && (
                <PopUp isOpen={isPopUpOpen} onClose={() => setIsPopUpOpen(false)}>
                    <div className={styles['CustomYmapClusterMarker-popup-content']}>
                        <div className={styles['CustomYmapClusterMarker-popup-header']}>
                            <p className="text-medium">Предложения({placeMarks.length})</p>
                            <img onClick={() => setIsPopUpOpen(false)} src={CloseIcon} alt="" />
                        </div>
                        <div className={styles['CustomYmapClusterMarker-popup-offers']}>
                            {currentPageContent.map((mark) => {
                                const isRental = mark.name.toLocaleLowerCase().includes('аренда');
                                const havePicture = mark.picture.length;

                                return (
                                    // <div className={styles['CustomYmapClusterMarker-popup-offers-offer']} onClick={() => handlePlaceMarkClick(mark)} key={mark.id}>
                                    <div className={styles['CustomYmapClusterMarker-popup-offers-offer']} key={mark.id}>
                                        {havePicture ? (
                                            <Slider {...sliderSettings} className={styles["CustomYmapClusterMarker-sliderr"]}>
                                                {mark.picture.map((imageUrl, index) => (
                                                    <div onClick={(e) => e.stopPropagation()} key={index} className={styles['CustomYmapClusterMarker-offer-image-container']}>
                                                        <img src={imageUrl} alt="" className={styles['CustomYmapClusterMarker-offer-image']} />
                                                    </div>
                                                ))}
                                            </Slider>
                                        ) : (
                                            <div className="CustomYmapClusterMarker-popup-offers-offer-image-empty">
                                                <p className="text-small">Нет фото</p>
                                            </div>
                                        )}
                                        <div className={styles['CustomYmapClusterMarker-popup-offers-offer-info']}>
                                            <p className={classNames("text-small", styles['CustomYmapClusterMarker-popup-offers-offer-info-name'])}>{mark.name}</p>
                                            <div className={styles['CustomYmapClusterMarker-popup-offers-offer-info-price']}>
                                                <div>
                                                    <p className="text-small">
                                                        {isRental ? 'МАП ' : 'Цена '}
                                                        {toCurrency({ number: mark.price })}
                                                    </p>
                                                </div>
                                                <a href={mark.url} target="_blank">
                                                    <Button>
                                                        <p className="text-extra-small">Посмотреть</p>
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className={styles['CustomYmapClusterMarker-popup-pagination']}>
                            {renderPaginationButtons()}
                        </div>
                    </div>
                </PopUp>
            )}
        </>
    );
};

export default CustomYmapClusterMarker;
