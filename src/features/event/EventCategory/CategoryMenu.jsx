import React, { Component } from 'react'
import { Input, Menu } from 'semantic-ui-react'
import { NavLink, Link, withRouter } from 'react-router-dom';


class CategoryMenu extends Component {
  render() {
    const { category } = this.props

    return (
      <Menu secondary>
      <Menu.Item
          as={NavLink} exact to={`/category/${category}`} name="all questions"
        />
        <Menu.Item
          as={NavLink} to={`/category/${category}/junior`} name="junior"
        />
         <Menu.Item
          as={NavLink} to={`/category/${category}/medior`} name="medior"
        />
         <Menu.Item
          as={NavLink} to={`/category/${category}/senior`} name="senior"
        />
    </Menu>
    )
  }
}

export default CategoryMenu;
