import React, {Component} from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import Preloader from '../components/Preloader'
import {NavLink} from 'react-router-dom'

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  email: {
    display: 'block',
    fontSize: '12px'
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})

class ForgotPassword extends Component {
  state = {
    isFormSubmitted: false,
    isLoading: false
  }

  handleSubmit = event => {
    event.preventDefault()
    this.setState({
      isLoading: true
    })
    const data = new FormData(event.target)
    axios.put('/api/users/forgot-password/token', data)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            isFormSubmitted: true,
            isLoading: false
          })
        }
      })
  }

  render () {
    const { classes } = this.props
    const { isLoading } = this.state
    const { isFormSubmitted } = this.state

    const forgotPasswordForm = (
      <div className={classes.wrapper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
            Forgot Password
          <span className={classes.email}>enter your email and we send there your password</span>
        </Typography>
        <form
          className={classes.form}
          onSubmit={event => this.handleSubmit(event)}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input id="email" name="email" autoComplete="email" autoFocus />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Reset Password
          </Button>
        </form>
      </div>
    )

    const afterSubmitContent = (
      <div className={classes.wrapper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
              Password recovery
          <span className={classes.email}>Link to reset password was sent to your email</span>
        </Typography>
        <Button component={NavLink} to={'login'}
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}>
          Back to Login
        </Button>
      </div>
    )

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          {isLoading && <Preloader/>}
          {!isLoading && !isFormSubmitted && forgotPasswordForm}
          {isFormSubmitted && afterSubmitContent}
        </Paper>
      </main>
    )
  }
}

ForgotPassword.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ForgotPassword)