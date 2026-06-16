// import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import nf from '../../assets/NotFound.png' 
import { TbArrowBack } from 'react-icons/tb';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <img src={nf} style={{width: '450px'}}></img>
            <p style={{color: '#ff4020'}}>Sorry, the page you're looking for doesn't exist.</p>
            {/* <Button startIcon={<TbArrowBack />} variant='contained' style={{backgroundColor: '#ff4020'}} onClick={() => navigate(-1)}>Go Back</Button> */}
        </div>
    );
};

export default NotFound;
