import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

import * as courseAction from "../../action/CourseAction";

class SearchData extends Component {
    state = {
        query: '',
        result: []
    }
    componentDidMount() {
        this.props.action.course.getCourse();
    }


    handleInputChange = (e) => {        
        this.setState({
            query: e.target.value
        });

        this.getInfo();
    }

    getInfo() {
        let FilteredCourse = this.props.course.filter(course => {
            return course.coursename.toLowerCase().indexOf(this.state.query.toLowerCase()) !== -1;
        });

        let a = [];

        if (FilteredCourse) {
            FilteredCourse.map(course => {
                return a.push(course.coursename)
            })
        }
        this.setState({ result: a });
    }

    render() {
        return (
            <div>
                <form>
                    <input
                        placeholder="Search for..."
                        onChange={this.handleInputChange}
                    />
                    <ul>{this.state.result}</ul>
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        error_msg: state.course.error_msg,
        course: state.course.course,
    }
}

const mapDispatchToProps = (dispatch) => ({
    action: {
        course: bindActionCreators(courseAction, dispatch)
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchData);