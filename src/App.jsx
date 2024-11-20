import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    region: null,
    continent: null,
    population: false, // Changed to boolean
    area: false, // Changed to boolean
    alphabetical: false,
  });

  const regionOptions = [
    'Caribbean', 'Western Europe', 'Western Africa', 'Central Europe',
    'East Asia', 'Polynesia', 'Northern Africa', 'South Africa',
    'South East Asia', 'Eastern Africa', 'Northern America',
    'Middle Africa', 'Micronesia', 'Southern Europe', 'West Asia',
    'North Europe', 'Melanesia', 'Central Asia', 'Southern Asia',
    'South America', 'Australian and New Zealand', 'Central America',
    'East Europe',
  ];

  const continentOptions = [
    'Antarctica', 'North America', 'Europe', 'Africa', 'Asia',
    'Oceania', 'South America',
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const processedData = data.map((country) => ({
          name: country.name.common,
          flags: country.flags.png,
          capital: country.capital?.[0] || 'Unknown',
          population: country.population,
          languages: Object.values(country.languages || {}).join(', ') || 'Unknown',
          currencies: Object.values(country.currencies || {})
            .map((currency) => currency.name)
            .join(', ') || 'Unknown',
          area: country.area,
          region: country.region,
          continents: country.continents?.[0] || 'Unknown',
          maps: country.maps.googleMaps,
        }));

        setCountries(processedData);
        setFilteredCountries(processedData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    let filtered = [...countries];

    if (filters.region) {
      filtered = filtered.filter((country) => country.region === filters.region);
    }
    if (filters.continent) {
      filtered = filtered.filter((country) => country.continents === filters.continent);
    }
    if (filters.population) {
      filtered = filtered.sort((a, b) => b.population - a.population); // Largest to smallest
    }
    if (filters.area) {
      filtered = filtered.sort((a, b) => b.area - a.area); // Largest to smallest
    }
    if (filters.alphabetical) {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredCountries(filtered);
  }, [filters, countries]);

  const handleFilterChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleDropdownChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value || null, // Reset to null if the dropdown is cleared
    }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Country List with Filters</h1>

      {/* Filters */}
      <div className="filters">
        <div>
          <label>
            <strong>Region:</strong>
            <select onChange={(e) => handleDropdownChange('region', e.target.value)}>
              <option value="">Select a Region</option>
              {regionOptions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label>
            <strong>Continent:</strong>
            <select onChange={(e) => handleDropdownChange('continent', e.target.value)}>
              <option value="">Select a Continent</option>
              {continentOptions.map((continent) => (
                <option key={continent} value={continent}>
                  {continent}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <strong>Sort by Population:</strong>
          <button
            className={filters.population ? 'active' : ''}
            onClick={() => handleFilterChange('population')}
          >
            {filters.population ? 'Turn Off' : 'Largest to Smallest'}
          </button>
        </div>

        <div>
          <strong>Sort by Area:</strong>
          <button
            className={filters.area ? 'active' : ''}
            onClick={() => handleFilterChange('area')}
          >
            {filters.area ? 'Turn Off' : 'Largest to Smallest'}
          </button>
        </div>

        <div>
          <strong>Sort Alphabetically:</strong>
          <button
            className={filters.alphabetical ? 'active' : ''}
            onClick={() => handleFilterChange('alphabetical')}
          >
            {filters.alphabetical ? 'Turn Off' : 'A-Z'}
          </button>
        </div>
      </div>

      {/* Country Cards */}
      <div className="countries">
        {filteredCountries.map((country, index) => (
          <div key={index} className="country-card">
            <h2>{country.name}</h2>
            <img src={country.flags} alt={`${country.name} flag`} width="100" />
            <p>
              <strong>Capital:</strong> {country.capital}
            </p>
            <p>
              <strong>Population:</strong> {country.population}
            </p>
            <p>
              <strong>Languages:</strong> {country.languages}
            </p>
            <p>
              <strong>Currencies:</strong> {country.currencies}
            </p>
            <p>
              <strong>Area:</strong> {country.area} km²
            </p>
            <p>
              <strong>Region:</strong> {country.region}
            </p>
            <p>
              <strong>Continent:</strong> {country.continents}
            </p>
            <a href={country.maps} target="_blank" rel="noopener noreferrer">
              Google Maps
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
