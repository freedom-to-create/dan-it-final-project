import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {placesCategoriesOperations} from 'store/placeCategory'
import {connect} from 'react-redux'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing.unit / 4
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3
  }
})

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

function getStyles (name, that) {
  return {
    fontWeight:
      that.state.name.indexOf(name) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium
  }
}

class LayoutMultiSelect extends React.Component {

  state = {
    name: []
  }

  handleChange = event => {
    this.setState({name: event.target.value})
    const {placeCategoryKey, placeCategories, updateChanged, updateLayoutItems} = this.props
    updateChanged(placeCategoryKey, placeCategories)
    updateLayoutItems(placeCategoryKey, placeCategories,  event.target.value)

  }

  componentDidMount(){
    this.setState({name: this.props.selectedMenuItems.map(menuItem => menuItem)})
  }

  render () {
    const {classes, allNames} = this.props

    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl} fullWidth>
          <InputLabel htmlFor="select-multiple-chip"></InputLabel>
          <Select
            multiple
            value={this.state.name}
            onChange={this.handleChange}
            input={<Input id="select-multiple-chip"/>}
            MenuProps={MenuProps}
          >
            {allNames.map(name => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, this)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    )
  }
}

LayoutMultiSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  allNames: PropTypes.array.isRequired,
  placeCategoryKey: PropTypes.number.isRequired,
  updateChanged: PropTypes.func.isRequired,
  placeCategories: PropTypes.array.isRequired,
  updateMenuItems: PropTypes.func.isRequired,
  selectedMenuItems: PropTypes.array.isRequired,
  flag: PropTypes.string.isRequired,
  updateLayoutItems: PropTypes.func.isRequired
}

const mapStateToProps = ({placeCategories, menuItems}) => ({
  placeCategories: placeCategories.placeCategories,
})

const mapDispatchToProps = dispatch => ({
  updateChanged: (key, placeCategories) => dispatch(placesCategoriesOperations.updateChanged(key, placeCategories)),
  updateMenuItems: (key, placeCategories, menuItems) =>
    dispatch(placesCategoriesOperations.updateMenuItems(key, placeCategories, menuItems)),
  updateLayoutItems: (key, placeCategories, layoutItems) =>
    dispatch(placesCategoriesOperations.updateLayoutItems(key, placeCategories, layoutItems))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(LayoutMultiSelect))
