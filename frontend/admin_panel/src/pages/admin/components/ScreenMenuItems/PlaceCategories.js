import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: 12,
    alignSelf: 'flex-start'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
})

class SimpleSelect extends React.Component {
  state = {
    category: '',
    labelWidth: 0
  }

  componentDidMount () {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    })
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  };

  render () {
    const { classes } = this.props

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel
            ref={ref => {
              this.InputLabelRef = ref
            }}
            htmlFor="outlined-age-simple"
          >
            Place category
          </InputLabel>
          <Select
            value={this.state.category}
            onChange={this.handleChange}
            input={
              <OutlinedInput
                labelWidth={this.state.labelWidth}
                name="category"
                id="outlined-age-simple"
              />
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={'Category1'}>Category1</MenuItem>
            <MenuItem value={'Category2'}>Category2</MenuItem>
            <MenuItem value={'Category3'}>Category3</MenuItem>
          </Select>
        </FormControl>

      </form>
    )
  }
}

SimpleSelect.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SimpleSelect)