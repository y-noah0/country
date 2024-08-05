import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './style.module.css';

const DataFetcher = () => {
    const [countryInfo, setCountryInfo] = useState(null);
    const searchRef = useRef();

    useEffect(() => {
        const fetchCountryByCoordinates = async (latitude, longitude) => {
            try {
                const response = await axios.get(`https://geocode.xyz/${latitude},${longitude}?geoit=json`);
                if (response.data && response.data.country) {
                    fetchData(response.data.country, true);
                }
            } catch (error) {
                console.error('Error fetching location data:', error);
            }
        };

        const getCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchCountryByCoordinates(latitude, longitude);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        getCurrentLocation();
    }, []);

    const fetchData = async (searchTerm, isDefault = false) => {
        if (!searchTerm) return;
        try {
            const response = await axios.get(`https://restcountries.com/v3.1/name/${searchTerm}`);
            if (response.data.length > 0) {
                const country = response.data[0];
                const countryData = {
                    name: country.name.common,
                    capital: country.capital ? country.capital[0] : 'N/A',
                    languages: country.languages ? Object.values(country.languages).join(', ') : 'N/A',
                    flag: country.flags && country.flags.svg ? country.flags.svg : ''
                };
                setCountryInfo(countryData);
                if (!isDefault) {
                    searchRef.current.value = '';
                }
            } else {
                alert('No country found with the given name');
            }
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.searchBar}>
                <input type="text" ref={searchRef} placeholder="Enter country name" />
                <button onClick={() => fetchData(searchRef.current.value)}>Search</button>
            </div>
            <div className={styles.country}>
                {countryInfo && (
                    <div>
                        <h2>{countryInfo.name}</h2>
                        <p><strong>Capital:</strong> {countryInfo.capital}</p>
                        <p><strong>Languages:</strong> {countryInfo.languages}</p>
                        {countryInfo.flag && <img src={countryInfo.flag} alt={`${countryInfo.name} flag`} />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataFetcher;

