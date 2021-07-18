import axios from 'axios';

const buildClient = ({req}) => {
  if(typeof window === 'undefined') {
    //We are on server
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  } else {
     // We mus be on browser
     return axios.create({
       baseURL: '/' 
     })
  }
};

export default buildClient;

