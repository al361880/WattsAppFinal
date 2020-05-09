window.app  = new Vue({
	el: '#app',
	data: {
	logged: false,
	user: '',
	  passwd: '',
	  id: '',
	  idUser: '',
	  token: '',
	  email: '',
	  users: [],
	  rates: [],
	  devices: [],
	  states: ["Activo", "Pausado", "Desconectado"],
	  locations: ["Cocina", "Comedor", "Baño", "Dormitorio"],
	  deviceTypes: ["Electrodomestico", "Dispositivo electrónico", "Calefacción", "Refrigeración", "Iluminación"],
	  selectedUser: '',

	  form: {
		  identifier: '',
		  name: '',
		  email: '',
		  address: '',
		  accessCode: '',
		  rateId: '',
		  token: '',
	  },
	  
	  formGetUser: {
		  identifier: '',
		  name: '',
		  email: '',
		  address: '',
		  token: '',
		  accessCode: '',
		  "oos:rate": '',
		  
		  "oos:token": '',
	  },
	  
	  formDevices: {
		  identifier: '',
		  itemCondition: '',
		  location: '',
		  category: '',
		  description: '',

	  },
	  
	  formGetDevices: {
		  identifier: '',
		  itemCondition: '',
		  location: '',
		  category: '',
		  description: '',
	  },
	  
	  formRates: {
		  identifier: '',
		  name: '',
		  price: '',
		  description: '',
	  },
	  
	  formGetRates: {
		  identifier: '',
		  name: '',
		  price: '',
		  description: '',
	  },
	
	  show: true,
	},
	
	

	
	created(){
		var self = this
		var ES = new EventSource('/events')

		console.log('Creando listener de eventos de servidor...')

		   ES.addEventListener('updates', function(event){
				 var data = JSON.parse(JSON.parse(event.data)) //bytes to string -> string to json
				 self.users.push(data)
			}, false)
			
		ES.addEventListener('updateDevices', function(event){
			   var data = JSON.parse(JSON.parse(event.data)) //bytes to string -> string to json
			   self.devices.push(data)
			}, false)
			
		ES.addEventListener('updateRates', function(event){
			   var data = JSON.parse(JSON.parse(event.data)) //bytes to string -> string to json
			   self.rates.push(data)
			}, false)

	},
	mounted(){
		var self = this;
		//this.listRates();
		//this.listUsers();
			//Inyectamos usuarios actuales en la componente Vuw
		//fetch('/user').then(function(r){return r.json()})
		//              .then(function(j){self.users.push(...j.result)})
	},
	
	methods:{
		
	  sendInfo(item) {

		if (item["oos:rate"] == undefined){
			item["oos:rate"] = item.rateId;
			this.formGetUser = item;
		}else{

			item["oos:rate"] = item["oos:rate"].replace("http://our_own_schema.org/rate/", "")
	
			this.formGetUser = item;
		}

		
		//console.log(item)
		//console.log(this.formGetUser)
	  },
	  
	  sendInfodevice(item){
		this.formGetDevices = item;

	  },
	  
	  sendInfoRate(item){
		this.formGetRates = item;
	  },
	  
	  showModal() {
		this.$refs['my-modal'].show()

	  },
	  
	  hideModalDev(){
		this.$refs['my-modal-adddevices'].hide()
		this.$refs['my-modalactdevice'].hide()
		

	  },
	  
	  hideModalRate(){
		this.$refs['my-modal-addrates'].hide()
		this.$refs['my-modal-actrate'].hide()
	  },	
	  
	  hideModal() {
		this.$refs['my-modal'].hide()
	  },
	  
	  hideModalActUser() {
		this.$refs['my-modal2'].hide()
	  },
	  
	  onReset(evt) {
		evt.preventDefault()
		// Reset our form values
		this.form.id = ''
		this.form.name = ''
		this.form.email = ''
		this.form.address = ''
		this.form.passwd = ''
		this.form.rateId = ''
		// Trick to reset/clear native browser form validation state
		this.show = false
		this.$nextTick(() => {
		  this.show = true
		})
	  },
	  
	

	  addUser(evt){
		evt.preventDefault()

		var url = '/user';
		var formPost = this.form;

		fetch(url, {
			method: 'POST',
			body: JSON.stringify(formPost),
			headers:{
				'Content-Type': 'application/json'
			}
			}).then(function(r){
				return r.json()
			}).then(function(j){
				console.log(j.result);
			});
				
			this.$refs['my-modal'].hide()
			this.$refs['my-modal2'].hide()
		
	  },
	  
	  updateUser(evt){
		evt.preventDefault()

		var url = '/user';
		var formPost = this.formGetUser;

		formPost["oos:rate"] = "http://our_own_schema.org/rate/" + formPost["oos:rate"]
		
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(formPost),
			headers:{
				'Content-Type': 'application/json'
			}
			}).then(function(r){
				return r.json()
			}).then(function(j){
				console.log(j.result);
			});
				
			this.$refs['my-modal'].hide()
			this.$refs['my-modal2'].hide()
		
	  },
		
	  
				
		listUsers() {
			
			var self = this
			this.users = [];

			fetch("/users", {
				headers:{
					'authorization': "Bearer " + self.token
				  },
				method: 'GET',
			}).then(function(r){
				  return r.json()
			}).then(function(j){
				  self.users.push(...j.result)
			});
		},
		
		
		getUser(){
			var self = this
			var url = "/user";
			this.formGetUser = {};
			fetch(url,{
				headers:{
					'authorization': 'Bearer' + self.token
				},
				method: 'GET',
			}).then(function(r){
				return r.json()
			}).then(function(j){
				console.log(j.result)
			});
		},
		
		deleteUser(id){
			var url = "/user/" + id;
			fetch(url,{
				headers:{
					'authorization': "Bearer " + this.token
				  },
				method: 'DELETE',
			}).then(function(r){
				return r.json()
			}).then(function(j){
				console.log(j.result);
			});
			this.listUsers();
		},

		


		login() {
			var self = this

			var url = "/login"
			var cuerpo = {"email":self.user, "accessCode":self.passwd}
			fetch(url, {
				method: 'POST',
				body: JSON.stringify(cuerpo),
				headers:{
					'Content-Type': 'application/json'
				}

			}).then(function(r){
				  return r.json()
			}).then(function(j){
				if (j.result != 'KO'){
					self.token = j.result.token;
					self.logged = true;
					self.listUsers();
					self.listRates();
					self.user = ""
				}
				self.passwd = ""
			});
		},
		
		listDevices(id) {
			this.idUser = id;
			var self = this
			this.devices = [];
			var url = "/device/list/" + id;

			fetch(url, {
				headers:{
					'authorization': "Bearer " + self.token
				  },
				method: 'GET',
			}).then(function(r){
				  return r.json()
			}).then(function(j){
				
				self.devices.push(...j.result)
			});
		},

		addDevice(evt){
			evt.preventDefault()

			var url = '/device/' + this.idUser;
			var formPost = this.formDevices;

			fetch(url, {
				method: 'POST',
				body: JSON.stringify(formPost),
				headers:{
					'Content-Type': 'application/json',
				}
				}).then(function(r){
					return r.json()
				}).then(function(j){
					console.log(j.result);
				});
					
				this.$refs['my-modal-adddevices'].hide()
				this.$refs['my-modalactdevice'].hide()
		},
		
		updateDevice(evt){
			
			evt.preventDefault()

			var url = '/device/' + this.idUser;
			var formPost = this.formGetDevices;

			fetch(url, {
				method: 'POST',
				body: JSON.stringify(formPost),
				headers:{
					'Content-Type': 'application/json',
				}
				}).then(function(r){
					return r.json()
				}).then(function(j){
					console.log(j.result);
				});
					
				this.$refs['my-modal-adddevices'].hide()
				this.$refs['my-modalactdevice'].hide()
		},
		
		getDevice(id){
			
			var url = "/device/" + id;
			fetch(url,{
				headers:{
					'authorization': "Bearer " + this.token
				  },
				method: 'GET',
			}).then(function(r){
				return r.json()
			}).then(function(j){
				console.log(j.result);
			});
		},
		
		deleteDevice(id){
			var url = "/device/" + id;
			fetch(url,{
				headers:{
					'authorization': "Bearer " + this.token
				  },
				method: 'DELETE',
			}).then(function(r){
				return r.json()
			}).then(function(j){
				console.log(j.result);
			});
			this.listDevices();
		},
		listRates() {
						
			var self = this
			this.rates = [];
			fetch("/rate", {
				headers:{
					'authorization': "Bearer " + this.token
				  },
				method: 'GET',
			}).then(function(r){
				  return r.json()
			}).then(function(j){
				  self.rates.push(...j.result)
			});
		},
		addRate(evt){
			
			evt.preventDefault()

			var url = '/rate';
			var formPost = this.formRates;

			fetch(url, {
				method: 'POST',
				body: JSON.stringify(formPost),
				headers:{
					'Content-Type': 'application/json',
					'authorization': "Bearer " + this.token

				}
				}).then(function(r){
					return r.json()
				}).then(function(j){
					console.log(j.result);
				});
					
				this.$refs['my-modal-addrates'].hide()
				this.$refs['my-modal-actrate'].hide()
			
		},
		
		updateRate(evt){
			
			evt.preventDefault()

			var url = '/rate';
			var formPost = this.formGetRates;

			fetch(url, {
				method: 'POST',
				body: JSON.stringify(formPost),
				headers:{
					'Content-Type': 'application/json',
					'authorization': "Bearer " + this.token

				}
				}).then(function(r){
					return r.json()
				}).then(function(j){
					console.log(j.result);
				});
					
				this.$refs['my-modal-addrates'].hide()
				this.$refs['my-modal-actrate'].hide()
			
		},
		getRate(id){
			
			var url = "/user/" + id + "/rate";
			fetch(url,{
				headers:{
					'authorization': "Bearer " + this.token
				  },
				method: 'GET',
			}).then(function(r){
				return r.json()
			}).then(function(j){
				console.log(j.result);
			});
		},
		
		deleteRate(id){
			var url = "/rate/" + id;
			fetch(url,{
				headers:{
					'authorization': "Bearer " + this.token
				  },
				method: 'DELETE',
			}).then(function(r){
				return r.json()
			}).then(function(j){
				console.log(j.result);
			});
			this.listRates();
		},
	}
  });