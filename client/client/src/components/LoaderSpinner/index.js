import { Oval as Loader } from "react-loader-spinner";
const LoaderSpinner = () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "30px" }}>
        <Loader
            color="#0f766e"
            secondaryColor="#bfe0dc"
            height={64}
            width={64}
            strokeWidth={4}
        />
    </div>
)

export default LoaderSpinner
