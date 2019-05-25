import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withStyles} from '@material-ui/core/styles/index'
import PropTypes from 'prop-types'
import {eventCategoryOperations} from 'store/eventCategory'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import {Table} from '@material-ui/core'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox';
import TableCellButtons from 'components/TableCellButtons'
import {placesCategoriesOperations} from 'store/placeCategory'
import Preloader from 'components/Preloader';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3
  },
  table: {
    tableLayout: 'fixed'
  }
})

class PlaceCategories extends Component {
  componentDidMount() {
    this.props.reloadData()
  }

  render() {

    if (this.props.isLoading) {
      return (
        <div style={{height: 'calc(100vh - 200px)'}}>
          <Preloader/>
        </div>)
    }

    const {classes, placeCategories} = this.props
    const rows = [
      {id: 'multisync', label: 'Is Multisync?'},
      {id: 'allowMessages', label: 'Allow Messages?'},
      {id: 'shouldAddPairedUsers', label: 'Add paired users contacts?'},
      {id: 'name', label: 'Name'},
      {id: 'description', grow: 2, label: 'Description'},
      {id: 'businessCategories', label: 'Business Categories'},
      {id: 'layoutItems', label: 'Layout Items'},
      {id: 'buttons', label: ''},
    ];
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <colgroup>
            {rows.map((row, i) => (
              <col key={'header' + i} style={{width: `${100 * (row.grow || 1) / rows.length}%`}}/>
            ))}
          </colgroup>
          <TableHead>
            <TableRow>
              {rows.map((row, i) => (
                <TableCell key={'label' + i}>{row.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {placeCategories.map(placeCategory => {
              const {
                multisync, allowMessages, shouldAddPairedUsers, layoutItems,
                businessCategories: selectedBusinessCategories, name, description, id
              } = placeCategory
              return (
                <TableRow key={placeCategory.id} hover>
                  <TableCell component="th" scope="row" padding="checkbox">
                    <Checkbox checked={multisync} disabled/>
                  </TableCell>
                  <TableCell component="th" scope="row" padding="checkbox">
                    <Checkbox checked={allowMessages} disabled/>
                  </TableCell>
                  <TableCell component="th" scope="row" padding="checkbox">
                    <Checkbox checked={shouldAddPairedUsers} disabled/>
                  </TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>{description}</TableCell>
                  <TableCell>{selectedBusinessCategories.map(businessCategory => businessCategory.name).join(', ')}</TableCell>
                  <TableCell>{layoutItems.join(', ')}</TableCell>
                  <TableCellButtons
                    editLink={`/admin/place-categories/${id}`}
                    deleteFunction={() => this.props.processDelete(placeCategory)}
                  />
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

PlaceCategories.propTypes = {
  classes: PropTypes.object.isRequired,
  deleteEventCategory: PropTypes.func.isRequired,
  placeCategories: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  reloadData: PropTypes.func.isRequired,
  processDelete: PropTypes.func.isRequired,
}

const mapStateToProps = ({placeCategories}) => {
  return {
    placeCategories: placeCategories.placeCategories,
    isLoading: placeCategories.isHttpRequestPending,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteEventCategory: (categoryId) => dispatch(eventCategoryOperations.deleteEventCategory(categoryId)),
    reloadData: () => dispatch(placesCategoriesOperations.reloadData()),
    processDelete: (placeCategory) => dispatch(placesCategoriesOperations.processDelete(placeCategory)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PlaceCategories))
