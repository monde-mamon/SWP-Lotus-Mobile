// import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import stringify from 'qs-stringify';

/******************/
//Storage functions
/******************/

// saving data
export const storeData = async (key, data) => {
  try {
    await AsyncStorage.setItem(
      '@' + key + ':key',
      JSON.stringify(data)
    );
    return { status: 'success', reason: 'data saved', result: data };
  } catch (error) {
    return error;
    // Error saving data
  }
};

//retrieve  data
export const retrieveData = async (key) => {
  // AsyncStorage.clear();
  try {
    const value = await AsyncStorage.getItem('@' + key + ':key');
    console.log(key, 'Async, Retrieved value :', value);
    if (value !== null) {
      return JSON.parse(value);
      // return value;
    } else {
      console.log('Erorr: ', {
        status: 'failed',
        reason: 'data does not exist',
      });
      return false;
    }
  } catch (error) {
    return error;
    // Error retrieving data
  }
};

/******************/
//Firebase functions
/******************/
export const getApiURL = async () => {
  try {
    const api_url = await retrieveData('api_url');
    console.log('hinahanap mo BOI : ', process.env.API_URL);
    return 'http://mglsgp1.railsfor.biz:3111/api/v1';

    // return api_url;
  } catch (error) {
    console.log('getApiURL error :::', error);
    // return process.env.API_URL;
    return 'http://mglsgp1.railsfor.biz:3111/api/v1';
  }
};

/******************/
//User functions
/******************/

//signin user
export const signinUser = async (data) => {
  console.log('wtf:::::', await getApiURL());
  const data1 = {
    email: 'admin@mgl.sys',
    password: 'testpassword',
  };
  return axios
    .post(`${await getApiURL()}/authenticate`, data)
    .then((response) => {
      console.log('sigin user response : ', response);
      const { status, data } = response;
      if (status === 200) {
        storeData('auth_token', data.auth_token);
        storeData('user', data.user);

        return { status: 'success', data: data.user };
      } else {
        return { status: 'invalid', data: null };
      }
    })

    .catch((error) => {
      console.log('eoeowoow error :: ', error);
      return { status: 'invalid', data: null };
    });
};

//logout user
export function LogoutUser() {
  AsyncStorage.clear();
}

//update user
export const updateUser = async (id, data) => {
  const temp = data.current_password;
  delete data.current_password;
  console.log('UPDATE USER DATA <---> ', id, data);

  const auth_token = await retrieveData('auth_token');
  var config = {
    method: 'put',
    url: `${await getApiURL()}/users/${id}`,
    headers: {
      Authorization: auth_token,
    },
    data: { user: data, current_password: temp },
  };
  return axios(config)
    .then((response) => {
      console.log('update user response : ', response);
      const { status, data } = response;
      if (status === 200 || status === 201) {
        storeData('user', data.user);

        return 'success';
      } else if (data.error) {
        if (data.error.user_authentication) {
          return false;
        }
      } else {
        return 'invalid';
      }
    })

    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('GAGO', error.response);

        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
      return false;
    });
};
/******************/
//Dynamic functions
/******************/

export const dynamicFunction = async (text) => {
  console.log(' dynamic function :', text);

  let param = '';
  switch (text) {
    case 'Template':
      param = 'templates';
      break;

    case 'Customer':
      param = 'customers';
      break;

    case 'Production Condition':
      param = 'conditions';
      break;

    case 'Job Status':
      param = 'statuses';
      break;

    case 'Operator':
      param = 'operators';
      break;

    case 'House Type':
      param = 'house_types';
      break;

    default:
      param = 'templates';
  }
  const auth_token = await retrieveData('auth_token');
  var config = {
    method: 'get',
    url: `${await getApiURL()}/${param}`,
    headers: {
      Authorization: auth_token,
    },
  };
  if (auth_token) {
    return axios(config)
      .then((response) => {
        console.log(param, ' : ', response);
        return response;
      })
      .catch((error) => {
        console.log('Error mo oyy : ', error);
        return 'Not Authorized';
      });
  } else {
    return false;
  }
};

