class LocalStorage {
  constructor (DBNAME){
    this.DBNAME = DBNAME;
  }

  getRecordCount(){
    var tmpdata = localStorage.getItem(this.DBNAME);
    tmpdata = JSON.parse(tmpdata);
    return tmpdata.length;
  }

  setData(inData){
    localStorage.setItem(this.DBNAME,JSON.stringify(inData));
  }

  getData(idx,key){
    // returns a data item from local storage
    // gets the db name, index and key to get
    var tmpdata = localStorage.getItem(this.DBNAME);
    return tmpdata[idx][key];
  }

  getAll(){
    var tmpdata = localStorage.getItem(this.DBNAME);
    tmpdata = JSON.parse(tmpdata);
    return tmpdata;
  }

  // test(){
  //   var tmpOBJ = [{"countries":""}];
  //   var dat =  this.getAll();
  //   tmpOBJ[0].countries = dat;
  //   return jsonPath(tmpOBJ, "$..countries[2]", {resultType:"VALUE"});
  // }


  getCodeByName(key,name){
      var tmpOBJ = {};
      var dat =  this.getAll();
      tmpOBJ.data = dat;

      return  jsonPath(tmpOBJ, "$..data[?(@." + key + "=='" + name + "')]", {resultType:"VALUE"});
  }

  getNameByCode(key,code){
      var tmpOBJ = {};
      var dat =  this.getAll();
      tmpOBJ.data = dat;

      return  jsonPath(tmpOBJ, "$..data[?(@." + key + "=='" + code + "')]", {resultType:"VALUE"});
  }
}

// export default class LocalStorage {