var accionLabControllers = angular.module('usersRepository', []);

accionLabControllers.factory('usersRepo', ['$http', function ($http) {
    var url = 'api/Users';
    return {
        getUsersList: function (callback) {
            return $http.get(url);
        },
        //method for insert
        insertUser: function (callback, user) {
            var user = {
                "UserName": user.UserName,
                "Password": user.UserName,
                "Active": true,
                "Busy": false,
            };
            return $http.post(url, user);
        },
        //method for update
        //updateUser: function (callback, user) {
        //    var user = {
        //        "UserId": user.UserId,
        //        "UserName": user.UserName,
        //        "Password": user.Password
        //    };
        //    return $http.put(url + '/' + user.UserId, user);
        //},
        updateUser: function (callback, user) {
            return $http.put(url + '/' + user.UserId, user);
        },
        //method for delete
        deleteUser: function (callback, id) {
            return $http.delete(url + '/' + id);
        },
        //method for login
        login: function (userName, password) {
            
            var user = {
                "UserName": userName,
                "Password": password
            };
            return $http.post(url + '/Login', user);
        }
        ,
        requestChangePassword: function (userName) {
            var user = {
                "UserName": userName
            };
            return $http.post(url + '/RequestChangePassword', user);
        },
        validateUserName: function (userName) {
            var user = {
                "UserName": userName
            };
            return $http.post(url + '/ValidateUserName', user);
        },
        changePassword: function (userName, password) {
            var user = {
                "UserName": userName,
                "Password": password
            };
            return $http.put(url + '/ChangePassword', user);
        },
        getUser: function (id) {
            return $http.get(url + "/" + id);
        }
    }
}]);