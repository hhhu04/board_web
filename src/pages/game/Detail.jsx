import {useParams, useSearchParams} from "react-router-dom";
import Cyphers from "./Cyphers";
import {useEffect} from "react";
import Dnf from "./Dnf.jsx";

export const Detail = (prop) => {

    const {game, key} = useParams()
    const [param] = useSearchParams()

    return(
        <>
            {
                game === 'cyphers' ?
                    <Cyphers gameKey={key} />
                    :
                    null
            }
            {
                game === 'dnf' ?
                    <Dnf gameKey = {key}
                         subVal = {param.get('subVal')}
                    />
                    :
                    null
            }
        </>
    )

}

export default Detail