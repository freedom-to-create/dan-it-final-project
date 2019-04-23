import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import FilterListIcon from '@material-ui/icons/FilterList'
import {lighten} from '@material-ui/core/styles/colorManipulator'
import {placesCategoriesOperations} from 'store/placeCategory'
import {connect} from 'react-redux'
import {SORTING_ORDER} from 'constants/sortingOrder'
import Preloader from 'components/Preloader'
import SubmitButton from './components/Buttons/Submit'
import ResetButton from './components/Buttons/Reset'
import './index.scss'

function desc (a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function stableSort (array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

function getSorting (order, orderBy) {
  return order === SORTING_ORDER.DESCENDING ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}

const rows = [
  {id: 'multisync', numeric: false, disablePadding: true, label: 'Multisync'},
  {id: 'name', numeric: false, disablePadding: false, label: 'Name'},
  {id: 'menuItems', numeric: false, disablePadding: false, label: 'menuItems'},
  {id: 'delete', numeric: false, disablePadding: false, label: 'Delete'},
]

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render () {
    const {onSelectAllClick, order, orderBy, numSelected, rowCount} = this.props

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    )
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
})

let EnhancedTableToolbar = props => {
  const {numSelected, classes} = props

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Manage Place Categories
          </Typography>
        )}
      </div>
      <div className={classes.spacer}/>
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon/>
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon/>
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
}

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
})

class EnhancedTable extends React.Component {
  componentDidMount () {
    this.props.createData()
  }

  handleRequestSort = (event, orderBy) => {
    if (orderBy === this.props.orderBy) {
      this.props.toggleOrder(this.props.order)
    } else {
      this.props.updateOrderBy(orderBy)
    }
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.props.updateSelected(this.props.placeCategories.map(n => n.id))
    } else {
      this.props.updateSelected([])
    }
  }

  handleClick = (event, id) => {
    const {selected} = this.props
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    this.props.updateSelected(newSelected)
  }

  handleChangePage = (event, page) => {
    this.props.updatePage(page)
  }

  handleChangeRowsPerPage = event => {
    this.props.updateRowsPerPage(event.target.value)
  }

  isSelected = id => this.props.selected.indexOf(id) !== -1

  render () {
    const {classes, placeCategories, order, orderBy, selected, rowsPerPage, page, isLoading} = this.props

    if (isLoading) {
      return <Preloader/>
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, placeCategories.length - page * rowsPerPage)

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={placeCategories.length}
            />
            <TableBody>
              {stableSort(placeCategories, getSorting(order, orderBy))
                .map(n => {
                  const isSelected = this.isSelected(n.id)
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected}/>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.name}
                      </TableCell>
                      <TableCell align="right">{n.name}</TableCell>
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow style={{height: 49 * emptyRows}}>
                  <TableCell colSpan={6}/>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={placeCategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        <div className='buttons'>
          <SubmitButton/>
          <ResetButton/>
        </div>
      </Paper>
    )
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  placeCategories: PropTypes.array.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  createData: PropTypes.func.isRequired,
  updateSelected: PropTypes.func.isRequired,
  toggleOrder: PropTypes.func.isRequired,
  updateOrderBy: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  updateRowsPerPage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

const mapStateToProps = ({placeCategories}) => ({
  classes: placeCategories.classes,
  placeCategories: placeCategories.placeCategories,
  order: placeCategories.order,
  orderBy: placeCategories.orderBy,
  selected: placeCategories.selected,
  rowsPerPage: placeCategories.rowsPerPage,
  page: placeCategories.rowsPerPage,
  isLoading: placeCategories.isLoading
})

const mapDispatchToProps = dispatch => ({
  createData: () => dispatch(placesCategoriesOperations.createData()),
  updateSelected: () => dispatch(placesCategoriesOperations.updateSelected()),
  toggleOrder: () => dispatch((currentOrder) => placesCategoriesOperations.toggleOrder(currentOrder)),
  updateOrderBy: () => dispatch((orderBy) => placesCategoriesOperations.updateOrderBy(orderBy)),
  updatePage: (page) => dispatch(placesCategoriesOperations.updatePage(page)),
  updateRowsPerPage: (rowsPerPage) => dispatch(placesCategoriesOperations.updateRowsPerPage(rowsPerPage)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EnhancedTable))
