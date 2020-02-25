(function() {
    'use strict';

    var termStepsHelper = {
        default_term: 24,
        index: 1,
        terms_array: [
            12,
            18, // index points to this 1 element as slider too
            24,
            36
        ],
        terms_obj: {
            'min': 12,
            '18':  18,
            '24':  24,
            'max': 36
        },
        dec_terms: function(){
            this.terms_array = [
                24,
                36
            ];
            this.terms_obj = {
                'min': 24,
                'max': 36
            },
            this.index = 0;
        },
        restore_terms: function() {
            this.terms_array = [
                12,
                18, // index points to this 1 element as slider too
                24,
                36
            ];
            this.terms_obj = {
                'min': 12,
                '18':  18,
                '24':  24,
                'max': 36
            },
            this.index = 1;
        },
        min: function() {
            return Math.min(this.terms_array);
        },
        max: function() {
            return Math.max(this.terms_array);
        },
        inc: function() {
            this.index++;
            if(this.index >= this.terms_array.length-1) {
                this.index = this.terms_array.length-1;
            }
        },
        dec: function() {
            this.index--;
            if(this.index < 0) {
                this.index = 0;
            }
        },
        value: function() {
            // console.log('value index:' + this.index);
            return this.terms_array[this.index];
        }
    }
        
    var renderValuesHelper = {
        renderAmount: function(amount) {
            // Create our number formatter.
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            // formatter.format(amount); /* result: $2,500.00 */
            amount = formatter.format(amount).replace(/\D00$/, ''); /* result: $3,500 */

            return amount;
        },
        
        renderTerm: function(term) {
            return parseInt(term) + ' months';
        }
    };
        
        
        
    var loanAmountSlider = document.getElementById('slider-step-amount');

    noUiSlider.create(loanAmountSlider, {
        start: [40000],
        step: 10000,
        connect: 'lower',
        range: {
            'min': [10000],
            'max': [100000]
        }
    });
        
    var stepSliderValueElementValue = document.getElementById('slider-step-amount-value');
    var stepSliderValueElementValue2 = document.getElementById('loan-details-loan-amount-value');
    loanAmountSlider.noUiSlider.on('update', function (values, handle) {
        stepSliderValueElementValue.innerHTML = renderValuesHelper.renderAmount(values[handle]);
        stepSliderValueElementValue2.value = renderValuesHelper.renderAmount(values[handle]);
    });
        
        
        
        
    function manualStep (direction)
    {
        var currentPosition = parseInt(loanAmountSlider.noUiSlider.get());
        var stepSize = 10000;
        
        if(direction == 'f'){
            currentPosition += stepSize;
        }
        if(direction == 'b'){
            currentPosition -= stepSize;
        }
        
        currentPosition = (Math.round(currentPosition / stepSize) * stepSize);
    // alert('pushas'+currentPosition);
        loanAmountSlider.noUiSlider.set(currentPosition);
        }
        document.getElementById('stepForwardAmount').onclick = function() {manualStep("f")};
        document.getElementById('stepBackwardAmount').onclick = function() {manualStep("b")};
        
        

        
        var loanPeriodSlider = document.getElementById('termSlider');
        noUiSlider.create(loanPeriodSlider, {
            start: [termStepsHelper.default_term],
            snap: true,
            connect: 'lower',
            range: termStepsHelper.terms_obj
        });
        
        loanAmountSlider.noUiSlider.on('update', function (values, handle) {
        //console.log('values[hangle]'+values[handle]);
        if(values[handle] >= 50000 ) {
            //&& termStepsHelper.terms_array.length > 2
            termStepsHelper.dec_terms();
            loanPeriodSlider.noUiSlider.set(termStepsHelper.default_term);
            loanPeriodSlider.noUiSlider.updateOptions({ range: termStepsHelper.terms_obj });
            document.getElementById('termSlider-value').innerHTML = renderValuesHelper.renderTerm(loanPeriodSlider.noUiSlider.get());
        } else {
            // if(termStepsHelper.terms_array.length < 4) {
            termStepsHelper.restore_terms();
            loanPeriodSlider.noUiSlider.set(termStepsHelper.default_term);
            loanPeriodSlider.noUiSlider.updateOptions({range: termStepsHelper.terms_obj });
            document.getElementById('termSlider-value').innerHTML = renderValuesHelper.renderTerm(loanPeriodSlider.noUiSlider.get());
            // }
        }
        });

        var stepSliderValueElementPeriod = document.getElementById('termSlider-value');
        var stepSliderValueElementPeriod2 = document.getElementById('loan-details-loan-term-value');
        loanPeriodSlider.noUiSlider.on('update', function (values, handle) {
            stepSliderValueElementPeriod.innerHTML = renderValuesHelper.renderTerm(values[handle]);
            stepSliderValueElementPeriod2.value = renderValuesHelper.renderTerm(values[handle]);
        });
    

    function incRateSlider(e){
        if(e){ e.preventDefault(); }
        var id = $(e.target).attr("id");
        var dir = 1;
        if(id == "stepBackwardTerm"){ dir = -1; }
        // console.log('id:' + id);
        // console.log('before value'+termStepsHelper.value());

        if(dir > 0) {
            termStepsHelper.inc();
        } else if(dir < 0) {
            termStepsHelper.dec();
        }
        // console.log('new value'+termStepsHelper.value());    
        var newval = termStepsHelper.value();// add or subtract values
        
        var slider = document.getElementById('termSlider');
        slider.noUiSlider.set(newval); //this sets the value for the slider "super necessary"
        //setInterestSliderDisplay(newval);  
    }
    document.getElementById('stepForwardTerm').onclick = function(e) {incRateSlider(e)};
    document.getElementById('stepBackwardTerm').onclick = function(e) {incRateSlider(e)};      
    
    
    
    
    /**
     * 
     * start form details validation
     * 
     */
    var ele = document.querySelector("#yourDetailsForm");
    if(ele.addEventListener){
        ele.addEventListener("submit", runValidationOnAllFields, false);  //Modern browsers
    }else if(ele.attachEvent){
        ele.attachEvent('onsubmit', runValidationOnAllFields);            //Old IE
    }

    function runValidationOnAllFields(e) {
        var errors = [];
        if(!isFullnameValid()){
            e.preventDefault();    //stop form from submitting
            errors.push({
                input_id:"#your_details_full_name",
                error_id:"#error_your_details_full_name", 
                message: "Please check your full name!"
            });
        }
        if(!isMobilePhoneValid()){
            e.preventDefault();    //stop form from submitting
            //errors.push("Phone is Not valid!");
            errors.push({
                input_id:"#your_details_mobile_number",
                error_id:"#error_your_details_mobile_number", 
                message: "Please check your phone number!"
            });
        }
        if(!isEmailValid()){
            e.preventDefault();    //stop form from submitting
            errors.push({
                input_id:"#your_details_email",
                error_id:"#error_your_details_email", 
                message: "Please check your email!"
            });
            // errors.push("Email is Not valid!");
        }
        if(!isAgreeValid()){
            e.preventDefault();    //stop form from submitting
            //errors.push("You must check agree to proceed!");
            errors.push({
                input_id:"#your_details_checkbox",
                error_id:"#error_your_details_checkbox", 
                message: "You must check agree to proceed!"
            });
        }

        // clear old errors and classes
        var allMessages = document.querySelectorAll('form .input_error_message');
        allMessages.forEach(function(message) {
            message.innerHTML = '';
            // message.classList.remove("input_error");
        });
        // remove from inputs error class
        var allInputs = document.querySelectorAll('form .form-control');
        allInputs.forEach(function(input) {
            input.classList.remove("input_error");
        });
        
        if(errors.length) {
            // output errors here
            for(const error of errors) {
                document.querySelector(error.error_id).innerHTML = error.message;
                // document.querySelector(error.input_id);
                var input = document.querySelector(error.input_id);
                input.classList.add("input_error");
            }
        } else {
            e.preventDefault();
            alert('Congrats form is valid');
        }
    }
    
    function isFullnameValid() {
        var isValid = false;
        //do your validation
        var fullName = document.querySelector("#your_details_full_name").value
        var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
        isValid = regName.test(fullName);
        
        var nameArr = fullName.split(' ');
        if(nameArr[0] == nameArr[1]) {
            isValid = false;
        }
        return isValid;
    }
    
    function isEmailValid() {
        var isValid = false;
        //do your validation
        var email = document.querySelector("#your_details_email").value
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        isValid = re.test(String(email).toLowerCase());
        return isValid;
    }
    
    function isMobilePhoneValid() {
        var isValid = false;
        //do your validation
        //+37012345
        var re = /^[\+][0-9]{11}$/im;
        var phone = document.querySelector("#your_details_mobile_number").value;
        isValid = re.test(phone);
        
        return isValid;
    }
    
    function isAgreeValid() {
        var isValid = false;
        //do your validation
        isValid = document.querySelector("#your_details_checkbox").checked;
        
        return isValid;
    }
    
    
    /**
     * 
     * 
     * clouds animation
     * 
     * 
     */
    var cloud1 = document.querySelector(".header_imageCloud1");
    var cloud2 = document.querySelector(".header_imageCloud2");
    var currPosition1 = parseInt(cloud1.offsetLeft, 10);
    var currPosition2 = parseInt(cloud2.offsetLeft, 10);
    // console.log('currPosition1 :' + cloud1.offsetLeft);
    // console.log('currPosition2 :' + cloud2.offsetLeft);
    let start = Date.now(); // remember start time

    let timer = setInterval(function() {
        // how much time passed from the start?
        let timePassed = Date.now() - start;

        if((currPosition1 + timePassed / 10) > (1920 + 110)) {
            currPosition1 = -200;
            currPosition2 = -100;
            start = Date.now(); // remember start time
        }
        // draw the animation at the moment timePassed
        draw(timePassed);
    }, 20);

    function draw(timePassed) {
        cloud1.style.left = currPosition1 + timePassed / 10 + 'px';
        cloud2.style.left = currPosition2 + timePassed / 10 + 'px';
    }
    
})(); // this invokes the functions
    