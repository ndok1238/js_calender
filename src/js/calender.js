
class Calender {
    
    constructor(id, parameter){

        
        this.selPosition = -1;
        this.isdown = false;
        let today = new Date();
        this.curYear = today.getFullYear();
        this.curMonth = today.getMonth();
        this.instance = null;
        this.dateinfos = {};
        this.calpositions = {};


        /*
        Element Id For Calender Draw
        */
        this.domid = id;

        /*
        Visible or Invisible Other month's date
        */
        this.hasothers = true;

        /*
        Visible or Invisible Current Print Month Value
        */
        this.hasdatetxt = true;
        
        /*
        print Current Month Value Domid
        Format : Y-m
        */
        this.datedomid = "";
        
        /*
            prev button dom id
        */
        this.prevdomid = "";
        
        /*
            next button dom id
        */
        this.nextdomid = "";

        /*

        */
        this.datetitles = ['일','월','화','수','목','금','토'];

        /*
            Draw complete Callback
        */
        this.ondraw = null;

        /*
            Calender Click Callback
        */
        this.onclick = null;
        

        if(parameter != undefined && parameter != null){
            if(parameter.year != undefined){
                this.curYear = parameter.year;
            }
            if(parameter.month != undefined){
                this.curMonth = parameter.month;
            }
            if(parameter.dateid != undefined){
                this.datedomid = parameter.dateid;
            }
            if(parameter.hasdatetxt != undefined){
                this.hasdatetxt = parameter.hasdatetxt;
            }
            if(parameter.prevbtn != undefined){
                this.prevdomid = parameter.prevbtn;            
            }
            if(parameter.nextbtn != undefined){
                this.nextdomid = parameter.nextbtn;
            }
            if(parameter.datetitles != undefined && Array.isArray(parameter.datetitles)){
                this.datetitles = parameter.datetitles;
            }
            if(parameter.ondraw != undefined){                
                this.ondraw = parameter.ondraw;
            }
            if(parameter.onclick != undefined){
                this.onclick = parameter.onclick;
            }
        }
    }
    

    pressstart = function(e){
        this.#setupPositions();        
        let position = {left:e.clientX, top:(e.clientY+window.scrollY)};
        console.log(position);
        let chkeles = document.getElementsByClassName('calitem date');       
        
        for(var i in this.calpositions){
            let ele = this.calpositions[i]['ele'];
            let eleinfo = this.calpositions[i]['eleinfo'];
            if(this.isInclude(eleinfo, position)){
                
                this.selPosition = Number(i);

                ele.classList.add('pressed');
                e.preventDefault();         

                this.isdown = true;
                break;
            }
        }
    }

    pressover = function(e){                
        if(this.isdown) {
            e.preventDefault();
            
            // Clear pressed
            let chkeles = document.getElementsByClassName('calitem date');
            for(var i = 0 ; i < chkeles.length ; i++){
                let ele = chkeles[i];
                ele.classList.remove('pressed');
            }

            // Check out posiitons
            let position = {left:e.clientX, top:(e.clientY+window.scrollY)};
            
            var lastNum = -1;
            for(var i in this.calpositions){
                let eleinfo = this.calpositions[i]['eleinfo'];                    
                if(eleinfo.left <= position.left && eleinfo.top <= position.top){
                    lastNum = Number(i);
                }                     
            }

            // Setup pressed
            if(lastNum != -1){
                for(var i in this.calpositions){
                    if(this.selPosition <= lastNum){
                        if(this.selPosition <= Number(i) && Number(i) <= lastNum){
                            let ele = this.calpositions[i]['ele'];
                            ele.classList.add('pressed');
                        }
                    }else{                        
                        if(this.selPosition >= Number(i) && Number(i) >= lastNum){
                            let ele = this.calpositions[i]['ele'];
                            ele.classList.add('pressed');
                        }
                    }                    
                }
            }
        }
    }

    pressend = function(e){   
        
        if(this.isdown) {
            e.preventDefault();
        }

        var retrunData = [];
        let chkeles = document.getElementsByClassName('calitem date');
        for(var i = 0 ; i < chkeles.length ; i++){
            
            let ele = chkeles[i];
            if(ele.classList.contains('pressed')){
                let date = ele.getAttribute('data-date');                
                let data = {
                    element:ele,
                    date:date,
                    id:ele.getAttribute('id')
                };
                retrunData.push(data);
                
            }
            ele.classList.remove('pressed');
        }
        
        this.isdown = false;
        this.selPosition = -1;

        if(this.onclick != null){            
            this.onclick(retrunData);
        }
    }
    
    

    setupInstance(instance){
        this.instance = instance;
        document.addEventListener('mouseup', function(e){
            if(this.instance != null){
                this.instance.pressend(e);
            }            
        });
        document.addEventListener('mousemove', function(e){
            if(this.instance != null){
                this.instance.pressover(e);
            }
            
        });
    }

    nextMonth(){
    
        var tDate = new Date();
        tDate.setFullYear(this.curYear);
        tDate.setMonth(this.curMonth);
        tDate.setMonth(tDate.getMonth()+1);
    
        this.curYear = tDate.getFullYear();
        this.curMonth = tDate.getMonth();
        
        
        this.#draw();
    
    }
    
    prevMonth(){
        
        var tDate = new Date();
        tDate.setFullYear(this.curYear);
        tDate.setMonth(this.curMonth);
        tDate.setDate(0);    
    
        this.curYear = tDate.getFullYear();
        this.curMonth = tDate.getMonth();
        
        this.#draw();
    
    }

