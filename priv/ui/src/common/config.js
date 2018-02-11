export const host = () => {
  if(process.env.NODE_ENV == 'development'){
    return 'wss://localhost:8443/ws';
  }else{
    return null;
  }
}

export const account = () => {
  if(process.env.NODE_ENV == 'development'){
    return 'https://localhost:8443';
  }else{
    return "";
  }
}

export const num_data_points = 120;
