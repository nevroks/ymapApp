import styles from "./style.module.css"

const Loader = () => {
    return (
        <div className={styles["loader-wrapper"]}>
            <h2>Подождите пожалуйста, данные загружаются</h2>
            <div className={styles["loader"]} title="4">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    width="24px" height="30px" viewBox="0 0 24 30" enableBackground="new 0 0 50 50">
                    <rect x="0" y="0" width="4" height="10" fill="#333">
                        <animateTransform attributeType="xml"
                            attributeName="transform" type="translate"
                            values="0 0; 0 20; 0 0"
                            begin="0" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                    <rect x="10" y="0" width="4" height="10" fill="#333">
                        <animateTransform attributeType="xml"
                            attributeName="transform" type="translate"
                            values="0 0; 0 20; 0 0"
                            begin="0.2s" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                    <rect x="20" y="0" width="4" height="10" fill="#333">
                        <animateTransform attributeType="xml"
                            attributeName="transform" type="translate"
                            values="0 0; 0 20; 0 0"
                            begin="0.4s" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                </svg>
            </div>
        </div>

    );
}

export default Loader;
