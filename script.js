//[STEP 0]: Make sure our document is A-OK
$(document).ready(function () {
  //what kind of interface we want at the start 
  const APIKEY = "5ffd42c11346a1524ff1284c";
  getContacts();
  $("#update-contact-container").hide();
  $("#add-update-msg").hide();

  //[STEP 1]: Create our submit form listener
  $("#contact-submit").on("click", function (e) {
    //prevent default action of the button 
    e.preventDefault();

    //[STEP 2]: let's retrieve form data
    //for now we assume all information is valid
    //you are to do your own data validation
    let contactName = $("#contact-name").val();
    let contactStudentId = $("#contact-studentid").val();
    let contactClass = $("#contact-class").val();
    let contactMentor = $("#contact-mentor").val();
    let contactMark = $("#contact-mark").val();

    //[STEP 3]: get form values when user clicks on send
    //Adapted from restdb api
    let jsondata = {
      "studentid": contactStudentId,
      "studentmentor": contactMentor,
      "studentclass": contactClass,
      "studentname": contactName,
      "studentmark": contactMark
    };

    //[STEP 4]: Create our AJAX settings. Take note of API key
    let settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://student-d6da.restdb.io/rest/contact",
      "method": "POST", //[cher] we will use post to send info
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": JSON.stringify(jsondata),
      "beforeSend": function(){
        //@TODO use loading bar instead
        //disable our button or show loading bar
        $("#contact-submit").prop( "disabled", true);
        //clear our form using the form id and triggering it's reset feature
        $("#add-contact-form").trigger("reset");
      }
    }

    //[STEP 5]: Send our ajax request over to the DB and print response of the RESTDB storage to console.
    $.ajax(settings).done(function (response) {
      
      $("#contact-submit").prop( "disabled", false);
      
      //@TODO update frontend UI 
      $("#add-update-msg").show().fadeOut(3000);

      //update our table 
      getContacts();
    });
  });//end click 


  //[STEP] 6
  //let's create a function to allow you to retrieve all the information in your contacts
  //by default we only retrieve 10 results
  function getContacts(limit = 10, all = true) {

    //[STEP 7]: Create our AJAX settings
    let settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://student-d6da.restdb.io/rest/contact",
      "method": "GET", //[cher] we will use GET to retrieve info
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
    }

    //[STEP 8]: Make our AJAX calls
    //Once we get the response, we modify our table content by creating the content internally. We run a loop to continously add on data
    //RESTDb/NoSql always adds in a unique id for each data, we tap on it to have our data and place it into our links 
    $.ajax(settings).done(function (response) {
      
      let content = "";
      let markList = [];
      let nameList = [];


      for (var i = 0; i < response.length && i < limit; i++) {
        markList.push(response[i].studentmark);
        nameList.push(response[i].studentname);

        //[METHOD 1]
        //let's run our loop and slowly append content
        //we can use the normal string append += method
        /*
        content += "<tr><td>" + response[i].name + "</td>" +
          "<td>" + response[i].email + "</td>" +
          "<td>" + response[i].message + "</td>
          "<td>Del</td><td>Update</td</tr>";
        */

        //[METHOD 2]
        //using our template literal method using backticks
        //take note that we can't use += for template literal strings
        //we use ${content} because -> content += content 
        //we want to add on previous content at the same time
        content = `${content}<tr id='${response[i]._id}'><td>${response[i].studentid}</td>
        <td>${response[i].studentmentor}</td>
        <td>${response[i].studentclass}</td>
        <td>${response[i].studentname}</td>
        <td>${response[i].studentmark}</td>
        <td><a href='#delete-contact-container' class='delete' data-id='${response[i]._id}'>Del</a></td><td><a href='#update-contact-container' class='update' data-id='${response[i]._id}' data-studentid='${response[i].studentid}' data-studentmentor='${response[i].studentmentor}' data-studentclass='${response[i].studentclass}' data-studentname='${response[i].studentname}' data-studentmark='${response[i].studentmark}'>Update</a></td></tr>`;

      }

      //[STEP 9]: Update our HTML content
      //let's dump the content into our table body
      $("#contact-list tbody").html(content);

      $("#total-contacts").html(response.length);
      var densityCanvas = document.getElementById("densityChart");

      Chart.defaults.global.defaultFontFamily = "Lato";
      Chart.defaults.global.defaultFontSize = 18;

      var densityData = {
        label: 'Student Mark (%)',
        data: markList,
        backgroundColor: 'rgba(0, 99, 132, 0.6)',
        borderWidth: 0,
      };

      var planetData = {
        labels: nameList,
        datasets: [densityData]
      };

      var chartOptions = {
        scales: {
          xAxes: [{
            barPercentage: 1,
            categoryPercentage: 0.6
          }],
          yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]
        }
      };

      var barChart = new Chart(densityCanvas, {
        type: 'bar',
        data: planetData,
        options: chartOptions
      });
    });


  }

  //[STEP 10]: Create our update listener
  //here we tap onto our previous table when we click on update
  //this is a delegation feature of jquery
  //because our content is dynamic in nature, we listen in on the main container which is "#contact-list". For each row we have a class .update to help us
  $("#contact-list").on("click", ".update", function (e) {
    e.preventDefault();
    //update our update form values
    let contactStudentId = $(this).data("studentid");
    let contactStudentMentor = $(this).data("studentmentor");
    let contactStudentClass = $(this).data("studentclass");
    let contactStudentName = $(this).data("studentname");
    let contactStudentMark = $(this).data("studentmark");
    let contactId = $(this).data("id");
    //console.log($(this).data("msg"));

    //[STEP 11]: Load in our data from the selected row and add it to our update contact form 
    $("#update-contact-studentid").val(contactStudentId);
    $("#update-contact-studentmentor").val(contactStudentMentor);
    $("#update-contact-studentclass").val(contactStudentClass);
    $("#update-contact-studentname").val(contactStudentName);
    $("#update-contact-studentmark").val(contactStudentMark);
    $("#update-contact-id").val(contactId);
    $("#update-contact-container").show();

  });//end contact-list listener for update function

  $("#contact-list").on("click", ".delete", function (e) {
    e.preventDefault();
    //update our update form values
    let contactId = $(this).data("id");

    deleteForm(contactId);
  });


  //[STEP 12]: Here we load in our contact form data
  //Update form listener
  $("#update-contact-submit").on("click", function (e) {
    e.preventDefault();
    //retrieve all my update form values
    let contactStudentId = $("#update-contact-studentid").val();
    let contactStudentMentor = $("#update-contact-studentmentor").val();
    let contactStudentClass = $("#update-contact-studentclass").val();
    let contactStudentName = $("#update-contact-studentname").val();
    let contactStudentMark = $("#update-contact-studentmark").val();
    let contactId = $("#update-contact-id").val();

    //console.log($("#update-contact-msg").val());
    //console.log(contactMsg);

    //[STEP 12a]: We call our update form function which makes an AJAX call to our RESTDB to update the selected information
    updateForm(contactId, contactStudentId, contactStudentMentor, contactStudentClass, contactStudentName, contactStudentMark);
  });//end updatecontactform listener

  //[STEP 13]: function that makes an AJAX call and process it 
  //UPDATE Based on the ID chosen
  function updateForm(contactId,contactStudentId, contactStudentMentor, contactStudentClass, contactStudentName, contactStudentMark) {
    //@TODO create validation methods for id etc. 

    var jsondata = { "studentid": contactStudentId, "studentmentor": contactStudentMentor, "studentclass": contactStudentClass, "studentname": contactStudentName, "studentmark": contactStudentMark};
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": `https://student-d6da.restdb.io/rest/contact/${contactId}`,//update based on the ID
      "method": "PUT",
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": JSON.stringify(jsondata)
    }

    //[STEP 13a]: send our AJAX request and hide the update contact form
    $.ajax(settings).done(function (response) {
      
      $("#update-contact-container").fadeOut(5000);
      //update our contacts table
      getContacts();
    });
  }//end updateform function

  function deleteForm(contactId) {
    //@TODO create validation methods for id etc. 

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": `https://student-d6da.restdb.io/rest/contact/${contactId}`,//update based on the ID
      "method": "DELETE",
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
      "processData": false,
    }

    //[STEP 13a]: send our AJAX request and hide the update contact form
    $.ajax(settings).done(function (response) {
      
      //update our contacts table
      getContacts();
    });
  }//end updateform function

})
