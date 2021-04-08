import './App.css';
import {Fragment, useEffect, useState} from 'react';
import {MenuItem,FormControl,Select} from "@material-ui/core";
import InfoBox from '../src/InfoBox';
import Map from '../src/Map';
import Table from '../src/Table';
import {sortData,prettyPrint} from '../src/util';
import {Card,CardContent,Typography} from '@material-ui/core';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';
function App() {
  const [countries,setCountries]= useState([]);
  const [selectedCountry,setSelectedCountry]= useState('worldwide');
  const [countryInfo,setCountryInfo]= useState([]);
  const [tableData,setTableData]=useState([]);
  const [mapCenter,setMapCenter]=useState([34.80746, -40.4796]);
  const [mapZoom,setMapZoom]=useState(3);
  const [mapCountries,setMapCountries]=useState();
  const [casesType, setCasesType] = useState("cases");
  //https://disease.sh/v3/covid-19/countries

  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response)=>(response.json()))
    .then((data)=>{
      setCountryInfo(data);
    })
  },[])
  useEffect(()=>{
    const getCountriesData= async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries=data.map((el)=>(
          {
            name:el.country,
            value:el.countryInfo.iso2
          }
        ))
        const sortedData=sortData(data);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
      })
    }
    getCountriesData();
  },[])
  const selectCountry=async (evt)=>{
    const selectedCountry=evt.target.value
    const url=selectedCountry==='worldwide'?`https://disease.sh/v3/covid-19/all`:`https://disease.sh/v3/covid-19/countries/${selectedCountry}`;
    await fetch(url)
    .then((response)=>response.json())
    .then((data)=>{
      setSelectedCountry(selectedCountry);
      setCountryInfo(data);
      if(data.countryInfo && data.countryInfo.lat && data.countryInfo.long)
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4);
    })
   
  }
  const cardClicked= (caseType)=>{
    if(caseType!==casesType){
      debugger;
      setCasesType(caseType)
    }
  }
  return (
    <div className="app">
      <div className="app__left">
        <div className='app_header'>
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
            variant="outlined"
            value={selectedCountry}
            onChange={selectCountry}>
            <MenuItem value="worldwide">WorldWide</MenuItem>
            {countries.map((el)=>{
              return <MenuItem value={el.value}>{el.name}</MenuItem>
            })} 
            </Select>
          </FormControl>
          </div>
          <div className='app__stats'>
            <InfoBox active={casesType==='cases'} title="Coronavirus cases" cases={prettyPrint(countryInfo.todayCases)} total={prettyPrint(countryInfo.cases)} cardClick={()=>cardClicked("cases")} color='red'/>
            <InfoBox active={casesType==='recovered'} title="Recovered" cases={prettyPrint(countryInfo.todayRecovered)} total={prettyPrint(countryInfo.recovered)} cardClick={()=>cardClicked("recovered")} color='green'/>
            <InfoBox active={casesType==='deaths'} title="Deaths" cases={prettyPrint(countryInfo.todayDeaths)} total={prettyPrint(countryInfo.deaths)} cardClick={()=>cardClicked("deaths")} color='red'/>
          </div>
          <Map 
          center={mapCenter} 
          zoom={mapZoom}
          countries={mapCountries}
          casesType={casesType}/>
      </div>
      <div className="app__right">
        <Card className="app_right">
          <CardContent>
            <h3>Live cases by country</h3>
            <Table countries={tableData}/>
            <h3 class='graph-sec'>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType}/>
          </CardContent>
        </Card>
      </div>
    </div>
    
  );
}

export default App;
