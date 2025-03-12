import { motion } from "framer-motion";
import Slider from "react-slick"; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./style.module.css";
import CloseIcon from '../../../assets/icons/crossIcon.svg';
import { ReturningOfferType } from "../../../utils/api/api";
import { toCurrency } from "../../../utils/numbers";
import { useEffect } from "react";

type OffersPanelProps = {
    isPanelOpen: boolean;
    currentPlaceMarks: ReturningOfferType[];
    closePanel: () => void;
};

const OffersPanel = ({ isPanelOpen, currentPlaceMarks, closePanel }: OffersPanelProps) => {

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };

    useEffect(()=>{

    },[currentPlaceMarks])

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={isPanelOpen ? { opacity: 0.5 } : { opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={closePanel}
            />

            <motion.div
                initial={{ x: "-100%" }}
                animate={isPanelOpen ? { x: 0 } : { x: "-100%" }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={styles["CustomYmapClusterMarker-panel"]}
            >
                <div className={styles["CustomYmapClusterMarker-header"]}>
                    {/* <p className="text-medium"> */}
                    <p className={styles["CustomYmapClusterMarker-header-title"]}>
                        Предложения ({currentPlaceMarks.length})
                    </p>
                    <img
                        src={CloseIcon}
                        alt="Закрыть"
                        onClick={closePanel}
                    />
                </div>

                <div className={styles["CustomYmapClusterMarker-offers-list"]}>
                    {currentPlaceMarks
                        .sort((a, b) => a.price - b.price)
                        .map((mark) => {
                            const placeSquare = mark.param.find(
                                (param) => param.name === "Площадь"
                            );
                            const isRental = mark.name.toLowerCase().includes("аренда");
                            const havePicture = mark.picture.length;
                            let pricePerMeter = 0;

                            if (placeSquare) {
                                let placeSquareCount = placeSquare["#text"];
                                if (typeof placeSquare["#text"] === "string") {
                                    placeSquareCount = Number(
                                        placeSquare["#text"]
                                            .replace(",", ".")
                                            .replace("м2", "")
                                    );
                                }
                                pricePerMeter = mark.price / Number(placeSquareCount);
                            }

                            return (
                                <div
                                    key={mark.id}
                                    className={styles["CustomYmapClusterMarker-offer"]}
                                >
                                    <Slider {...sliderSettings} className={styles["CustomYmapClusterMarker-slider"]}>
                                        {havePicture ? (
                                            mark.picture.map((imageUrl, index) => (
                                                <div
                                                    key={index}
                                                    className={styles["CustomYmapClusterMarker-offer-image-container"]}
                                                >
                                                    <img
                                                        src={imageUrl}
                                                        alt=""
                                                        className={styles["CustomYmapClusterMarker-offer-image"]}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <div className={styles["CustomYmapClusterMarker-offer-image-empty"]}>
                                                <p className="text-small">Нет фото</p>
                                            </div>
                                        )}
                                    </Slider>
                                    <div className={styles["CustomYmapClusterMarker-offer-info"]}>
                                        <a href={mark.url} className={styles["CustomYmapClusterMarker-offer-link"]}>
                                            <p className="text-small">{mark.name}</p>
                                            <div className={styles["CustomYmapClusterMarker-offer-pricePerMeter"]}>
                                                <p className="text-small">
                                                    {isRental ? "МАП " : "Цена "}
                                                    {toCurrency({ number: mark.price })}
                                                </p>
                                                {pricePerMeter !== 0 && (
                                                    <p className="text-small">
                                                        За 1 м²:{" "}
                                                        {toCurrency({ number: pricePerMeter })}
                                                    </p>
                                                )}
                                            </div>
                                        </a>
                                        <a href={mark.url} target="_blank" rel="noopener noreferrer">
                                            <button className={styles["CustomYmapClusterMarker-offer-button"]}>
                                                <p className="text-extra-small">Посмотреть</p>
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </motion.div>
        </>
    );
};

export default OffersPanel;
