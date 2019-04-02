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
	function ExistUser(user) {
		ExistingFlag = false;
		users().forEach(function(e){
				if (e.nickname == user.nickname)
					ExistingFlag = true;
			});
		return ExistingFlag;
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
			users().forEach(function(e){
				if (e.nickname == username)
					throw new Error("Пользователь с таким именем уже существует");
			});
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
		if (user == "null" | allUsers.length == 0)
			throw new Error("Ошибка пользователя");
		else
		{
			if (groups().indexOf(group) < 0)
				throw new Error("Ошибка группы");

			let flag = false; // false - string, true - object
			if (typeof(user) === "string")
				flag = false;
			else 
				flag = true;
			var i = 0;
			var obj = null;
			if (flag){
				users().forEach(function(u){
					i++;
					if (u == user)
					{
						obj = u;
						return;
					}
					if (obj != null) return;
				});
			} else {
				users().forEach(function(u){
					i++;
					if (u.nickname == user)
					{
						obj = u;
						return;
					}
					if (obj != null) return;
				});
			}
			if (i > -1 & obj.groups != "null")
			{
				{ 
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
			} 
		}
	}

	function addUserToGroup(user, group) {
			if (user == null | group == null)
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
		if (typeof(user) == "object" & user.groups != "null" & ExistUser(user))
			return user.groups;
		else if (typeof(user) == "string") {
			if (user == "null" | allUsers.length == 0)
				throw new Error("Ошибка пользователя");
			else
			{
				var obj;
				users().forEach(function(u){
					if (u.nickname == user)
					{
						obj = u;
						return;
					}
				});
				if (obj.groups != "null")
				{
					return obj.groups;
				}
			}
		}
	};

	function removeUserFromGroup(user, group) {
			if (user == "null" | allUsers.length == 0)
				throw new Error("Ошибка пользователя");
			else
			{
				let flag = false; // false - string, true - object
				let obj;
				try {
					if (typeof(user) === "string")
					{
						users().forEach(function(u){
							if (u.nickname == user)
							{
								obj = u;
								return;
							}
						});
					} else {
						users().forEach(function(u){
							if (u == user)
							{
								obj = u;
								return;
							}
						});
					}
				} catch {
					throw new Error("Ошибка введенного пользователя");
				}
				if (obj.groups != "null")
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
		var groupRights = [];
		var keysArrayGroup = Object.keys(allGroups);
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
					if (allGroups[group].indexOf(right) < 0)
						allGroups[group].push(right);
					else throw new Error("Право уже есть");
				else 
					throw new Error("Ошибка входных данных");
			}	);
		} else {
			if (allRights.indexOf(right) > -1)
				if (allGroups[group].indexOf(right) > -1){
					let er = 12;	
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
		var userRights = [];
		var arrayGroups = userGroups(user);

		var arrayRights = [];
		arrayGroups.forEach(function(group){
			groupRights(group).forEach(function(right){
				if (userRights.indexOf(right) < 0)
					userRights.push(right);
			});
//			userRights = userRights.concat();
		});

		return userRights;
	}

	var AuthorizedFlag = false;
	var CurrentUser = new User();

	function login(username, password) {
		let flag = false;
		users().forEach(function(user){
			if (!flag)
				if (user.nickname == username & user.password == password & AuthorizedFlag == false)
				{
					CurrentUser = user;
					flag = true;
					AuthorizedFlag = true;
					return;
				} else flag = false;
		});
		return flag;
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
			try {
				if (user == null | right == null | allUsers.length == 0 | allRights.indexOf(right) < 0)
					throw new Error("Ошибка пользователя");
				else
				{
					if (userRights(user).indexOf(right) > -1) 
						return true;
					else return false;
				}
			} catch{
				throw new Error("Ошибка входных данных");
			}
	};