//get logo
export const getLogo = async () => {
  return axios
    .get(`${await getApiURL()}/get_logo`)
    .then((response) => {
      console.log('getlogo response : ', response.data);
      const { status, data } = response;
      return data;
    })

    .catch((error) => {
      console.log(error);
    });
};

/******************/
//Location functions
/******************/

//get current location
export function getCurrentLocation() {
  console.log('attempting to get gps');
  return new Promise((resolve, reject) => {
    retrieveData('isLocationOff').then((res) => {
      console.log('status location  wowowoowow  : ', res);
      if (!res || res.status === 'failed') {
        resolve(false);
      } else {
        Geolocation.getCurrentPosition(
          (loc) => {
            const position = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };
            console.log(' loc : ', loc.coords);
            resolve(position);
          },
          (error) => {
            console.log('error loc : ', error);

            reject(error);
          },
          // { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
          // { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 },
          { enableHighAccuracy: false, timeout: 5000 }
        );
      }
    });
  });
}
export function watchLocation() {
  Geolocation.watchPosition((position) => {
    const lastPosition = JSON.stringify(position);
    console.log('watching LOCATION :', lastPosition);
    return lastPosition;
  });
}

/******************/
//Photo functions
/******************/

//Upload photo functions
export const uploadPhoto = async (data) => {
  console.log('before pass to api : ', data);
  const auth_token = await retrieveData('auth_token');
  var config = {
    method: 'post',
    url: `${await getApiURL()}/photos`,
    headers: {
      Authorization: auth_token,
    },
    data: data,
  };
  if (auth_token) {
    return axios(config)
      .then((response) => {
        console.log('upload image result : ', response);
        if (response.data) {
          return true;
        }
        // const {status} = response.data;
        // return status;
        // if (status) {
        //   console.log(' history result : ', history);
        //   return history;
        // } else {
        //   return status;
        // }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  } else {
    return false;
  }
};

/******************/
//Task functions
/******************/

//Get History task functions
export const getHistoryTask = async () => {
  const auth_token = await retrieveData('auth_token');
  var config = {
    method: 'get',
    url: `${await getApiURL()}/bill_histories`,
    headers: {
      Authorization: auth_token,
    },
  };
  if (auth_token) {
    return axios(config)
      .then((response) => {
        // console.log('get history task result : ', response);
        if (response.data) {
          return response.data;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  } else {
    return false;
  }
};

//Upload task function
export const uploadTask = async (data) => {
  console.log('before upload task pass to api : ', data);
  const auth_token = await retrieveData('auth_token');
  var config = {
    method: 'post',
    url: `${await getApiURL()}/tasks`,
    headers: {
      Authorization: auth_token,
    },
    data: data,
  };
  if (auth_token) {
    return axios(config)
      .then((response) => {
        console.log('upload task result : ', response);
        if (response.data) {
          return response.data;
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
        return false;
      });
  } else {
    return false;
  }
};

//Update task function
export const updateTask = async (data) => {
  console.log('before update task pass to api : ', data);
  const auth_token = await retrieveData('auth_token');
  var config = {
    method: 'put',
    url: `${await getApiURL()}/tasks`,
    headers: {
      Authorization: auth_token,
    },
    data: data,
  };
  if (auth_token) {
    return axios(config)
      .then((response) => {
        console.log('update task result : ', response);
        if (response.data) {
          return response.data;
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
        return false;
      });
  } else {
    return false;
  }
};

//Upload Load Truck function
export const updateLoadTruck = async (id, param) => {
  Object.keys(param).map(
    (k) =>
      (param[k] =
        typeof param[k] == 'string' ? param[k].trim() : param[k])
  );

  console.log('before save load truck pass to api : ', param);

  const auth_token = await retrieveData('auth_token');
  var config = {
    method: 'put',
    url: `${await getApiURL()}/service_orders/${id}`,
    headers: {
      Authorization: auth_token,
    },
    data: param,
  };
  if (auth_token) {
    return axios(config)
      .then((response) => {
        console.log('save load truck result : ', response);
        if (response.data) {
          return response.data;
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('wow ', error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
        return false;
      });
  } else {
    return false;
  }
};

//Update Service Order function
export const updateServiceOrder = async (id, param) => {
  Object.keys(param).map(
    (k) =>
      (param[k] =
        typeof param[k] == 'string' ? param[k].trim() : param[k])
  );

  console.log('before update service pass to api : ', id, param);
  const auth_token = await retrieveData('auth_token');
  var config = {
    method: 'put',
    url: `${await getApiURL()}/service_orders/${id}`,
    headers: {
      Authorization: auth_token,
    },
    data: param,
  };
  if (auth_token) {
    return axios(config)
      .then((response) => {
        console.log('update service order result : ', response);
        if (response.data) {
          return response.data;
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('wow ', error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
        return false;
      });
  } else {
    return false;
  }
};

//Search service order function
export const searchFunction = async (data) => {
  console.log('before search service order and pass to api : ', data);
  const auth_token = await retrieveData('auth_token');
  var config = {
    method: 'get',
    url: `${await getApiURL()}/service_orders/search?keyword=${data.trim()}`,
    headers: {
      Authorization: auth_token,
    },
  };
  if (auth_token) {
    return axios(config)
      .then((response) => {
        console.log('search service order result : ', response);
        if (response.data.service_order) {
          return response.data.service_order;
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        return false;
      });
  } else {
    return false;
  }
};
//Search service order function
export const searchBillFunction = async (data) => {
  console.log('before search service order and pass to api : ', data);
  const auth_token = await retrieveData('auth_token');
  var config = {
    method: 'get',
    url: `${await getApiURL()}/bills/search?keyword=${data.trim()}`,
    headers: {
      Authorization: auth_token,
    },
  };
  if (auth_token) {
    return axios(config)
      .then((response) => {
        console.log('search service order result : ', response);
        if (response.data.bill) {
          return response.data.bill;
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        return false;
      });
  } else {
    return false;
  }
};

//Search task function
export const searchTaskFunction = async (data) => {
  console.log('before search task and pass to api : ', data);
  const auth_token = await retrieveData('auth_token');
  var config = {
    method: 'get',
    url: `${await getApiURL()}/tasks/search?keyword=${data.trim()}`,
    headers: {
      Authorization: auth_token,
    },
  };
  if (auth_token) {
    return axios(config)
      .then((response) => {
        console.log('search task result : ', response);
        if (response.data.service_order) {
          return response.data.service_order;
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        return false;
      });
  } else {
    return false;
  }
};

//Upload GPS Logs
export const uploadGpsLogs = async (data) => {
  console.log('before upload gps pass to api : ', data);
  const auth_token = await retrieveData('auth_token');
  var config = {
    method: 'post',
    url: `${await getApiURL()}/gps_logs`,
    headers: {
      Authorization: auth_token,
    },
    data: data,
  };
  if (auth_token) {
    return axios(config)
      .then((response) => {
        console.log('upload task result : ', response);
        if (response.data) {
          return response.data;
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
        return false;
      });
  } else {
    return false;
  }
};

//Upload task function
export const uploadDeliveries = async (data) => {
  console.log('before upload deliveries pass to api : ', data);
  const auth_token = await retrieveData('auth_token');
  var config = {
    method: 'post',
    url: `${await getApiURL()}/deliveries`,
    headers: {
      Authorization: auth_token,
    },
    data: data,
  };
  if (auth_token) {
    return axios(config)
      .then((response) => {
        console.log('upload task result : ', response);
        if (response.data) {
          return response.data;
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
        return false;
      });
  } else {
    return false;
  }
};
