export default class LoggedUserCredentials {
    accessToken = '';
    userId='';
    userName = '';
    userType='';
    location={};


    static setLoggedUserData(accessToken,userId,userName,userType){
        this.accessToken = accessToken;
        this.userId = userId; 
        this.userName = userName; 
        this.userType = userType;
    }

    static getAccessToken(){
        return this.accessToken;
    }

    static getUserName(){
        return this.userName;
    }

    static getUserId(){
        return this.userId;
    }

    static getUserType(){
        return this.userType;
    }


    static setLocation(location){
        this.location = location;
    }

    static getLocation(){
        return this.location;
    }

  
}