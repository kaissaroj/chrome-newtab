"use strict";

const store = chrome.storage.sync;


(function(){

 	/**
 	*	 	Here pull list of image from Unsplash Api
 	*		Images from Unplash (https://unsplash.com/)
	**/

	let dom = document.getElementById("bgimg");
  	dom.style.backgroundColor =  'grey';

   fetch('https://source.unsplash.com/random/1024x600')
  .then(resp => resp)
  .then((imagelists) => {
  		let selectedImage = imagelists.url;
  	  	let dom = document.getElementById("bgimg");
  		dom.style.backgroundImage = `url(${selectedImage})`;
  })
   .catch(() => {
  		let dom = document.getElementById("bgimg");
  		dom.style.backgroundColor =  'grey';
  });

})();

(function () {
    function checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }

    function startTime() {
        var today = new Date(),
            h = checkTime(today.getHours()),
            m = checkTime(today.getMinutes()),
            s = checkTime(today.getSeconds());
        		document.getElementById('time').innerHTML = h + ":" + m;
        	 	setTimeout(function () {
            startTime()
        }, 500);
    }
    startTime();
})();

class Init{

	constructor() {
		this.batteryconnectionDetails = null;
		this.deviceDetails = null;
		this.dateDetails = null;
	}
}

class TabAction extends Init{
	constructor(props) {
	  super(props);
	}
	getAllDeviceDetails(callback){
		chrome.sessions.getDevices((res)=>{
			this.deviceDetails = res;
			callback(res);
		})
	}
	getbatteryconnectionDetails(){
		let promise = insertconnectionDetails();
		promise.then((res)=>{
			this.batteryconnectionDetails = res;
		});
	}
	setDateDetails(){
		this.dateDetails= getdateDetails();
	}
}

let tab = new TabAction;
tab.getbatteryconnectionDetails();
tab.getAllDeviceDetails((devices)=>{
	insertDevicesinDom(devices);
});
tab.setDateDetails();
insertinDom();
function insertinDom(){
	document.getElementById('date').innerHTML = `${tab.dateDetails.day}, ${tab.dateDetails.month} ${tab.dateDetails.date}`;
}
function insertDevicesinDom(devices){
	let format = "<span style='font-size: 15px;padding: 8px;;text-shadow: 0 0 2px gray;'><strong style='font-size: 15px;;text-shadow: 0 0 2px gray;'>DEVICE</strong> > LINK<span>";
	for(let i= 0; i < devices.length; i++){
		let lastSession = devices[i].sessions;
		if(lastSession.length > 0){

			lastSession = lastSession[0];
			let orgLink = lastSession.window['tabs'][0]['url'];
			let sessionLink= orgLink.substring(0, 20);

			sessionLink = `<a href="${orgLink}" target='_blank' rel='noopenner' style='color:white;text-decoration: none;'>${sessionLink}</a>`;

			let domContent = format.replace("DEVICE",devices[i].deviceName);
			domContent = domContent.replace("LINK",sessionLink);
			document.getElementById('device').innerHTML += domContent;
		}
	}
}

async function insertconnectionDetails(){

 	const date = new Date()
   const battery = await navigator.getBattery()
   const connection = navigator.onLine ? '~' + navigator.connection.downlink + ' Mbps ' : 'Offline '
   const batteryHealth = (battery.level * 100).toFixed() + '% ' + (battery.charging ? 'Charging' : 'Battery');
   document.getElementById('battery').innerHTML = `${connection} - ${batteryHealth}`;
    return {connection:connection,battery:batteryHealth};
}
function getdateDetails(){

	var today = new Date();
	var day = today.getDay();
	var dd = today.getDate();
	var mm = today.getMonth();
	var yyyy = today.getFullYear();
	var dL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	return {
		day: dL[day],
		month:  mL[mm],
		date: dd,
		year : yyyy
	}

}

