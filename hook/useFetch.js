
import { useState, useEffect  } from 'react'
import axios from 'axios';

const useFetch = (endpoint)=> {
    const [data, setData] = useState ([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const axios = require('axios');

const options = {
  method: 'GET',
  url: `https://jsearch.p.rapidapi.com/$({endpoint}`,
   headers: {
    'x-rapidapi-key': 'fb75486e44msh309911a9bc781b9p1bcc97jsne1e42d1819d1',
    'x-rapidapi-host': 'jsearch.p.rapidapi.com'
  },




  params: {
    query: 'developer jobs in chicago',
    page: '1',
    num_pages: '1',
    country: 'us',
    date_posted: 'all'
  },
 
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		console.log(response.data);
	} catch (error) {
		console.error(error);
	}
}

fetchData();



};
export default useFetch;

