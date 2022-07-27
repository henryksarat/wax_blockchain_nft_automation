import React from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

class LoginButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: false
    };

    setInterval(this.make_sure_logged_in, 60000*30);
  }

  componentDidMount() {
    setTimeout(() => {  this.make_sure_logged_in() }, 1000);
  }

  handleButtonClick = () => {
    const fetchUserEmail = async () => {
      const user_account = await this.props.wax.login();
      console.log('logged in as=' + user_account)
      this.props.callBack(user_account)
    };
    fetchUserEmail();
  };

  make_sure_logged_in = () => {
    this.setState({
      refresh: true
    })
    this.props.callBack()
  }

  render() {
    const renderAuth = () => {
      if(this.props.wax == undefined || this.props.wax.userAccount == undefined) {
        return  <Button onClick={this.handleButtonClick}>
          Click to login
        </Button>
      } else {
        return <Button variant="primary">
          {this.props.wax.userAccount} <Badge bg="secondary">{this.props.counter}</Badge>
          <span className="visually-hidden">total executions</span>
        </Button>
      }
    }
    

    return (
      <div>
        <p>
         {renderAuth()}
       </p>
        
      </div>
    );
  }
}

export default LoginButton;