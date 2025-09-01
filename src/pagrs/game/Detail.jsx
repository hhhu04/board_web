import {useParams} from "react-router-dom";
import Cyphers from "./Cyphers";
import {useEffect} from "react";

export const Detail = () => {

    const {game, key} = useParams()

    return(
        <>
            {
                game === '사퍼' ?
                    <Cyphers gameKey={key} />
                    :
                    null
            }
        </>
    )

}

export default Detail