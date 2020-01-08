## questionnaire
Creating Google form

# Basic Component Flow:
 1. Form Creating (For creator of the form)
 2. Filling out the Form (For user answering the form)
 3. View the submitted form (For both)   
   For two types of users:
     1. Form-creators: create forms that their clients (users) will be filling out
     2. Form-writers: will be filling out the form created by the creators with clickable buttons
     
# Tech-Specification:
       1) No backend server/framework created/used, but solely Frontend.
       
       2) Used React.js as a frontend library (Framework). 
       
       3)* Build an array of questions as well as options and set the index as their primary key (to implement db and java feature on
       the frontend framework). Also, deleting either the options or questions will never erase them from the array, but hide them from 
       showing. This was intentional, as frontend should take a role of Database, where all the yields and results of user involvement 
       and interaction are highly recommended to be stored on the server side for a better service. Lookup time for each question or
       option is accomplished in O(1) time through caching and setting indices as primary keys.
      
       4) Since there exists no backend (database) server to retrieve the data from, inserted a single question as a sample in the very 
       beginning inside the ComponentDidMount method, where we typically call the backend server to attain necessary data to be 
       rendered
       
       5) Used SessionStorage to saves all the user's inputs. Thus, user doesn't lost data upon reload or any other intervention 
       besides shutting down the browser. It empties if and only if the browser or browser tab are closed or 
       'CREATE ANOTHER FORM' button is clicked. 
       
       6) All the exceptions are handled when the required fields are left unchecked or if there exists no question to be submitted.
     
## Features:
 #Creation Stage
     Questions:
       1) Can add as many questions as you can by clicking the button "ADD QUESTION"
              
       2) Required. Cannot be left blank => else {alert()}
       
       3) Can be deleted with a button "DELETE QUESTION # ?" right next to "ADD OPTION"
       
       4) The Question can be as long as the user wishes it to be. Once the text length hits the max-width that each lines can afford,
       it will automatically generate a new line for the user (multi-line feature)
       
       5) A new question always comes with default 'Other' option, which the user can freely delete, if not needed. Once deleted, it is
       reproduced on the next "Add Option" once. So although it is recommended to have 'Other' as an option to greet the user with a 
       more freedom of choice, if you really want to eliminate it, then you can first add and fill out all the options you wish to add,
       and then, delete 'Other', once you are done.
       
     Options:
       1) Can add as many options per question as you can by clicking "ADD OPTION"
       
       2) Required. Cannot be left blank => else {alert()}
       
       3) Can be deleted with a button "X" right next to each corresponding options
       
       4) The Option can be as long as the user wishes it to be. Once the text length hits the max-width that each lines can afford,
       it will automatically generate a new line for the user (multi-line feature)
       
       
 #Filling Stage:
    RadioButton:
       1) Choose one button per each question.
       
       2) If the user wants to write a choice of his or her own, then she should select 'Other' option and type her manual option.
       
       3) A button should be selected for each question => else {alert()}
       
       4) If 'Other' is selected and nothing is typed by the user, then => alert()
       
     Options:
       1) All, but 'Other' is edittable.
       
     Questions:
       1) All questiosn are not edittable.
       
     You can always go back to editting page by clicking on "GO BACK TO EDITING" or submit the form by clicking "SUBMIT FORM"
 
  #Viewing Stage:
       1) Radio button is non-selectable
       
       2) Options are not edittable
       
       3) It is just view-only form for the ones who just submitted their form
       
       4) The User can go back and create a new form by clicking "CREATE ANOTHER FORM"

