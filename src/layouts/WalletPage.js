import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getBalance } from '../actions/getBalance'
import { sendEther } from '../actions/sendEther'
import { sendToken } from '../actions/sendToken'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Row, Col, Form, FormGroup, FormControl, ControlLabel, Button, Radio } from 'react-bootstrap';

class WalletPage extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            radioValue: 'ether',
            copySuccess: false,
            inputAddress: '',
            inputValue: ''
        }
    }

    componentWillMount(){

        let { dispatch, address, authorization } = this.props
        
        dispatch(getBalance(address, authorization))        
    }

    copyToClipboard = () => {

        this.setState({ copySuccess: true });

        this.timeout = setTimeout(() => {
            this.setState({ copySuccess: false })
        }, 1500)
    }

    sendFormSubmit = (e) => {
        e.preventDefault()
        
        let { inputAddress, inputValue, radioValue } = this.state
        let { dispatch, authorization } = this.props

        if (radioValue === 'ether'){
            dispatch(sendEther(inputAddress, inputValue, authorization)) 
        } else {
            dispatch(sendToken(inputAddress, inputValue, authorization)) 
        }
    }

  render() {

    let { inputAddress, inputValue, radioValue, copySuccess } = this.state
    let { address, etherBalance, tokenBalance } = this.props
    
    return (
        <section className="outer-wrapper">
            <div className="inner-wrapper">
                <Row>
                    <Col sm={8} smOffset={2}>
                        <h1 className="wallet-info">
                            {etherBalance} | {tokenBalance} <br/>
                            <small>
                                <CopyToClipboard text={address} onCopy={this.copyToClipboard.bind(this)}>
                                    <span className="pointer">{address}</span>
                                </CopyToClipboard>
                                {copySuccess ? <span> ✓</span> : ''}
                            </small>
                        </h1>
                        <hr/>
                        <Col sm={6} smOffset={3}>
                            <Form className="wallet-form" onSubmit={this.sendFormSubmit.bind(this)} horizontal>
                                <FormGroup bsSize="large" controlId="formAddress">
                                    <ControlLabel>Address</ControlLabel>
                                    <FormControl type="text" placeholder="Address" value={inputAddress} onChange={(e) => this.setState({ inputAddress: e.target.value })} required />   
                                </FormGroup>
                                <FormGroup bsSize="large" controlId="formValue">
                                    <ControlLabel>Value</ControlLabel>
                                    <FormControl type="number" placeholder="Value" step='1' min='1' max="1000" value={inputValue} onChange={(e) => this.setState({ inputValue: e.target.value })} required />   
                                </FormGroup>
                                <FormGroup>
                                    <Radio name="radioGroup" value="ether" checked={radioValue === 'ether'} onChange={(e) => this.setState({ radioValue: e.target.value })} inline>
                                        Ether
                                    </Radio>{' '}
                                    <Radio name="radioGroup" value="token" checked={radioValue === 'token'} onChange={(e) => this.setState({ radioValue: e.target.value })} inline>
                                        Token
                                    </Radio>
                                </FormGroup>
                                <FormGroup>
                                    <Button type="submit" bsSize="large" block>SEND</Button>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Col>
                </Row>
            </div>
        </section>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        /*address: state.user.data.address,
        authorization: state.user.data.authorization,
        etherBalance: state.user.data.etherBalance,
        tokenBalance: state.user.data.tokenBalance*/
        address: '0xd8b609b1c37e6be252c0b74c9f80c062f78853ed',
        authorization: 'eyJhbGMi0xYjYwLTQzJzdWIiOiJib2IyIiwiaWF0IjoxNTI4MTgxMjY2LCJleHAiOjE1MjgxOTAyNjZ9.rV2EU47TUF9NZ3FLUbevqXJ4p-N43nrn3gVYAqwqd1H6FiJznHzOTGEAfkQS120IrDIkgM3ndvrTyP-GLxx6IA',
        etherBalance: '0 Ether',
        tokenBalance: '0 Ninja'
    }
}

export default connect(mapStateToProps)(WalletPage)

WalletPage.propTypes = {
    authorization: PropTypes.string,
    token: PropTypes.string,
    etherBalance: PropTypes.string,
    tokenBalance: PropTypes.string,
    dispatch: PropTypes.func
}