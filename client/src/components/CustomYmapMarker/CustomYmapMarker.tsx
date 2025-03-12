import { YMapMarker } from 'ymap3-components';
import mapPointIcon from "./../../assets/icons/mapPointIcon.svg"
import { ReturningOfferType } from '../../utils/api/api';
import classNames from 'classnames';
import styles from "./style.module.css"
import { toCurrency } from '../../utils/numbers';
type CustomYmapMarkerProps = {
    mark: ReturningOfferType
}

const CustomYmapMarker = ({ mark }: CustomYmapMarkerProps) => {

    // const [isPopUpOpen, setIsPopUpOpen] = useState(false);

    const isRent = mark.name.toLocaleLowerCase().includes('аренда')


    return (
        <>
            <YMapMarker
                // onClick={() => setIsPopUpOpen(true)}
                coordinates={mark.geometry.coordinates} >
                <a href={mark.url} target='_blank'>
                    <div className={styles['CustomYmapMarker-content']}>
                        <img className={styles['CustomYmapMarker-content-icon']} src={mapPointIcon} alt="" />
                        <p className={classNames('text-small', styles['CustomYmapMarker-content-price'])}>{toCurrency({ number: mark.price, floor: true })}{isRent && '/мес'}</p>
                    </div>
                </a>

            </YMapMarker>
            {/* <PlacePopUp isOpen={isPopUpOpen} onClose={() => setIsPopUpOpen(false)} mark={mark} /> */}
        </>

    );
}

export default CustomYmapMarker;
