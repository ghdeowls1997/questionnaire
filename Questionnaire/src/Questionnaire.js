import React from "react";
import Element from "react-scroll/modules/components/Element";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import {RadioGroup} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import "./images/matthew-bennett-78hTqvjYMS4-unsplash.jpg"
import "./App.css";


const option = (no, type) => ({
    no : no,
    content : '',
    deleted : false,
    chosen: false,
    type: type
});

const question = (id) => ({
    id: id,
    deleted: false,
    content: '',
    options: []
});


class Questionnaire extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            form: false,
            questions: [],
            view: false,
        }
    }

    componentDidUpdate = () => {
        /** store then individually in case you want to have different states of each component */
        sessionStorage.setItem("questions", JSON.stringify(this.state.questions))
        sessionStorage.setItem("view", JSON.stringify(this.state.view))
        sessionStorage.setItem("form", JSON.stringify(this.state.form))
    };

    componentDidMount = () => {
        /** we don't have Backend :( Use sessionStorage instead of Ajax call
         * localStorage -> SessionStorage
         * prevents losing data after refresh (browser reload)
         * */
        const questions = JSON.parse(sessionStorage.getItem("questions"));
        const form = JSON.parse(sessionStorage.getItem("form"));
        const view = JSON.parse(sessionStorage.getItem("view"));
        if (questions && questions !== []) {
            this.setState({
                questions: questions,
                form: form,
                view: view
            })
        } else {
            /** add sentinel object in front to retrieve question from the array easier
             *  part of caching to retrieve question / option in O(1) time.
             *
             * Do the same (sentinel pushing) for options array for same purpose
             * add 'Other' option upfront***/

            // generate a sample first question to be displayed at the very beginning
            let data = [];
            // generate a sentinel question
            let sentinelQuestion = question(null);
            sentinelQuestion.deleted = true;
            //generate a sentinel option inside sentinel question
            let sentinelOption = option(null);
            sentinelOption.deleted = true;
            sentinelQuestion.options.push(sentinelOption);
            data.push(sentinelQuestion);
            // controls the amount of initial questions to be displayed
            const numQuestionsToBeInitialized = 1;
            for (let i = 1; i <= numQuestionsToBeInitialized; i++) {
                let q = question(i);
                let sentOp = option(null);
                sentOp.deleted = true;
                q.options.push(sentOp);
                q.options.push(option(i));
                q.options.push(option(i + 1, 'Other'));
                data.push(q);
            }
            this.setState({questions: data})
        }
    };

    handleAddOption = (e, questionId) => {
        /** swap occurs between 'Other' and the new option
         * 1) put Other at the very bottom for better view
         * 2) allow user to retrieve 'Other' option easily whenever he accidentally deletes it
         * **/
        const {questions} = this.state;
        const target = questions[questionId];
        const lastOption = target.options[target.options.length - 1];
        const newOption = option(target.options.length);
        if (lastOption.type === 'Other') {
            target.options[target.options.length - 1].content = '';
            target.options[target.options.length - 1].type = '';
            newOption.content = '';
            newOption.type = 'Other';
            questions[questionId].options.push(newOption);
            this.setState({questions: questions})
        } else {
            questions[questionId].options.push(newOption);
            this.setState({questions: questions})
        };
    };

    handleAddQuestion = () => {
        /*** rather than doing "nested-setState", this looks and feels better
         * 1) adds new question with sentinel option and 'Other' option
         * */
        const {questions} = this.state;
        const newQ = question(questions.length);
        const sentinelOption = option(null);
        sentinelOption.deleted = true;
        newQ.options.push(sentinelOption);
        newQ.options.push(option(1));
        newQ.options.push(option(newQ.options.length, 'Other'));
        newQ.options[newQ.options.length - 1].content = '';
        questions.push(newQ);
        this.setState({questions: questions});
    };



    handleQuestionChange = (e) => {
        const {questions} = this.state;
        const target = questions[e.target.id];
        target.content = e.target.value;
        this.setState({
            questions: questions
        });
    };

    handleOptionChange = (e, optionNo) => {
        const {questions} = this.state;
        const target = questions[e.target.id];
        target.options[optionNo].content = e.target.value;
        this.setState({
            questions: questions
        });
    };

    handleDeleteQuestion = (e, questionId) => {
        const {questions} = this.state;
        const target = questions[questionId];
        target.deleted = true;
        this.setState({questions: questions})
    };

    handleDeleteOption = (e, questionId, optionId) => {
        const {questions} = this.state;
        const target = questions[questionId];
        target.options[optionId].deleted = true;
        this.setState({questions: questions})
    };

    handleCreate = () => {
        /** alerts users when
         * 1) NoArgsException: There is no question nor options
         * 2) NoOptionArgsException: Some options are left blank
         * 3) NoQuestionArgsException: Some questions are left blank
         * 4) NoOptionAddedArgsException: there is no option for some questions
         * **/
        const NoArgsException = {};
        const NoOptionArgsException = {};
        const NoQuestionArgsException = {};
        const NoOptionAddedArgsException = {};
        const {questions} = this.state;
        try {
            let countQuestions = 0;
            questions.filter(q => !q.deleted).forEach((q, index) => {
                    if (q.content === '') {
                        throw NoQuestionArgsException
                    }
                    let countOptions = 0;
                    q.options.filter(option => !option.deleted).forEach(option => {
                        if (option.deleted || option.no === null) {
                            return ;
                        }
                        if (option.content === '' && option.type !== 'Other') {
                            throw NoOptionArgsException;
                        }
                        countOptions += 1;
                    });
                    if (countOptions < 1) {
                        throw NoOptionAddedArgsException;
                    }
                    countQuestions += 1;
                }
            );
            if (countQuestions < 1) {
                throw NoArgsException;
            }
        }
        catch (e) {
            if (e === NoQuestionArgsException) {
                alert("Please fill out question(s)");
                return ;
            } else if (e === NoOptionArgsException) {
                alert("Please fill out option(s)");
                return;
            } else if (e === NoOptionAddedArgsException) {
                alert("Please add option(s)");
                return ;
            } else if (e === NoArgsException) {
                alert("Please add question(s)");
                return ;
            }
        }
        alert("successfully created form");
        this.setState({form: true})
    };

    handleSubmit = () => {
        /** alerts users when
         * 1) UnClickedButtonException: there are some buttons left unclicked
         * 2) A user chose 'Other' as an option for some question, but has not specified (typed text)
         *
         * If there were to be a backend server, I would make ajax (post) call here to send data
         * */
        const UnClickedButtonException = {};
        const OtherNotSpecifiedException = {};
        const {questions} = this.state;
        try {
            questions.filter(question => !question.deleted).forEach(question => {
                let counter = 0;
                question.options.filter(option => !option.deleted).forEach(option => {
                    /*counting whether there are any doubly chosen item*/
                    if (option.no !== null && option.chosen) {
                        counter += 1;
                    } if (option.chosen && option.type === 'Other' && option.content === '') {
                        throw OtherNotSpecifiedException;
                    }
                });
                if (counter === 0) {
                    throw UnClickedButtonException;
                }
            });
            this.setState({view: true})
        } catch(e) {
            if (e === UnClickedButtonException) {
                alert("Please choose an option for every question.")
                return ;
            } else if (e === OtherNotSpecifiedException) {
                alert("If you have chosen 'Other' as an option, please specify.")
                return ;
            }
        }
    };

    handleGoBack = () => {
        this.setState({form: false})
    };

    handleChosen = (e, checked, questionId, optionNo) => {
        const {questions} = this.state;
        const target = questions[questionId];
        // If an option is chosen, then set every else to false, so that it is multi-choiceable, not "multi-selectable" //
        target.options.forEach(option => {
            option.chosen = false
        });
        target.options[optionNo].chosen = true;
        this.setState({questions: questions})
    };

    handleReset = () => {
        /** either this or closing the browser (tab) will clear the whole storage (i.e. reset) **/
        sessionStorage.clear();
        this.setState({
            questions: [],
            view: false,
            form: false,
        });
        this.componentDidMount();
    };

    render() {
        const line = (width, height) => ({
                color: 'gainsboro',
                backgroundColor: 'gainsboro',
                width: width,
                height: height,
                borderWidth: height
            }
        )
        return (
            <div>
                <div className={"App"}>
                    <Element className="element" id="scroll-container" style={{
                        border: 'solid gainsboro',
                        backgroundColor: 'white',
                        marginTop: '50px',
                        position: 'fixed',
                        overflow: 'scroll',
                        height: '500px',
                        marginLeft: '250px',
                        width: '800px',
                        borderRadius: '20px',
                    }}>
                        <div>
                            <h1 className={"header"}> Google Form </h1><p style = {{fontFamily: 'Cambria', fontSize: '15px'}}> {"by _  " + "Daejin Hong"} </p>
                            <hr style = {line("80%", "1")}></hr>
                            {this.state && this.state.questions && this.state.questions.filter(q => !q.deleted).map((q, index) => (
                                    <div>
                                        <div id={q.id}>
                                            <div style = {{marginBottom: '5px', fontSize: '20px'}}>
                                                {this.state.form ?
                                                    <div className = {"required-field"} style={{fontSize: '17px', marginRight: "240px", marginBottom: '10px'}}>{'Question # ' + (index + 1)}
                                                        <div style={{marginLeft: '220px', marginTop: '20px', marginBottom: '20px', textAlign: 'center', width: '360px'}}>
                                                            <FormControl component="fieldset">
                                                                <FormLabel asterisk component="legend">{q.content}</FormLabel>
                                                                <RadioGroup defaultValue={q.content}
                                                                            name="customized-radios">
                                                                    {q.options && q.options.filter(option => !option.deleted).map(option => (
                                                                            option !== null && option.deleted === false &&
                                                                            <FormControlLabel
                                                                                disabled = {this.state.view}
                                                                                onChange = {(e, checked) => this.handleChosen(e, checked, q.id, option.no)}
                                                                                labelPlacement = {'end'}
                                                                                checked = {option.chosen}
                                                                                value= {q.id.toString() + option.no.toString()} control={<Radio/>}
                                                                                label={option.type === 'Other' ?
                                                                                    <Input
                                                                                        value = {option.content}
                                                                                        id={q.id}
                                                                                        readOnly = {!option.chosen}
                                                                                        placeholder={"Other"}
                                                                                        onChange = {(e) => this.handleOptionChange(e, option.no)}/>
                                                                                    : option.content
                                                                                }
                                                                            />
                                                                        )
                                                                    )
                                                                    }
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </div>
                                                    </div>

                                                    :
                                                    <div className = {"required-field"} style={{fontSize: '17px', marginRight: "200px", marginBottom: '10px'}}>{'Question # ' + (index + 1)}
                                                        <div style={{marginLeft: '240px', marginBottom: '10px', marginTop: '10px', textAlign: 'center', width: '300px'}}>
                                                            <Input required={true}
                                                                   fullWidth={true}
                                                                   multiline={true}
                                                                   value={q.content} id={q.id}
                                                                   placeholder={"Please type Question # " + (index + 1)}
                                                                   onChange={this.handleQuestionChange}/>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            {/*//OPTIONS*/}
                                            <div>
                                                {!this.state.form && q.options &&
                                                q.options.filter(option => !option.deleted).map((option, index) => (
                                                        option !== null &&
                                                        <div style = {{marginTop: '5px'}}>
                                                            <div class="round"
                                                                 style={{display: "inline-block", marginRight: '15px'}}>
                                                                <input type={"checkbox"}/>
                                                                <label></label>
                                                                <Input value={option.type === 'Other' ? option.type : option.content} id={q.id}
                                                                       style={{marginLeft: '5px', textAlign: 'center'}}
                                                                       type="text"
                                                                       multiline={true}
                                                                       readOnly = {option.type === 'Other'}
                                                                       placeholder={"Please type Option " + (index + 1)}
                                                                       onChange={(e) => this.handleOptionChange(e, option.no)}/>
                                                                <Button style={{marginLeft: '10px'}}
                                                                        variant={"outlined"}
                                                                        color={"secondary"} size={"small"} value={q.id}
                                                                        id={option.no} onClick={(e) => {
                                                                    this.handleDeleteOption(e, q.id, option.no)
                                                                }}>X</Button>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            {this.state.form ? <div id={q.id} style={{marginTop: '20px'}}>
                                                </div> :
                                                <div id={q.id} style={{marginTop: '30px', marginBottom: '20px', display: 'inline-block'}}>
                                                    <Button size={"small"} variant="outlined" id={q.id} color={"secondary"}
                                                            onClick={(e) => {
                                                                this.handleDeleteQuestion(e, q.id)
                                                            }}>{"Delete Question # " + (index + 1)}</Button> {'          '}
                                                    <Button size={"small"} variant="outlined" id={q.id} color={"primary"}
                                                            onClick={(e) => {
                                                                this.handleAddOption(e, q.id)
                                                            }}>ADD OPTION</Button>
                                                </div>
                                            }
                                        </div>
                                        <hr style = {line("50%", "0.5")}></hr>
                                    </div>
                                )
                            )}

                            {this.state.form && this.state.view &&
                            <div style={{textAlign: 'center', marginLeft: '20px', marginTop: '20px'}}>
                                <Button variant="outlined" size={"large"} color={"primary"}
                                        onClick={this.handleReset}>
                                    Create Another Form
                                </Button>
                            </div>
                            }

                            {this.state.form && !this.state.view &&
                            <div style={{textAlign: 'center', marginLeft: '20px', marginTop: '20px'}}>
                                <Button variant="contained" size={"large"} color={"primary"}
                                        onClick={this.handleGoBack}>
                                    Go back to Editing
                                </Button> {'     '}
                                <Button variant="contained" size={"large"} color={"secondary"}
                                        onClick={this.handleSubmit}>
                                    Submit Form
                                </Button>
                            </div>
                            }

                            {!this.state.form && !this.state.view && <div style={{textAlign: 'center', marginLeft: '20px', marginTop: '20px'}}>
                                <Button variant="contained" size={"large"} color={"primary"}
                                        onClick={this.handleAddQuestion}>add Question</Button> {'     '}
                                <Button variant = "contained" size ={"large"} color={"secondary"}
                                        onClick={this.handleCreate}>Create Form</Button>
                            </div>
                            }
                        </div>
                        <div style = {{marginTop: '100px'}}>
                        </div>
                    </Element>
                </div>
            </div>
        )
    }
}

export default Questionnaire













// {/*//OPTIONS*/ My own hard-coding for the check button}
// <div>
//     {q.options && q.options.map(option => (
//             option !== null && option.deleted === false &&
//             <div>
//                 {this.state.form ? <div className="round"
//                                         style={{
//                                             display: "inline-block",
//                                             textAlign: 'center'
//                                         }}>
//                         <input type={"checkbox"} id={option.no}
//                                onChange={this.handleOptionSelect}/>
//                         <label htmlFor={option.no}></label>
//                         <Input value={option.content} id={q.id}
//                                style={{marginLeft: '45px', textAlign: 'center'}}
//                                type="text"
//                                readOnly={true}
//                                disableUnderline={true}
//                                placeholder={"please type option"}/>
//                     </div> :
//                     <div class="round"
//                          style={{display: "inline-block", textAlign: 'center'}}>
//                         <input type={"checkbox"} id={option.no}/>
//                         <label for={option.no}></label>
//                         <Input value={option.content} id={q.id}
//                                style={{marginLeft: '45px', textAlign: 'center'}}
//                                type="text"
//                                placeholder={"please type option"}
//                                onChange={(e) => this.handleOptionChange(e, option.no)}/>
//                         <Button style={{marginLeft: '10px'}}
//                                 variant={"outlined"}
//                                 color={"secondary"} size={"small"} value={q.id}
//                                 id={option.no} onClick={(e) => {
//                             this.handleDeleteOption(e, q.id, option.no)
//                         }}>X</Button>
//                     </div>
//                 }
//             </div>
//         )
//     )}
// </div>