
import { URL, HEADER, APIKEY, ACCESSTOKEN } from '../../App';

class ScanService {

	responseData: responseData;

	getRespData() {
		return this.responseData;
	}

	setRespData(responseData: data) {
		this.responseData = responseData;
	}

	async checkCoupon(pFormData,accesstoken) {
		debugger
		var lUrl = URL + 'checkCoupon';
		await fetch(lUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'multipart\/form-data',
				'apikey': APIKEY,
				'accesstoken': accesstoken
			},
			body: pFormData,
		})
			.then((response) => response.json())
			.then((responseJson) => {
				// alert(JSON.stringify(responseJson))
				console.log(JSON.stringify(responseJson));
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async redeemCoupon(pFormData,accesstoken) {
		console.log("ACCESSTOKEN");
		console.log(accesstoken);


		// var lUrl = URL + 'redeemCouponV1';
		var lUrl = URL + 'redeemCouponCarpenter';
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
				console.log("--=-=-=-=-=-=");

				// console.log(JSON.stringify(responseJson));
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async redeemCustCoupon(pFormData,accesstoken) {
		console.log("ACCESSTOKEN");
		console.log(accesstoken);


		// var lUrl = URL + 'redeemCouponV1';
		var lUrl = URL + 'redeemCouponAuthUser';
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
				console.log("--=-=-=-=-=-=");

				// console.log(JSON.stringify(responseJson));
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	async scanCoupon(pFormData) {
		console.log("ACCESSTOKEN");
		console.log(ACCESSTOKEN);


		var lUrl = URL + 'scanCoupon';
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
				console.log("--=-=-=-=-=-=");

				console.log(JSON.stringify(responseJson));
				this.setRespData(responseJson);
			})
			.catch((error) => {
				console.error(error);
			});
	};

}

export default ScanService;