import { useMemo, useRef, useState } from 'react';
import { YMap, YMapComponentsProvider, YMapControls, YMapCustomClusterer, YMapDefaultFeaturesLayer, YMapDefaultSchemeLayer, YMapGeolocationControl, YMapZoomControl } from 'ymap3-components';
import { ReturningApiResponse, ReturningOfferType } from '../../utils/api/api';
import CustomYmapMarker from '../CustomYmapMarker/CustomYmapMarker';
import { filtersType, placeMarkGeometryCoordinatesType } from '../../utils/types';
import CustomYmapClusterMarker from '../CustomYmapClusterMarker/CustomYmapClusterMarker';
import styles from './style.module.css'
import OffersPanel from '../ui/OffersPanel/OffersPanel';
import openSetingsImg from '../../assets/icons/openSetingsButton.svg'
import useMediaQuery from '../../utils/hooks/useMediaQuery';

type MapProps = {
    isLoading: boolean,
    isError: boolean,
    data: ReturningApiResponse | undefined,
    filters: filtersType
    openSetings: boolean
    setOpenSetings: (value: boolean) => void
}

type filterKeys = keyof filtersType

const Map = ({ data, isLoading, isError, filters, setOpenSetings, openSetings }: MapProps) => {
    const isTabletOrSmaller = useMediaQuery(800);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [currentPlaceMarks, setCurrentPlaceMarks] = useState<ReturningOfferType[]>([]);
    const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

    const handleMarkerClick = (newPlaceMarks: ReturningOfferType[], markerId: string) => {
        setCurrentPlaceMarks(newPlaceMarks);
        setIsPanelOpen(true);
        setActiveMarkerId(markerId);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        setActiveMarkerId(null);
    };

    const ymap3Ref = useRef();

    const filteredOffers = useMemo(() => {
        if (isLoading || isError) {
            return []
        }
        const isFilterValid = (offer: ReturningOfferType, filterKey: string, filterKeyValue: string[]) => {
            const param = offer.param.find(p => p.name === filterKey);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            return param ? filterKeyValue.includes(param['#text']) : false;
        };

        return data!.offers.filter((offer) => {
            // Отсеиваем то что не подходит по цене 
            if (filters.priceRange.min > offer.price || filters.priceRange.max < offer.price) {
                return false;
            }
            // Отсеиваем то что не подходит по площади
            const offerSpace = offer.param.find(p => p.name === 'Площадь')!['#text'];
            if (!offerSpace) {
                return false;
            } else {
                let formattedOfferSpace: number = offerSpace as number;
                if (typeof offerSpace === 'string') {
                    formattedOfferSpace = Number(offerSpace.replace('м2', '').replace(' ', '').replace(',', '.'));
                }
                if (filters.placeSpace.min > formattedOfferSpace || filters.placeSpace.max < formattedOfferSpace) {
                    return false;
                }
            }


            // Проверка всех остальных фильтров
            return Object.entries(filters).every(([filterKey, filterKeyValue]) => {
                const typedFilterKey = filterKey as filterKeys;
                const typesFilterValue = filterKeyValue as string[];

                // Если фильтр пустой, пропускаем его
                if (typesFilterValue.length === 0) {
                    return true;
                }

                switch (typedFilterKey) {
                    case 'category':
                        return typesFilterValue.includes(offer.categoryId);
                    case 'tube':
                        return isFilterValid(offer, 'Метро', typesFilterValue);
                    case 'placeArea':
                        return isFilterValid(offer, 'Район', typesFilterValue);
                    case 'placeState':
                        return isFilterValid(offer, 'Состояние', typesFilterValue);
                    case 'placeReadiness':
                        return isFilterValid(offer, 'Строительная готовность', typesFilterValue);
                    default:
                        return true;
                }
            });
        });

    }, [JSON.stringify(filters), isLoading])



    return (
        <div className={styles["Map"]}>
            <img onClick={() => setOpenSetings(!openSetings)} src={openSetingsImg} alt="openSetingsImg" className={styles["Map-image-setings"]} />
            <YMapComponentsProvider apiKey={import.meta.env.VITE_YANDEX_KEY} lang="ru_RU">
                <YMap
                    key="map"
                    ref={ymap3Ref}
                    location={{ center: [37.95, 55.65], zoom: 7.5 }}
                    mode="vector"
                    theme="light"
                >
                    <YMapCustomClusterer
                        marker={(mark: ReturningOfferType) => (
                            <CustomYmapMarker mark={mark} />
                        )}
                        cluster={(coordinates: placeMarkGeometryCoordinatesType, placeMarks: ReturningOfferType[]) => (
                            <CustomYmapClusterMarker
                                coordinates={coordinates}
                                placeMarks={placeMarks}
                                onMarkerClick={(newPlaceMarks) => handleMarkerClick(newPlaceMarks, placeMarks[0].id)}
                                isActive={activeMarkerId === placeMarks[0].id}
                            />
                        )}
                        gridSize={64}
                        features={filteredOffers}
                    />
                    <YMapDefaultSchemeLayer />
                    <YMapDefaultFeaturesLayer />
                    <YMapControls position="right">
                        <YMapZoomControl />
                        <YMapGeolocationControl />
                    </YMapControls>
                </YMap>
            </YMapComponentsProvider>

            {
                !isTabletOrSmaller &&
                <OffersPanel
                    isPanelOpen={isPanelOpen}
                    currentPlaceMarks={currentPlaceMarks}
                    closePanel={closePanel}
                />

            }

        </div>

    );
}

export default Map;
