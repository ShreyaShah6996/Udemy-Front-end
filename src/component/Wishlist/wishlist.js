import React, { Component } from "react";
import { Card, Row, Col, CardBody, CardTitle, Button, Container } from 'reactstrap';
import { connect } from 'react-redux';
import { Rate, Icon } from 'antd';
import { bindActionCreators } from "redux";
import 'antd/dist/antd.css';

import * as wishlistAction from '../../action/wishlistAction';
import path from '../../path';
import '../../styling.css'

class Wishlist extends Component {

    componentDidMount() {
        this.props.action.wishlist.getWishlistByUser(this.props.userId);
    }
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
                <Card className="card" style={{ marginTop: "7px", height: "115%", width: "100%", cursor: "pointer" }} onClick={this.btnExplore.bind(this, course.courseId)}>
                    <CardBody style={{ padding: "0px" }}>
                        <img style={{
                            width: "100%",
                            height: "auto",
                            position: "relative",

                            zIndex: "1"
                        }} src={path + "courseImage/" + course.courseImage} alt="Card cap" />
                        <Icon style={{
                            color: "red",
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            zIndex: "2"
                        }} type="heart" theme="filled" />
                        <div style={{ height: "100px" }}>
                            <CardTitle style={{ height: "40px" }}><b> {course.coursename}</b> </CardTitle>
                            <Rate allowHalf defaultValue={course.ratings} disabled />
                            <p><b>₹ {course.price}</b></p>
                        </div>
                    </CardBody>
                </Card>
            </Col >
        );
    };

    render() {
        let courseList = [];
        let category = "";
        if (this.props.wishlist && this.props.wishlist.length !== 0) {
            this.props.wishlist.map(courses => {
                category = courses.category;
                return courseList.push(this.renderCard(courses))
            })
        }
        return (
            <Container className="marginTop">
                <h3>Wishlist</h3>
                {/* <Row>
                    <Button className="btnBack" onClick={this.btnBack.bind(this)}>Back</Button>
                </Row> */}
                <Row>
                    <h3 className="Btnstyle">{category}</h3>
                </Row>
                {(this.props.error_msg || (this.props.wishlist && this.props.wishlist.length === 0)) ?
                    <Button color="danger" style={{ fontSize: "x-large" }} onClick={this.btnBack.bind(this)}>Browse courses now</Button> :
                    <Container>
                        <Row>
                            {courseList}
                        </Row>
                    </Container>
                }
            </Container >
        )
    }
}

const mapStateToProps = state => {
    return {
        error_msg: state.category.error_msg,
        wishlist: state.wishlist.wishlist,
        userId: state.auth.userId
    }
}
const mapDispatchToProps = (dispatch) => ({
    action: {
        wishlist: bindActionCreators(wishlistAction, dispatch)
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);