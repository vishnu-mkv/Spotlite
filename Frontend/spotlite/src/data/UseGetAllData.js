import React, {useState, useEffect } from 'react';
import { useDataLayerValue } from './DataLayer';

const useGetAllData = (spotify, getDataFromHere, id, initialOffset=0) => {
    const [ { accessToken }, dispatch ] = useDataLayerValue();
    const [offset, setOffset] = useState(initialOffset);
    const [total, setTotal] = useState(initialOffset+1);
    const [offsetIndexesDone, setOffsetIndexesDone] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {

        // there is a limit to how many tracks 
        // you can get back at a time
        // so check the limit and get the remaing data

        if (!accessToken) return;

        if (offset >= total || offsetIndexesDone.some(v => v === offset)) return;

        spotify.setAccessToken(accessToken);

        if(id){
            getDataFromHere(id, {offset:offset, limit:50})
            .then((data) => {
                setItems([...items, ...data.items]);
                setOffsetIndexesDone([...offsetIndexesDone, offset]);
                setOffset(offset + data.limit);
                setTotal(data.total);
            })
            .catch(err => console.log(err))
        }else{
            
            getDataFromHere({offset:offset, limit:50})
            .then((data) => {
                setItems([...items, ...data.items]);
                setOffsetIndexesDone([...offsetIndexesDone, offset]);
                setOffset(offset + data.limit);
                setTotal(data.total);
            })
            .catch(err => console.log(err))
        }

        
    }, [offset, total, accessToken])
    

    return items;
}

export default useGetAllData;
