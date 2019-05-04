import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Container, Table, Button } from 'reactstrap';
import { notification } from 'antd';

import * as cartAction from '../../action/cartAction';
import * as courseAction from '../../action/CourseAction';
import PaypalButton from '../Payment/PaypalButton';
import path from '../../path';

import 'antd/dist/antd.css';
import '../../styling.css';

const CLIENT = {
    sandbox: 'AfTOvHagxpO3yCzDGOCDZRQ_KR0KHoXliKuYVPf7cbKp_EJVcvveLv1qKimGTe_5xb-2LaJlNxNEhLle',
    production: 'Afxq31claLOjSyto5vJSf3cqCbHfMedRdJ5woUVXxvBmF3COLtcqbzJSUAXiXkO3d9TZacgDyXzZZAC9',
};

class Cart extends Component {
    state = {
        deleteCart: false
    }

    componentDidMount() {
        if (this.props.token) {
            let cid = [];
            if (localStorage.getItem("cart")) {
                let courses = JSON.parse(localStorage.getItem("cart"));
                courses.map(c => {
                    return cid.push(c.courseId)

                });
                for (let i = 0; i < cid.length; i++) {
                    let data = {
                        userId: parseInt(this.props.userId),
                        courseId: cid[i]
                    }
                    this.props.action.cart.addToCart(data);
                }
                localStorage.removeItem("cart");
            }
        }

        this.props.action.course.getCourse();
        if (this.props.userId) {
            this.props.action.cart.getCartByUser(this.props.userId);
        }
    }

    componentWillReceiveProps(nextProps, prevProps) {
    }

    btnRemove(cartId, e) {
        e.preventDefault();
        this.props.action.cart.removeFromCart(cartId);
    }

    openNotificationWithIcon = (type, msg) => {
        notification[type]({
            message: msg
        });
    };

    btnRemoveCourse(courseId, e) {
        let localcart = JSON.parse(localStorage.getItem("cart"));
        let cid = localcart.map((c, i) => {
            return c.courseId
        })

        let courseIndex = cid.indexOf(courseId);
        localcart.splice(courseIndex, 1);
        localStorage.setItem("cart", JSON.stringify(localcart));
        this.setState({ deleteCart: true })
    }

    btnKeepShopping(e) {
        this.props.history.push('/courseList');
    }

    btnExplore(courseId, e) {
        this.props.history.push({
            pathname: '/exploreCourse/' + courseId
        })
    }

    btnCheckoutLogin(e) {
        this.openNotificationWithIcon('info', "Please Login First");
    }

    onSuccess = (payment, carts) => {        
        console.log('Successful payment!', payment);
        if (this.props.token) {
            carts.map(cart => {
                return this.props.action.cart.buyCourse(parseInt(cart.key));
            })
        }
        else {
            this.openNotificationWithIcon('info', "Login for checkout");
        }
    }

    onError = (error) =>
        console.log('Erroneous payment OR failed to load script!', error);

    onCancel = (data) =>
        console.log('Cancelled payment!', data);

    formatPrice(price) {
        if (price !== undefined) {
            let courseprice = price.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
            return "₹ " + courseprice.split('.')[0]
        }
    }

