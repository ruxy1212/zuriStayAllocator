import LocalStorage from './localstorage.js';

  var DBNAME = 'allocation_dbvnc1';
  var alldata = [];
  let LS = new LocalStorage(DBNAME);
  // LS.setData([]);
  // set data
  // LS.setData([
  //   {
  //     "name":"Afghanistan",
  //     "code":"AE"
  //   },
  //   {
  //     "name":"Virgin Islands, U.S.",
  //     "code":"VI"
  //   },
  //   {
  //     "name":"Zimbabwe",
  //     "code":"ZW"
  //   }
  // ]);

  alldata = LS.getAll();
  if(alldata == null){
    alldata = [
      {
        "name":"nAfghanistan", 
        "code":"nAE"
      }
    ];
  }else {
    alldata.push({
      "name":"nAfghanistan", 
      "code":"nAE"
    });
  }
  
  // console.log(alldata);
  
  LS.setData(alldata);

  var theDiv = document.getElementById('output');

  // get recordcount
  theDiv.innerHTML += 'Total records: ' + LS.getRecordCount() + '<br/>';

  // get a specific item
  theDiv.innerHTML += 'Last record: ' + LS.getData(LS.getRecordCount(),'name') + '<br/>';

  theDiv.innerHTML += 'This is the data:<hr/>';

  var alldata = LS.getAll();
  alldata.forEach((item, i) => {
    theDiv.innerHTML += i + '. ' + item['name'] + ': ' + item['code'] + '<br/>';
  });
