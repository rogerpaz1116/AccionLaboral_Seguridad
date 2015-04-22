'use strict';

angular.module("employeesController", ['ngRoute', 'employeesRepository', 'alertRepository', 'usersRepository'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/Employees', {
            templateUrl: '/Employees/Index',
            controller: 'employeesCtrl'
        })
        .
        when('/Employees/Create', {
            templateUrl: '/Employees/Create',
            controller: 'employeesCtrl'
        }).
        when('/Employees/Edit/:id', {
            templateUrl: function (params) {
                return '/Employees/Edit/' + params.id;
            },
            controller: 'employeesCtrl'
        }).
        when('/Employees/Preview/:id', {
            templateUrl: function (params) {
                return '/Employees/Details/' + params.id;
            },
            controller: 'employeesCtrl'
        })
        .when('/Employees/Profile/:id', {
            templateUrl: function (params) {
                return '/Employees/Profile/' + params.id;
            },
            controller: 'employeesCtrl'
        })
    ;
}]
).filter('dateFormat', function($filter){
    return function(input){
        if (input == null) {
            return "";
        }
        var _date = $filter('date')(new Date(input), 'MMM dd yyyy');
        return _date;
    };
})
.controller('employeesCtrl', ['$scope', 'employeesRepo', '$routeParams', '$rootScope', '$location', '$filter', 'filterFilter', 'alertService', 'usersRepo', 'authService',
                                function ($scope, employeesRepo, $routeParams, $rootScope, $location, $filter, filterFilter, alertService, usersRepo, authService) {
    $scope.load = true;
    var actionEmployee = "";
    $scope.employeesList = [];
    $scope.employeesCareersList = [];
    $scope.employeesUsersList = [];
    $scope.employeesRolesList = [];
    $scope.employeeId = $routeParams.id;


    if (!$rootScope.alerts)
        $rootScope.alerts = [];

    $scope.calculateEmployeeAge = function () {
        var birthday = +new Date($scope.employee_Birthday);
        var age = ~~((Date.now() - birthday) / (31557600000));
        $scope.employee_Age = age;
    }

    $scope.$watch('$routeChangeSuccess', function () {
        employeesRepo.getEmployeesList().success(function (data) {
            $scope.employeesList = data;
            $scope.totalServerItems = data.totalItems;
            $scope.items = data.items;
            $scope.load = false;
        })
        .error(function (data) {
            $scope.error = "Ha ocurrido un error al cargar los datos." + data.ExceptionMessage;
            $scope.load= false;
        })
    });

   
    //----------PROFILE PITCTURE-----------------------
    $scope.handleFileSelectAdd = function (evt) {

        var f = evt.target.files[0];
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                var filePayload = e.target.result;
                $scope.episodeImgData = filePayload.replace('data:' + f.type + ';base64,', '');
                document.getElementById('imagenEmployee').src = filePayload;
            };
        })(f);
        reader.readAsDataURL(f);
    };

    var imageElement = document.getElementById('exampleInputFile');
    if (imageElement)
        imageElement.addEventListener('change', $scope.handleFileSelectAdd, false);


    $scope.handleFileSelectAdd = function (evt) {
        var f = evt.target.files[0];
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                var filePayload = e.target.result;
                $scope.employee_Photo = filePayload.replace('data:' + f.type + ';base64,', '');
                imageElement.src = filePayload;
                $scope.$apply(function () {

                });
            };
        })(f);
        reader.readAsDataURL(f);
    };



    //---------------------------------



    //Sorting
    $scope.sort = "EmployeeAlias";
    $scope.reverse = false;

    $scope.changeSort = function (value) {
        if ($scope.sort == value) {
            $scope.reverse = !$scope.reverse;
            return;
        }

        $scope.sort = value;
        $scope.reverse = false;
    }
    //End Sorting//

    $scope.$watch('search', function (term) {
        // Create $scope.filtered and then calculat $scope.noOfPages, no racing!
         
       
        $scope.filtered = filterFilter($scope.employeesList, term);
        $scope.noOfPages = ($scope.filtered) ? Math.ceil($scope.filtered.length / $scope.entryLimit) : 1;
    });

    $scope.itemsPerPageList = [5, 10, 20, 30, 40, 50];
    $scope.entryLimit = $scope.itemsPerPageList[0];
    $scope.setEmployeeData = function () {
        employeesRepo.getEmployeesList().success(function (data) {
            $scope.employeesList = data;
            $scope.totalServerItems = data.totalItems;
            $scope.items = data.items;
            $scope.load = false;

            if ($rootScope.alerts)
                $scope.alertsTags = $rootScope.alerts;
            $scope.currentPage = 1; //current page
            $scope.maxSize = 5; //pagination max size

            $scope.noOfPages = ($scope.employeesList) ? Math.ceil($scope.employeesList.length / $scope.entryLimit) : 1;

            $scope.itemsInPage = ($scope.employeesList.length) ? ((($scope.currentPage * $scope.entryLimit) > $scope.employeesList.length) ?
                                        $scope.employeesList.length - (($scope.currentPage - 1) * $scope.entryLimit) : $scope.entryLimit) : 0;
        })
        .error(function (data) {
            $scope.error = "Ha ocurrido un error al cargar los datos." + data.ExceptionMessage;
            $scope.load = false;
        });

    };

    $scope.setEmployeeData();

    employeesRepo.getEmployeesCareers().success(function (data) {
        $scope.employeesCareersList = data;
    });

    

    employeesRepo.getEmployeesRoles().success(function (data) {
        $scope.employeesRolesList = data;
    });

    if ($scope.employeeId == null) {
        actionEmployee = "add";
        $scope.editUserName = true;
        $scope.employee_modalTitle = "Agregar Empleado";
        $scope.employee_buttonName = "Agregar";

        employeesRepo.getEmployeesUsersFree().success(function (data) {
            $scope.employeesUsersList = data;
        });
    }
    else {
        actionEmployee = "edit";
        $scope.editUserName = false;
        $scope.employee_modalTitle = "Editar Empleado";
        $scope.employee_buttonName = "Editar";
        var id = $scope.employeeId;

        employeesRepo.getEmployeesUsers().success(function (data) {
            $scope.employeesUsersList = data;
        });

        employeesRepo.getEmployee(id).success(function (data) {
            
            $scope.employee_EmployeeId = data.EmployeeId;
            $scope.employee_FirstName = data.FirstName;
            $scope.employee_LastName = data.LastName;
            $scope.employee_Email = data.Email;
            $scope.employee_Birthday = new Date(data.Birthday);
            $scope.employee_Age = data.Age;
            $scope.employee_Cellphone = data.Cellphone;
            $scope.employee_HomePhone = data.HomePhone;
            $scope.employee_Address = data.Address;
            $scope.employee_Gender = data.Gender;
            $scope.employee_EmployeeAlias = data.EmployeeAlias;
            $scope.employee_AdmissionDate = data.AdmissionDate;
            $scope.employee_Career = data.CareerId;
            $scope.employee_Role = data.RoleId;
            $scope.employee_User = data.UserId;
            $scope.employee_Photo = data.Photo;
        });
    }

    $scope.screenAction = actionEmployee;

    
    $scope.viewMyProfile = function (employeeId) {
        window.location = "#/Employees/Preview/" + employeeId;
    }
    

    $scope.employee_addNewRedirect = function () {
        window.location = "#/Employees/Create";
    }

    $scope.employee_editRedirect = function (employee) {
        window.location = "#/Employees/Edit/" + employee.EmployeeId;
    }

    $scope.employee_viewRedirect = function (index) {
        var id = $scope.employeesList[index].EmployeeId;
        window.location = "#/Employees/Preview/" + id;
    }

    $scope.employee_cancelRedirect = function () {
        window.location = "#/Employees";
    }

    $scope.employeeProfile_cancelRedirect = function () {
        window.location = "#/";
    }


    $scope.clearData = function () {
        $scope.employee_EmployeeId = "";
        $scope.employee_FirstName = "";
        $scope.employee_LastName = "";
        $scope.employee_Email = "";
        $scope.employee_Birthday = "";
        $scope.employee_Age = "";
        $scope.employee_Cellphone = "";
        $scope.employee_HomePhone = "";
        $scope.employee_Address = "";
        $scope.employee_Gender = "";
        $scope.employee_EmployeeAlias = "";
        $scope.employee_AdmissionDate = "";
        $scope.employee_Career = "";
        $scope.employee_Role = "";
        $scope.employee_User = "";
    }

    $scope.saveEmployee = function () {
        var exists = false;
        
        if (!exists) {
            
            var user;
            var id = $scope.employee_User;
            //usersRepo.getUser(id).success(function (data) {
            //    user = data;
            //})
            //.error(function () {
            //    $scope.alertsTags = $rootScope.alerts;
            //});
            //user.Busy = true;

            for(var i=0; i<$scope.employeesUsersList.length; i++){
                if($scope.employeesUsersList[i].UserId == id)
                    user = $scope.employeesUsersList[i];
            }
            user.Busy = true;

            var employee;
            
            if (actionEmployee == "add") {
                employee = {
                    FirstName: $scope.employee_FirstName,
                    LastName: $scope.employee_LastName,
                    Email: $scope.employee_Email,
                    Birthday: $scope.employee_Birthday,
                    Age: $scope.employee_Age,
                    Cellphone: $scope.employee_Cellphone,
                    HomePhone: $scope.employee_HomePhone,
                    Address: $scope.employee_Address,
                    Gender: $scope.employee_Gender,
                    EmployeeAlias: $scope.employee_EmployeeAlias,
                    AdmissionDate: new Date(),
                    CareerId: $scope.employee_Career,
                    RoleId: $scope.employee_Role,
                    UserId: $scope.employee_User,
                    Photo: $scope.episodeImgData
                };

                
                
                usersRepo.updateUser(function () {
                }, user).success(function () {
                    $scope.alertsTags = $rootScope.alerts;
                    $scope.setEmployeeData();
                }).error(function () {
                    $scope.alertsTags = $rootScope.alerts;
                });


                employeesRepo.insertEmployee(function () {
                }, employee).success(function () {
                    alertService.add('success', 'Mensaje', 'El Empleado se ha insertado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                    $scope.setEmployeeData();

                    
                    $scope.load = false;
                }).error(function () {
                    alertService.add('danger', 'Error', 'No se ha podido insertar el registro.');
                    $scope.alertsTags = $rootScope.alerts;
                    $scope.load = false;
                });
                
            }
            else {
                employee = {
                    EmployeeId: $scope.employee_EmployeeId,
                    FirstName: $scope.employee_FirstName,
                    LastName: $scope.employee_LastName,
                    Email: $scope.employee_Email,
                    Birthday: $scope.employee_Birthday,
                    Age: $scope.employee_Age,
                    Cellphone: $scope.employee_Cellphone,
                    HomePhone: $scope.employee_HomePhone,
                    Address: $scope.employee_Address,
                    Gender: $scope.employee_Gender,
                    EmployeeAlias: $scope.employee_EmployeeAlias,
                    AdmissionDate: $scope.employee_AdmissionDate,
                    CareerId: $scope.employee_Career,
                    RoleId: $scope.employee_Role,
                    UserId: $scope.employee_User,
                    Photo: $scope.episodeImgData
                };

                employeesRepo.updateEmployee(function () {
                }, employee).success(function () {
                    alertService.add('success', 'Mensaje', 'El Empleado se ha editado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                    $scope.setEmployeeData();

                    if ($rootScope.userLoggedIn.EmployeeId == employee.EmployeeId) {
                        $rootScope.userLoggedIn.Photo = employee.Photo;
                        $rootScope.userLoggedIn.FirstName = employee.FirstName;

                        authService.updateAuthenticationData($rootScope.userLoggedIn).then(function (response) {
                            $rootScope.userLoggedIn = authService.authentication.employee;
                        },
                    function (err) {
                        $scope.message = err.error_description;
                        $scope.addAlert("danger", "Ha ocurrido un error en el servidor.");
                    });

                    }


                    $scope.load = false;
                }).error(function () {
                    alertService.add('danger', 'Error', 'No se ha podido editar el registro.');
                    $scope.alertsTags = $rootScope.alerts;
                    $scope.load = false;
                });

            }
            $scope.clearData();
            $scope.employee_cancelRedirect();

        }
        else {
            alertService.add('danger', 'Error', 'Ya existe un empleado con ese nombre.');
        }
        
    };

    $scope.setEmployeeToDelete = function (employee) {
        $scope.employeeToDeleteId = employee.EmployeeId;
    };

    $scope.cancelEmployeeDelete = function () {
        $scope.employeeToDeleteId = "";
    };

    $scope.deleteEmployee = function () {
        $scope.load = true;
        employeesRepo.deleteEmployee(function () {
        }, $scope.employeeToDeleteId).success(function () {
            alertService.add('success', 'Mensaje', 'El Empleado se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
            $scope.cancelEmployeeDelete();
            $scope.setEmployeeData();
            $scope.load = false;
        }).error(function () {
            alertService.add('danger', 'Error', 'No se ha podido eliminar el registro.');
            $scope.alertsTags = $rootScope.alerts;
            $scope.load = false;
        });
    }
    
    
}]);