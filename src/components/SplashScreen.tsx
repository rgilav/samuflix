import React from 'react';
import './SplashScreen.css';

const SplashScreen: React.FC = () => {

    return (
        <div className='app-splash'>
            <div className='app-splash-content'>
                <img className='app-splash-logo' src="/resources/icon.png" />
                <h1>Samuflix</h1>
                <p>Carregando...</p>                
            </div>
        </div>
    );        

} 

export default SplashScreen;