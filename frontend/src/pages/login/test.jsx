import { useState, useEffect } from "react";

const Test =()=>{
    const [albums, setAlbums] = useState([]);

    useEffect(()=>{
        const fetchAlbums  = async ()=>{
            const res = await fetch('https://jsonplaceholder.typicode.com/albums',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            setAlbums(data);
        }
        fetchAlbums();
    }, [])

    const render = albums.map((sp) => (
        <div key={sp.id} className="bg-red-400">
            <div>{sp.id}</div>
            <div>{sp.title}</div>
        </div>
    ))

    return (
        <>
            {render}
        </>
    );
}

export default Test;
