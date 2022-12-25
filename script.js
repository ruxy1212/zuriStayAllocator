var roomNum;
var DBNAME = 'allocation_db';
var alldata = [];
let LS = new LocalStorage(DBNAME);

//=================================================================
var facilitators = 4, frontends = 5, smartcon = 10, backends = 5;
var developers = frontends + smartcon + backends;
//=================================================================
var deveCount, faciCount, devSet1, devSet2, devSet3;
var faciRem, devRem1, devRem2, devRem3, deveRem;
//=================================================================

function navFunction() {
    var x = document.getElementById("topnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

  document.addEventListener('mouseup', function (e) {
      var navcon = document.getElementById('topnav');
      if(!navcon.contains(e.target) && navcon.classList.contains('responsive')){
          navcon.className = "topnav";
      }
  });

var accordion = document.getElementsByClassName("accordion-head");
for (var i = 0; i < accordion.length; i++) {
  accordion[i].addEventListener("click", function() {
    
    if(this.classList.contains('active-accordion')){
        for(var j=0; j<accordion.length; j++){
            accordion[j].classList.remove('active-accordion');
            accordion[j].nextElementSibling.style.maxHeight = null;
        }
    }else{
        for(var j=0; j<accordion.length; j++){
            accordion[j].classList.remove('active-accordion');
            accordion[j].nextElementSibling.style.maxHeight = null;
        }
    
        this.classList.toggle("active-accordion");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        } 
    }
    
  });
}

var roleRads = document.querySelectorAll('input[name="role"]');
var addBtns = document.querySelectorAll('a[class="add-btn"]');
for(var roleRad of roleRads){
    roleRad.addEventListener('change', function(e){
        if(this.checked && this.value == "Developer") {
            document.querySelectorAll('.form-groupie')[3].classList.remove('unsee');
            document.querySelectorAll('.form-groupie')[3].querySelector('select[name="skill"]').disabled = false;
        } else if(this.checked && this.value == "Facilitator") {
            document.querySelectorAll('.form-groupie')[3].classList.add('unsee');
            document.querySelectorAll('.form-groupie')[3].querySelector('select[name="skill"]').disabled = true;
        }
    });
}

for(var addBtn of addBtns){
    addBtn.addEventListener('click', function(e){
        roomNum = Array.from(addBtns).indexOf(e.target);
        document.getElementById('roomNum').innerHTML = roomNum+1;
        document.querySelector('.modal').classList.remove('unsee');
    });
}

function closeModal(){
    roomNum = 0;
    document.querySelector('.modal').classList.add('unsee');
    document.getElementById('addForm').reset();
}

function processForm(){
    headCount();
    var roomNumber = document.getElementById('roomNum').innerHTML;
    form = document.getElementById('addForm');
    var fullName = form.elements['name'].value;
    var devFaci = form.elements['role'].value;
    var feMale = form.elements['gender'].value;
    var skillSet = form.elements['skill'].value;
    alldata = LS.getAll();
    if(alldata == null){
      alldata = [{
        "room": roomNumber,
        "name": fullName,
        "role": devFaci,
        "gender": feMale,
        "skill": skillSet
      }];

      LS.setData(alldata);
      tableUpdate();
      headCount();
      alert('Allocation was successful!');
    }else {

//check the following:
//if(dev or faci) (1)=>number of devs(>2), number of stack-specified(>1) : (2)=>num of faci(>0)
//if(gender==male)//gender-inequality
// faciRem
// deveRem
// devRem1
// devRem2
// devRem3    
        var rec = LS.getCodeByName('room', roomNumber);
        var skil=0, devs=0, errors=false;
        if(rec.length>0){
            rec.every((item, i) => {
                if(item['gender'] == "Female" && feMale == "Male"){
                    alert("There is a female here already, find another room please!");
                    errors=true;
                    return false;
                }else if(item['gender'] == "Male" && feMale == "Female"){
                    alert("There are males here already, find another room please!");
                    errors=true;
                    return false;
                }
                if(devFaci == "Facilitator"){
                    if(faciRem < 1 && devFaci == "Facilitator"){
                        alert("All spaces for facilitators have already been allocated! Thank you.");
                        errors=true;
                        return false;
                    }
                    if(item['role'] == "Facilitator" && devFaci == "Facilitator"){
                        alert("There is a facilitator here already, find another room please!");
                        errors=true;
                        return false;
                    }
                }else if(devFaci == "Developer"){
                    if(deveRem < 1){
                        alert("All spaces for developers have already been allocated! Thank you.");
                        errors=true;
                        return false;
                    }

                    if(item['skill'] == skillSet){
                        if(skil>0){
                            alert("There are already 2 Devs with same skillset, find another room please!");
                            errors=true;
                            return false;
                        }else{
                            skil++;
                        }
                    }
                    if(devs>1){
                        alert("There are already 3 Devs here, find another room please!");
                        errors = true;
                        return false;
                    }else{
                        devs++;
                    }
                }
                return true;
            });
        }

        if(devRem1 < 1 && skillSet == "Frontend"){
            alert("All spaces for frontend devs have already been allocated!");
            errors=true;
        }if(devRem2 < 1 && skillSet == "Backend"){
            alert("All spaces for backend devs have already been allocated!");
            errors=true;
        }if(devRem3 < 1 && skillSet == "Smart Contract"){
            alert("All spaces for smart contract devs have already been allocated!");
            errors=true;
        }
        
        if(errors == false){
            alldata.push({
                "room": roomNumber,
                "name": fullName,
                "role": devFaci,
                "gender": feMale,
                "skill": skillSet
              });

            LS.setData(alldata);
            tableUpdate();
            alert('Allocation was successful!');
        }else {
            // alert('Uncaught error! Please contact the developer');
            return;
        }
    }
    
}

function tableUpdate(){
    if(LS.getAll() != null){
        for(var j=1; j<=6; j++){
            var parent = document.querySelectorAll('.flex-child'), skill, deveCount=0, faciCount=0;
            var rec = LS.getCodeByName('room', j);
            if(rec.length>0){
                parent[j-1].querySelector('.table-header').style["white-space"] = "nowrap";
                parent[j-1].querySelector('.table-data ').innerHTML = "";
                rec.forEach((item, i) => {
                    ( item['role'] == "Developer" ) ? skill = item['skill'] : skill = "All";
                    parent[j-1].querySelector('.table-data ').innerHTML += '<tr> <td>'+item['name']+'</td>  <td>'+item['role']+'</td>  <td>'+item['gender']+'</td>  <td>'+skill+'</td> </tr>';
                    ( item['role'] == "Developer" ) ? deveCount++ : '';
                    ( item['role'] == "Facilitator" ) ? faciCount++ : '';
                });
            }else{
                parent[j-1].querySelector('.table-header').style["white-space"] = "normal";
                parent[j-1].querySelector('.table-data').innerHTML = '<tr><td colspan="4" style="text-align:center;">There are no allocations for this room yet!</td></tr>';
            }
            parent[j-1].querySelectorAll('.accordion-head span')[0].innerHTML = faciCount;
            parent[j-1].querySelectorAll('.accordion-head span')[1].innerHTML = deveCount;
        }
    }else{
        for(var j=1; j<=6; j++){
            var parent = document.querySelectorAll('.flex-child');          
            parent[j-1].querySelector('.table-header').style["white-space"] = "normal";
            parent[j-1].querySelector('.table-data').innerHTML = '<tr><td colspan="4" style="text-align:center;">There are no allocations for this room yet!</td></tr>';
            parent[j-1].querySelectorAll('.accordion-head span')[0].innerHTML = 0;
            parent[j-1].querySelectorAll('.accordion-head span')[1].innerHTML = 0;
        }
    }
}

function tableUpdateAll(){
    if(LS.getAll() != null){
        for(var j=1; j<=6; j++){
            var parent = document.querySelector('.list-table'), skill;
            var rec = LS.getCodeByName('room', j);
            if(rec.length>0){
                rec.forEach((item, i) => {
                    ( item['role'] == "Developer" ) ? skill = item['skill'] : skill = "All";
                    parent.querySelector('.table-data').innerHTML += '<tr> <td>Room '+item['room']+'</td>  <td>'+item['name']+'</td>  <td>'+item['role']+'</td>  <td>'+item['gender']+'</td>  <td>'+skill+'</td> </tr>';
                });
            }else{
                if(parent.querySelector('.table-data').innerHTML == ""){
                    parent.querySelector('.table-data').innerHTML = '<tr> <td colspan="5" style="text-align:center;">There are no allocations yet!</td> </tr>';
                }
            }
        }
    }else{
        for(var j=1; j<=6; j++){
            var parent = document.querySelector('.list-table');
            if(parent.querySelector('.table-data').innerHTML == ""){
                parent.querySelector('.table-data').innerHTML = '<tr> <td colspan="5" style="text-align:center;">There are no allocations yet!</td> </tr>';
            }
        }
    }
}

function headCount(){
    deveCount=0; faciCount=0; devSet1=0; devSet2=0; devSet3=0;

    if(LS.getAll() != null){
        var all = LS.getAll();
        if(all.length>0){
            all.forEach((item, i) => {
                ( item['role'] == "Developer" ) ? deveCount++ : '';
                ( item['role'] == "Facilitator" ) ? faciCount++ : '';
                ( item['skill'] == "Frontend" ) ? devSet1++ : ''; //front
                ( item['skill'] == "Backend" ) ? devSet2++ : ''; //back
                ( item['skill'] == "Smart Contract" ) ? devSet3++ : ''; //blockchain
            });
            faciRem = facilitators - faciCount;
            deveRem = developers - deveCount;
            devRem1 = frontends - devSet1;
            devRem2 = backends - devSet2;
            devRem3 = smartcon - devSet3;
        }   
    }else{
        faciRem = facilitators - faciCount;
        deveRem = developers - deveCount;
        devRem1 = frontends - devSet1;
        devRem2 = backends - devSet2;
        devRem3 = smartcon - devSet3;
    }
}

function updateTableCount(){
    var parent = document.querySelectorAll('.stat-container .flex-child-3');

    parent[0].querySelectorAll('div')[0].querySelector('span').innerHTML = facilitators;
    parent[0].querySelectorAll('div')[1].querySelector('span').innerHTML = developers;
    parent[0].querySelectorAll('div')[2].querySelector('span').innerHTML = frontends;
    parent[0].querySelectorAll('div')[3].querySelector('span').innerHTML = backends;
    parent[0].querySelectorAll('div')[4].querySelector('span').innerHTML = smartcon;
    parent[1].querySelectorAll('div')[0].querySelector('span').innerHTML = faciCount;
    parent[1].querySelectorAll('div')[1].querySelector('span').innerHTML = deveCount;
    parent[1].querySelectorAll('div')[2].querySelector('span').innerHTML = devSet1;
    parent[1].querySelectorAll('div')[3].querySelector('span').innerHTML = devSet2;
    parent[1].querySelectorAll('div')[4].querySelector('span').innerHTML = devSet3;
    parent[2].querySelectorAll('div')[0].querySelector('span').innerHTML = faciRem;
    parent[2].querySelectorAll('div')[1].querySelector('span').innerHTML = deveRem;
    parent[2].querySelectorAll('div')[2].querySelector('span').innerHTML = devRem1;
    parent[2].querySelectorAll('div')[3].querySelector('span').innerHTML = devRem2;
    parent[2].querySelectorAll('div')[4].querySelector('span').innerHTML = devRem3;
}

function resetAll(){
    var response = confirm("Are you sure you want to reset and delete all data? Once deleted, all registered allocations will be permanently erased.")
            if(response == true){     
                window.localStorage.removeItem(DBNAME);  
                alert('Allocation system reset successful!');   
                window.location.reload();           
            }
            else{     
            // window.location = "index.php";    
                return false;
            }
}