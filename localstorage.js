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

  getCodeByName(key,value){
      var tmpOBJ = {};
      var dat =  this.getAll();
      tmpOBJ.data = dat;

      return  jsonPath(tmpOBJ, "$..data[?(@." + key + "=='" + value + "')]", {resultType:"VALUE"});
  }

  getNameByCode(key,code){
      var tmpOBJ = {};
      var dat =  this.getAll();
      tmpOBJ.data = dat;

      return  jsonPath(tmpOBJ, "$..data[?(@." + key + "=='" + code + "')]", {resultType:"VALUE"});
  }
}
