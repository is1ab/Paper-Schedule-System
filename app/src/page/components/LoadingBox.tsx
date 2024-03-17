import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LoadingBox() {
    return <div className="d-flex w-100 justify-content-center">
        <div className="w-fit-content text-center d-flex flex-column">
            <FontAwesomeIcon size="2xl" spin icon={faSpinner}></FontAwesomeIcon>
            <span className="pt-4">發送請求中</span>
        </div>
    </div>
}

export default LoadingBox;