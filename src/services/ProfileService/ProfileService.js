
import { URL, HEADER, APIKEY, ACCESSTOKEN } from '../../App';

class ProfileService {

	responseData: responseData;

	getRespData() {
		return this.responseData;
	}

	setRespData(responseData: data) {
		this.responseData = responseData;
	}

	async getDistributorProfile(pFormData,accesstoken) {
		var lUrl = URL + 'getDistributorProfile';
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
				// alert(JSON.stringify(responseJson));
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};
	async getDealerProfile(pFormData) {
		var lUrl = URL + 'getProfileDealer';
		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY,
				'accesstoken': ACCESSTOKEN
			},
			body: pFormData,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log("call");
				console.log(responseJson);
				
				// alert(JSON.stringify(responseJson));
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async updateProfile(pFormData) {
		var lUrl = URL + 'updateProfile';
		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application\/json',
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY,
				'accesstoken': ACCESSTOKEN
			},
			body: pFormData,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(JSON.stringify(responseJson));
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async getCustomerProfile(pFormData, accesstoken) {
		console.log("-----------"+JSON.stringify({
			'Accept': 'application\/json',
			'Content-Type': 'multipart\/form-data',
			'apikey': APIKEY,
			'accesstoken': accesstoken
		} , null,2));
		var lUrl = URL + 'getAuthUserProfile';
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
				// alert(JSON.stringify(responseJson));
				console.log("carpenter profile data",responseJson);
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async updateProfileCustomer(pFormData,accesstoken) {
		var lUrl = URL + 'updateAuthUserProfile';
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
				console.log(JSON.stringify(responseJson));
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async getCarpenterProfile(pFormData, accesstoken) {
		var lUrl = URL + 'getCarpenterProfile';
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
				// alert(JSON.stringify(responseJson));
				console.log("carpenter profile data",responseJson);
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async updateProfileMechanic(pFormData,accesstoken) {
		var lUrl = URL + 'updateProfileCarpenter';
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
				console.log(JSON.stringify(responseJson));
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

}

export default ProfileService;