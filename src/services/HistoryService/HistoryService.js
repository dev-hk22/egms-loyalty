
import { URL, HEADER, APIKEY, ACCESSTOKEN } from '../../App';

class HistoryService{
	
	responseData: responseData;

	getRespData(){
		return this.responseData;
	}

	setRespData(responseData: data){
		this.responseData = responseData;
	}


	async getRedeemHistory(pFormData,accesstoken){

		console.log("getRedeemHistory called");

		console.log("getRedeemHistory params",pFormData);

		console.log("accesstoken",accesstoken);
		var lUrl = URL + 'getRedeemHistory'; 
		await fetch(lUrl, { 
  			method: 'POST',
		  	headers: {
        		'Accept': 'application\/json',
        		'Content-Type': 'multipart\/form-data',
        		'apikey': APIKEY,
            	'accesstoken': accesstoken
  			} ,
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

export default HistoryService;