    render() {
        let env = 'sandbox';
        let totalPrice = 0;
        let carts = [];
        let totalUSD;
        if (this.props.token) {
            let cartCourseId = [];
            if (this.props.getCart && this.props.getCart.length !== 0) {
                this.props.getCart.map((cart, i) => {
                    return cartCourseId.push({ "courseId": cart.courseId, "cartId": cart.id });
                })
                if (this.props.course && this.props.course.length !== 0) {
                    this.props.course.map((course, i) => {
                        cartCourseId.map(cartCourse => {
                            if (cartCourse.courseId === course.id) {
                                totalPrice = totalPrice + course.price;
                                return carts.push(<tr key={cartCourse.cartId}>
                                    <td><img src={path + 'thumbnail/' + course.courseImage} alt="" /></td>
                                    <td>{course.coursename}</td>
                                    <td> {this.formatPrice(course.price)}</td>
                                    <td>
                                        <Button outline color="danger" onClick={this.btnRemove.bind(this, cartCourse.cartId)}>Remove</Button>{' '}
                                        <Button outline onClick={this.btnExplore.bind(this, course.id)}>Explore</Button>
                                    </td>
                                </tr>
                                )
                            }
                        })
                        return null
                    })
                }
            }
            else {
                carts.push(<tr key="1">
                    <td colSpan="5">Your Cart is Empty!!! <br /><br /><Button color="danger" onClick={this.btnKeepShopping.bind(this)}>Keep Shopping</Button></td>
                </tr>)
            }
        }
        else {
            if (localStorage.getItem("cart") && JSON.parse(localStorage.getItem("cart")).length !== 0) {
                let cartData = [];
                let localcarts = JSON.parse(localStorage.getItem("cart"));
                localcarts.map(c => {
                    return cartData.push(c.courseId);
                })
                if (this.props.course && this.props.course.length !== 0) {
                    this.props.course.map((course, i) => {
                        if (cartData.includes(course.id)) {
                            totalPrice = totalPrice + course.price;
                            return carts.push(<tr key={course.id}>
                                <td><img src={path + 'thumbnail/' + course.courseImage} alt="" /></td>
                                <td>{course.coursename}</td>
                                <td> {this.formatPrice(course.price)}</td>
                                <td>
                                    <Button outline color="danger" onClick={this.btnRemoveCourse.bind(this, course.id)}>Remove</Button>{' '}
                                    <Button outline onClick={this.btnExplore.bind(this, course.id)}>Explore</Button>
                                </td>
                            </tr>
                            )
                        }
                        return null
                    })
                }
            }
            else {
                carts.push(<tr key="1">
                    <td colSpan="5">Your Cart is Empty!!! <br /><br /><Button color="danger" onClick={this.btnKeepShopping.bind(this)}>Keep Shopping</Button></td>
                </tr>)
            }
        }
        totalUSD = totalPrice * 0.014;
        let dollar = totalUSD.toFixed(2);
        return (
            <Container className="marginTop">
                <h4>Cart</h4>
                <Table className="marginTop" striped>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Course</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts}
                    </tbody>
                </Table>
                {(this.props.getCart.length !== 0 && this.props.token) ?
                    <div>
                        <div style={{ float: "right", padding: "2px" }}>
                            <PaypalButton
                                client={CLIENT}
                                env={env}
                                commit={true}
                                currency={'USD'}
                                total={dollar}
                                onSuccess={this.onSuccess}
                                onError={this.onError}
                                onCancel={this.onCancel}
                                carts={carts}
                            />
                        </div>
                        <Button color="primary" className="buttons" onClick={this.btnKeepShopping.bind(this)} >Keep Shopping</Button>
                        <h3 style={{ marginLeft: "30%" }}>Total : {this.formatPrice(totalPrice)}</h3>
                    </div>
                    : null}
                {(localStorage.getItem("cart") && JSON.parse(localStorage.getItem("cart")).length > 0) ?
                    <div>
                        <Button color="primary" className="buttons" outline onClick={this.btnCheckoutLogin.bind(this)}>Proceed To CheckOut</Button>
                        <Button color="primary" className="buttons" onClick={this.btnKeepShopping.bind(this)} >Keep Shopping</Button>
                        <h3 style={{ marginLeft: "30%" }}>Total : {this.formatPrice(totalPrice)}</h3>
                    </div> : null
                }
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        userId: state.auth.userId,
        getCart: state.cart.getCart,
        course: state.course.course,
        token: state.auth.token
    }
}

const mapDispatchToProps = (dispatch) => ({
    action: {
        cart: bindActionCreators(cartAction, dispatch),
        course: bindActionCreators(courseAction, dispatch)
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Cart);