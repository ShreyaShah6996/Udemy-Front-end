import React, { Component } from "react";
import { Card, Row, Col, CardBody, CardTitle, Button, Container } from 'reactstrap';
import { connect } from 'react-redux';
import { Rate, Icon } from 'antd';
import 'antd/dist/antd.css';

import path from '../../path';
import '../../styling.css'

class SearchDisplay extends Component {

    btnBack(e) {
        e.preventDefault();
        this.props.history.push('/courseList');
    }

    btnExplore(courseId, e) {
        e.preventDefault();
        this.props.history.push({
            pathname: '/exploreCourse/' + courseId
        })
    }

    renderCard = (course) => {
        return (
            <Col md="3" key={course.id} className="column">
                <Card className="card" style={{ marginTop: "7px" }}>
                    <CardBody style={{ padding: "0px" }}>
                        <img className="imgCard" src={path + "courseImage/" + course.courseImage} alt="Card cap" />
                        <div style={{ height: "100px" }}>
                            <CardTitle style={{ height: "40px" }}><b> {course.coursename}</b> </CardTitle>
                            <Rate allowHalf defaultValue={course.ratings} disabled />
                            <p><b>₹ {course.price}</b></p>
                        </div>
                    </CardBody>
                    <CardBody>
                        <Button color="danger" style={{ marginBottom: "5px" }} onClick={this.btnExplore.bind(this, course.id)} >Explore Course</Button>
                    </CardBody>
                </Card>
            </Col >
        );
    };
    render() {
        let courseList = [];
        let category = "";
        if (this.props.courses) {
            this.props.courses.map(courses => {
                category = courses.category;
                return courseList.push(this.renderCard(courses))
            })
        }
        return (
            <div>
                <Row>
                    <Button className="btnBack" onClick={this.btnBack.bind(this)}>
                        <Icon type="arrow-left" style={{ fontSize: "30px" }} />
                    </Button>
                </Row>
                <Row>
                    <h3 className="Btnstyle">{category}</h3>
                </Row>
                {this.props.error_msg ?
                    <h3>Not yet added</h3> :
                    <Container>
                        <Row>
                            {courseList}
                        </Row>
                    </Container>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        error_msg: state.category.error_msg,
        courses: state.course.getCourseByCid,
    }
}

export default connect(mapStateToProps, null)(SearchDisplay);