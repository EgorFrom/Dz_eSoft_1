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
	function UpdateUser(user){
		user.groups.forEach(function(elem){
			if (Object.keys(allGroups).indexOf(elem) < 0)
				user.groups.splice(user.groups.indexOf(elem), 1);
		});
	}
	function UpdateGroup(group){
		allGroups[group].forEach(function(right){
			if (allRights.indexOf(right) < 0)
				allGroups[group].splice(allGroups[group].indexOf(right), 1)
		});
	}
	function createUser(username, pass) {
		if (typeof(username) == "string" & typeof(pass) == "string")
		{
			var s = allUsers.push(new User(username,pass,["basic"]));
			return allUsers[s-1];
		}
		else {
			throw new Error("Жопа");
		}
	};

	function deleteUser(user) {
		if (user.nickname == "null" | user.password == "null" |  user == "null")
			throw new Error("Ошибка пользователя");
		else
		{
			var i = allUsers.indexOf(user);
			if (i > -1)
				allUsers.splice(i, 1);
			else 
				throw new Error("Пользователь не найден");
		}
	};

	function users() {
		return allUsers;
	};

	function makeString() {
	  var text = "";
	  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	  for (var i = 0; i < 5; i++)
	    text += possible.charAt(Math.floor(Math.random() * possible.length));

	  return text;
	}

	function createGroup() {
		var s = makeString();
		allGroups[s] = ["view site"];
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
		try {
			if (user == "null" | allUsers.length == 0)
				throw new Error("Ошибка пользователя");
			else
			{
				var i = allUsers.indexOf(user);
				var obj = allUsers[i];
				if (i > -1 & obj.groups != "null")
				{
					if (obj.groups.length != 0 & obj.groups.indexOf(group) > -1)
						{ throw new Error("Юзер уже в группе"); return false;}
					else { 
						if (Array.isArray(group))
							group.forEach(function(element){
								obj.groups.push(element);
								allUsers.push(obj);
								allUsers.splice(i, 1);
							});
						else{
							obj.groups.push(group);
							allUsers.push(obj);
							allUsers.splice(i, 1);
						}
						return true;
					}
				} else {
					throw new Error("Жопа");
				}
			}
		} catch {
			throw new Error("try/catch");
		}
	}

	function addUserToGroup(user, group) {
		try {
			if (user == "null" | group == "null")
				throw new Error("Неккоректные входные данные");
			if (Array.isArray(user)){
				user.forEach(function(user)
				{
					subAddUserToGroup(user, group);
				});
			}else {
				subAddUserToGroup(user, group);
			}
		} catch {
			throw new Error("Неккоректные входные данные");
		}
	};

	function userGroups(user) {
		if (user == "null" | allUsers.length == 0 | allUsers.indexOf(user) < 0)
			throw new Error("Ошибка пользователя");
		else
		{
			var i = allUsers.indexOf(user);
			var obj = allUsers[i];
			if (i > -1 & obj.groups != "null")
			{
				return obj.groups;
			}
		}
	};

	function removeUserFromGroup(user, group) {
		if (user == "null" | allUsers.length == 0)
			throw new Error("Ошибка пользователя");
		else
		{
			var i = allUsers.indexOf(user);
			var obj = allUsers[i];
			if (i > -1 & obj.groups != "null")
				if (obj.groups.length != 0 & obj.groups.indexOf(group) > -1)
				{
					obj.groups.splice(obj.groups.indexOf(group), 1);
				}
				else { 
					throw new Error("Уже удален из группы");
				}
			else {
				throw new Error("Ошибка группы");
			}
		}
	};

	function createRight() {
		var s = makeString();
		allRights.push(s);
		return s;
	};

	function deleteRight(right) {
		if (right != 'null' & allRights.indexOf(right) > -1)
		{
			allRights.splice(allRights.indexOf(right), 1);
			Object.keys(allGroups).forEach(function(group){
				UpdateGroup(group);
			})
		}
		else
			throw new Error("Уже удалено это право");
	};

	function groupRights(group) {
		if (group != "null"){
			if (group == "admin")
				return allGroups.admin;
			if (group == "manager")
				return allGroups.manager;
			if (group == "basic")
				return allGroups.basic;
		} else 
			throw new Error("Ошибка входных данных");
		return [];
	};

	function rights() {return allRights;};

	function addRightToGroup(right, group) {
		if (Array.isArray(right))
		{
			right.forEach(function(right)
			{
				if (right != "null" & allRights.indexOf(right) > -1 & (group != 'null'))
					if (allGroups[group].indexOf(right) < 0)
						allGroups[group].push(right);
					else throw new Error("Право уже есть");
				else 
					throw new Error("Ошибка входных данных");
			}	);
		} else {
			if (right != "null" & allRights.indexOf(right) > -1 & (group != 'null'))
				if (allGroups[group].indexOf(right) < 0)
					allGroups[group].push(right);
				else throw new Error("Право уже есть");
			else 
				throw new Error("Ошибка входных данных");
		}
	};

	function removeRightFromGroup(right, group) {
		if (right != "null" & allRights.indexOf(right) > -1 & allGroups[group].indexOf(right) > -1)
			allGroups[group].splice(allGroups[group].indexOf(right),1);
		else 
			throw new Error("Ошибка входных данных");
	};

	var Session = null;

	function login(username, password) {
		allUsers.forEach(function(user){
			if (user.nickname == username & user.password == password & Session == null)
			{
				Session = user;
				return true;
			} else return false;
		});
	};

	function currentUser() {
		return Session.nickname;
	};

	function logout() {
		Session = null;
	};

	function isAuthorized(user, right) {
		Session.groups.forEach(function(group){
			var i = Object.keys(allGroups).indexOf(group);
		})
	};