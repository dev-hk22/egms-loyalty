
import { URL, HEADER, APIKEY, ACCESSTOKEN } from '../../App';
import AsyncStorage from '@react-native-community/async-storage';

class LoginService {

	responseData: responseData;
	accessToken: accessToken;
	getRespData() {
		return this.responseData;
	}
	setRespData(responseData: data) {
		this.responseData = responseData;
	}

	getAccessToken() {
		return this.accessToken;
	}
	setAccessToken(accessToken: accessToken) {
		this.accessToken = accessToken;
	}

	async logOut(pFormData,accesstoken) {
		var lUrl = URL + 'logoutCarpenter';
		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY,
				'accesstoken': accesstoken
			},
			body: pFormData,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async logOutCustomer(pFormData,accesstoken) {
		var lUrl = URL + 'logoutOfficerUser';
		console.log(pFormData);
		console.log(accesstoken);
		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY,
				'accesstoken': accesstoken
			},
			body: pFormData,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async login(pFormData) {
		// var lUrl = URL + 'login';
		var lUrl = URL + 'loginCarpenter';
		console.log(lUrl);

		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY
			},
			body: pFormData,
		})
			.then((response) => 
			{
				console.log(response.headers.map.accesstoken);
                AsyncStorage.setItem('ACCESSTOKEN', response.headers.map.accesstoken);
                // this.setAccessToken(response.headers.map.accesstoken);
                //response['accesstoken'].push(response.headers.map.accesstoken);
                return response.json();
			})
			.then((responseJson) => {
				console.log(responseJson, 'LoginService');
				// alert(JSON.stringify(responseJson))
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async loginCustomer(pFormData) {
		// var lUrl = URL + 'login';
		var lUrl = URL + 'loginOfficerUser';
		console.log(lUrl);

		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY
			},
			body: pFormData,
		})
			.then((response) => 
			{
				console.log("ACCESSTOKEN===",response.headers.map.accesstoken);
				console.log(response.headers.map.accesstoken);
                AsyncStorage.setItem('ACCESSTOKEN', response.headers.map.accesstoken);
                // this.setAccessToken(response.headers.map.accesstoken);
                //response['accesstoken'].push(response.headers.map.accesstoken);
                return response.json();
			})
			.then((responseJson) => {
				console.log(responseJson, 'LoginService');
				// console.log("ACCESSTOKEN===111111",responseJson.headers.map.accesstoken);
				// alert(JSON.stringify(responseJson))
				//  AsyncStorage.setItem('ACCESSTOKEN', responseJson.headers.map.accesstoken);
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async validateDistributor(pFormData) {
		var lUrl = URL + 'validateDist';
		console.log(lUrl);

		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY
			},
			body: pFormData,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log("response---",responseJson);

				// alert(JSON.stringify(responseJson))
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};
	async setPassword(pFormData) {
		var lUrl = URL + 'setPassword';
		console.log(lUrl);

		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY
			},
			body: pFormData,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);

				// alert(JSON.stringify(responseJson))
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};
	async generateOtp(pFormData) {
		var lUrl = URL + 'generateOtp';
		console.log(lUrl);

		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY
			},
			body: pFormData,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);

				// alert(JSON.stringify(responseJson))
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async getBrands() {
		var lUrl = URL + 'getBrands';
		console.log(lUrl);

		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY
			}
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log("=-=-=-00=-=-=-==-=");
				console.log(responseJson);

				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async getCountries() {
		var lUrl = URL + 'getCountries';
		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY
			}
		})
			.then((response) => response.json())
			.then((responseJson) => {
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async getStatesByCountry(pFormData) {
		var lUrl = URL + 'getStatesByCountry';
		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY
			},
			body: pFormData
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(responseJson);
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async getProductList(pFormData , accessToken) {
		// console.log('===formdata' , pFormData ,{
		// 	'Accept': 'application\/json',
		// 	'Content-Type': 'multipart\/form-data',
		// 	'apikey': APIKEY,
		// 	'accesstoken': accessToken
		// });
		// console.log(URL + 'getProducts')
		var lUrl = URL + 'getProducts';
		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY,
				'accesstoken': accessToken
			},
			body: pFormData
		})
			.then((response) => response.json())
			.then((responseJson) => {
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async placeCustomerOrder(pFormData , accessToken) {
		console.log('===formdata' , JSON.stringify(pFormData,null,2) ,{
			'Accept': 'application\/json',
			'Content-Type': 'multipart\/form-data',
			'apikey': APIKEY,
			'accesstoken': accessToken
		});
		console.log(URL + 'placeOrder')



		var lUrl = URL + 'placeOrder';
		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY,
				'accesstoken': accessToken
			},
			body: pFormData
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log("=======response" , JSON.stringify(responseJson,null,2))
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error("=====error",error);
			});
	};

	async getCitiesByState(pFormData) {
		var lUrl = URL + 'getCitiesByState';
		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY
			},
			body: pFormData
		})
			.then((response) => response.json())
			.then((responseJson) => {
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async registration(pFormData) {
		var lUrl = URL + 'register';
		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY
			},
			body: pFormData,
		}).then((response) => response.json())
			.then((responseJson) => {
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
				// this.setRespData({'Error':'Service API failure','Message': error});
			});
	};
	async verifyOtp(pFormData) {
		var lUrl = URL + 'verifyOtp';
		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY
			},
			body: pFormData,
		}).then((response) =>
						{
							console.log(response.headers.map.accesstoken);
							this.setAccessToken(response.headers.map.accesstoken);
							//response['accesstoken'].push(response.headers.map.accesstoken);
							return response.json();
						})
			.then((responseJson) => {
				//console.log("response headers",responseJson.headers);
				console.log("response data",responseJson);
				this.setRespData(responseJson);
				// if (responseJson.data) {
				// 	this.setAccessToken(responseJson.data.accesstoken);
				// }
			})
			.catch((error) => {
				console.error(error);
				// this.setRespData({'Error':'Service API failure','Message': error});
			});
	};
	async verifyOtpDealer(pFormData) {
		var lUrl = URL + 'verifyOtpDealer';
		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY
			},
			body: pFormData,
		}).then((response) => response.json())
			.then((responseJson) => {
				this.setRespData(responseJson);
				if (responseJson.data) {
					this.setAccessToken(responseJson.data.accesstoken);
				}
			})
			.catch((error) => {
				console.error(error);
				// this.setRespData({'Error':'Service API failure','Message': error});
			});
	};
	// .then((response) => {
	// 	this.setRespData(response.json());
	// 	this.setAccessToken(response.headers.map.accesstoken);
	// 	// response.json();

	// })
}

export default LoginService;