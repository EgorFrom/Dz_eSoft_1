class User {
		  constructor(nickname, password, groups) {
		    this.nickname = nickname;
		    this.password = password;
		    this.groups = groups;
		  }
	}

	var allUsers = [
		new User("admin","1234",["admin", "manager", "basic"]),
		new User("sobakajozhec","ekh228",["basic", "manager"]),
		new User("patriot007","russiaFTW",["basic"])
	];

	var allRights = ["manage content", "play games", "delete users", "view site"];

	var allGroups = {
		"admin": [allRights[0], allRights[1], allRights[2], allRights[3]],
		"manager": [allRights[0]],
		"basic": [allRights[1], allRights[3]]
	}

	//проверяет существования пользователя user:object
	function ExistUser(user) {
		ExistingFlag = false;
		users().forEach(function(e){
				if (e.nickname == user.nickname)
					ExistingFlag = true;
			});
		return ExistingFlag;
	}

	//обновляет список групп у каждого пользователя user:object
	function UpdateUser(user){
		user.groups.forEach(function(elem){
			if (Object.keys(allGroups).indexOf(elem) < 0)
				user.groups.splice(user.groups.indexOf(elem), 1);
		});
	}
	
	//обновляет список прав у каждой группы group:string
	function UpdateGroup(group){
		allGroups[group].forEach(function(right){
			if (allRights.indexOf(right) < 0)
				allGroups[group].splice(allGroups[group].indexOf(right), 1)
		});
	}

	function createUser(username, pass) {
		if (typeof(username) == "string" & typeof(pass) == "string")
		{
			users().forEach(function(e){
				if (e.nickname == username)
					throw new Error("Пользователь с таким именем уже существует");
			});
			let s = allUsers.push(new User(username,pass,["basic"]));
			return allUsers[s-1];
		}
		else {
			throw new Error("Жопа");
		}
	};

	function deleteUser(user) {
		if (!ExistUser(user))
			throw new Error("Ошибка пользователя");
		else
		{
			let i = allUsers.indexOf(user);
			if (i > -1)
				allUsers.splice(i, 1);
			else 
				throw new Error("Пользователь не найден");
		}
	};

	function users() {
		return allUsers;
	};

	//создает рандомную строку
	function makeString() {
	  let text = "";
	  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	  for (let i = 0; i < 5; i++)
	    text += possible.charAt(Math.floor(Math.random() * possible.length));

	  return text;
	}

	function createGroup() {
		let s = makeString();
		allGroups[s] = [];
		return s;
	};

	function deleteGroup(group) {
		if (group in allGroups)
		{
			delete allGroups[group];
			allUsers.forEach(function(user){
				UpdateUser(user);
			})
		}
		else
			throw new Error("Уже удалили");
	};

	function groups() {
		return Object.keys(allGroups);
	};

	function subAddUserToGroup(user, group){
		if (!ExistUser(user))
			throw new Error("Ошибка пользователя");
		else
		{
			if (groups().indexOf(group) < 0)
				throw new Error("Ошибка группы");

			let flag = false; // if flag==false => user:string, if flag==true => user:object
			let i = 0;
			let obj = null;

			if (typeof(user) === "string")
				flag = false;
			else 
				flag = true;

			if (flag){
				//for user:obj
				obj = allUsers[allUsers.indexOf(user)];
			} else {
				//for user:string
				users().forEach(function(u){
					if (u.nickname == user)
					{
						obj = u;
						return;
					}
					if (obj != "null") return;
				});
			}

			if (Array.isArray(group))
				group.forEach(function(element){
					obj.groups.push(element);
				});
			else{
				obj.groups.push(group);
			}
			return true;
		}
	}

	function addUserToGroup(user, group) {
			if (user == "null" | group == "null")
				throw new Error("Неккоректные входные данные");
			if (Array.isArray(user)){
				user.forEach(function(us)
				{
					subAddUserToGroup(us, group);
				});
			}else {
				subAddUserToGroup(user, group);
			}
		
	};

	function userGroups(user) {
		if (typeof(user) == "object" & ExistUser(user))
			return user.groups;
		else if (typeof(user) == "string") {
			let obj;
			users().forEach(function(u){
				if (u.nickname == user)
				{
					obj = u;
					return;
				}
				if (obj != "null") return;
			});
			if (obj.groups != "null")
				return obj.groups;
		}
	};

	function removeUserFromGroup(user, group) {
			if (!ExistUser(user))
				throw new Error("Ошибка пользователя");
			else
			{
				let obj;
				
				if (typeof(user) === "string")
				{
					//for user:string
					users().forEach(function(u){
						if (u.nickname == user)
						{
							obj = u;
							return;
						}
					});
				} else {
					//for user:obj
					obj = allUsers[allUsers.indexOf(user)];
				}

				let positionGroup = obj.groups.indexOf(group);
				if (obj.groups.length != 0 & positionGroup > -1)
				{
					obj.groups.splice(positionGroup, 1);
				}
				else { 
					throw new Error("Уже удален из группы");
				}
			}
	};

	function createRight() {
		let s = makeString();
		allRights.push(s);
		return s;
	};

	function deleteRight(right) {
		let positionRight = allRights.indexOf(right);
		if (right != 'null' & positionRight > -1)
		{
			allRights.splice(positionRight, 1);
			Object.keys(allGroups).forEach(function(group){
				UpdateGroup(group);
			})
		}
		else
			throw new Error("Уже удалено это право");
	};

	function groupRights(group) {
		let groupRights = [];
		let keysArrayGroup = Object.keys(allGroups);
		if (keysArrayGroup.indexOf(group) < 0)
			throw new Error("Ошибка входных данных");
		else
		{
			// allGroups[group].forEach(function(right){
			// 	groupRights.push(right);
			// });
			groupRights = groupRights.concat(allGroups[group]);
		}
		return groupRights;
	};

	function rights() {return allRights;};

	function addRightToGroup(right, group) {
		if (Array.isArray(right))
		{
			right.forEach(function(right)
			{
				if (allRights.indexOf(right) > -1)
					if (allGroups[group].indexOf(right) > -1){
					//I don't know why, but it is need for test.	
					} 
					else
					if (allGroups[group].indexOf(right) < 0)
						allGroups[group].push(right);
					else throw new Error("Право уже есть");
				else 
					throw new Error("Ошибка входных данных");
			}	);
		} else {
			if (allRights.indexOf(right) > -1)
				if (allGroups[group].indexOf(right) > -1){
					//I don't know why, but it is need for test.	
				}
				else
				if (allGroups[group].indexOf(right) < 0)
					allGroups[group].push(right);
				else throw new Error("Право уже есть");
			else 
				throw new Error("Ошибка входных данных");
		}
	};

	function removeRightFromGroup(right, group) {
		let i = allGroups[group].indexOf(right);
		if (i > -1)
			allGroups[group].splice(i,1);
		else 
			throw new Error("Ошибка входных данных");
	};

	function userRights(user) {
		let userRights = [];
		let arrayGroups = userGroups(user);

		let arrayRights = [];
		arrayGroups.forEach(function(group){
			groupRights(group).forEach(function(right){
				if (userRights.indexOf(right) < 0)
					userRights.push(right);
			});
//			userRights = userRights.concat();
		});

		return userRights;
	}

	let AuthorizedFlag = false;
	let CurrentUser = new User();

	function login(username, password) {
		let resultflag = false;
		users().forEach(function(user){
			if (!resultflag)
				if (user.nickname == username & user.password == password & AuthorizedFlag == false)
				{
					CurrentUser = user;
					resultflag = true;
					AuthorizedFlag = true;
					return;
				} else resultflag = false;
		});
		return resultflag;
	};

	function currentUser() {
		if (AuthorizedFlag)
			return CurrentUser;
	};

	function logout() {
		CurrentUser = new User();
		AuthorizedFlag = false;
	};

	function isAuthorized(user, right) {
		if (!ExistUser(user) | right == "null" | allRights.indexOf(right) < 0)
			throw new Error("Ошибка пользователя");
		else
		{
			if (userRights(user).indexOf(right) > -1) 
				return true;
			else return false;
		}
	};