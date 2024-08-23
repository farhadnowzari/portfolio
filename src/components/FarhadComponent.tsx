import farhadImage from '../assets/Farhad.png';

const FarhadComponent = () => {
    const imageAlt = "Farhad Nowzari, FullStack Developer. Stuttgart Germany";
    return (
        <div className="position-sticky h-100" style={{ maxHeight: "100vh", overflow: "hidden" }}>
            <img alt={imageAlt} style={{ width: "100%", height: "100%" , objectFit: "cover" }}  src={farhadImage} />
        </div>
    );
};

export default FarhadComponent;