    load(){

        var addHtml = "<div class='calender'>";

        var prevSelectId = "";
        var nextSelectId = "";

        let hasdatedomid = this.datedomid != '';

        if((this.prevdomid == '' && this.nextdomid == '') || (this.hasdatetxt && !hasdatedomid) ){
            addHtml += "<div class='calender-title'>";
        }
        if(this.hasdatetxt && !hasdatedomid){
            this.datedomid = "calender-datetitle";
            addHtml += "<h1 id='"+this.datedomid+"'></h1>";
        }

        if(this.prevdomid == '' && this.nextdomid == ''){

            prevSelectId = 'calenderPrevBtn';
            nextSelectId = 'calenderNextBtn';   
            addHtml += "<div class='calender-controls'>";
            addHtml += "<button type='button' id='"+prevSelectId+"'><span></span></button>";
            addHtml += "<button type='button' id='"+nextSelectId+"'><span></span></button>";
            addHtml += "</div>";

        }else{
            prevSelectId = this.prevdomid;
            prevSelectId = this.nextdomid;
        }

        if((this.prevdomid == '' && this.nextdomid == '') || (this.hasdatetxt && !hasdatedomid) ){
            addHtml += "</div>";
        }

        addHtml += "<div class='calender-gubuns'>";
        for(var i in this.datetitles){
            let title = this.datetitles[i];
            addHtml += "<div class='calender-gubuns-item'>";
            addHtml += title;
            addHtml += "</div>";
        }
        addHtml += "</div>";
        addHtml += "<div class='calender-body'></div>";
        addHtml += "</div>";

        
        document.getElementById(this.domid).innerHTML = addHtml;
        if(prevSelectId != ''){
            document.querySelector('#'+prevSelectId).addEventListener('click', () => {
                this.prevMonth();
            });
        }
        if(nextSelectId != ''){
            document.querySelector('#'+nextSelectId).addEventListener('click', () => {
                this.nextMonth();
            });
        }

        this.#draw();
    }

    #draw(){

        this.dateinfos = {};

        var titleHtml = this.curYear;
        if((this.curMonth+1) < 10){
            titleHtml += "-0"+(this.curMonth+1);
        }else{
            titleHtml += "-"+(this.curMonth+1);
        }
        
        document.getElementById(this.datedomid).innerHTML = titleHtml;
        
        let fDay = new Date();        
        fDay.setFullYear(this.curYear);
        fDay.setMonth(this.curMonth);        
        fDay.setDate(1);        
        let eDay = new Date();        
        eDay.setFullYear(this.curYear);
        eDay.setMonth(this.curMonth+1);        
        eDay.setDate(0);

        var startDay = fDay.getDay();
        var dateCnt = eDay.getDate();

        var date = 1;
        var rows = Math.ceil((dateCnt + startDay) / 7);        
        var startdate = startDay;        
        var calendarInfo = {};
        if(startDay > 0){
            date = -(startDay - 1);
        }

        var index = 0;
        var calendarHtml = "";
        for(var i =0; i< rows ; i++){

            calendarHtml += "<div class='calrow'>";
            for(var j =0; j< 7 ; j++){
                var tDay = new Date();        
                tDay.setFullYear(this.curYear);
                tDay.setMonth(this.curMonth);        
                tDay.setDate(date);
                
                var dateHtml = "";
                var addedClass = "";
                var addattr = "";

                if(!this.hasothers && (date <= 0 || index >= dateCnt )){
                    
                }else{                    
                    calendarInfo[index] = tDay;
                    this.dateinfos[index] = calendarInfo[index];
                    dateHtml = "<div class='number'>"+this.dateinfos[index].getDate()+"</div>";
                    addedClass = "date day-"+index+" date-"+calendarInfo[index].getDay();
                    if((date <= 0 || index >= dateCnt )){
                        addedClass += " otherdate";
                    }
    
                    var dayval = calendarInfo[index].getDate();
                    if(dayval < 10){
                        dayval = "0"+dayval;
                    }
                    var printMonth = "";
                    if((tDay.getMonth()+1) < 10){
                        printMonth += "0"+(tDay.getMonth()+1);
                    }else{
                        printMonth += (tDay.getMonth()+1);
                    }
                    addattr = 'data-date="'+tDay.getFullYear()+printMonth+dayval+'"';
                    addattr += ' id="calitem-'+index+'"';
                    index++;

                }

                calendarHtml += "<div class='calitem "+addedClass+"' "+addattr+" >";
                calendarHtml += dateHtml;
                calendarHtml += "</div>";

                date++;                
            }

            calendarHtml += "</div>";
        }

        let selectId = "#"+this.domid+" .calender .calender-body";

        let calbody = document.querySelector(selectId);
        calbody.innerHTML = calendarHtml;

        
        if(this.ondraw != null){
            let returndata = {
                year: this.curYear,
                month:this.curMonth
            }
            this.ondraw(returndata);
        }

    }

    #setupPositions(){
        this.calpositions = {};
        let selectId = "#"+this.domid+" .calender .calender-body .calitem";
        let calitems = document.querySelectorAll(selectId);
        for(var i = 0 ; i < calitems.length ; i++){            
            let ele = calitems[i];
            let eleinfo = this.getOffset(ele);
            this.calpositions[i] = {};
            this.calpositions[i]['ele'] = ele;
            this.calpositions[i]['eleinfo'] = eleinfo;
        }        
    }

    getOffset(el) {
        const rect = el.getBoundingClientRect();
        console.log(rect);
        return {
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY,
          width:rect.width,
          height:rect.height
        };
    }

    isInclude(ele, position){
        var limitRight = ele.left + ele.width;
        var limitBottom = ele.top + ele.height;
        if(position.left >= ele.left && position.left <= limitRight && position.top >= ele.top && position.top <= limitBottom){            
            return true;
        }

        return false;
    }
}
