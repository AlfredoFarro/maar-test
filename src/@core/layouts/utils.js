/* eslint-disable*/
import router from '@/router'
import { isObject } from '@core/utils/utils'
import { computed } from '@vue/composition-api'

/**
 * Return which component to render based on it's data/context
 * @param {Object} item nav menu item
 */
export const resolveVerticalNavMenuItemComponent = item => {
  if (item.header) return 'vertical-nav-menu-header'
  if (item.children) return 'vertical-nav-menu-group'
  return 'vertical-nav-menu-link'
}

/**
 * Return which component to render based on it's data/context
 * @param {Object} item nav menu item
 */
export const resolveHorizontalNavMenuItemComponent = item => {
  if (item.children) return 'horizontal-nav-menu-group'
  return 'horizontal-nav-menu-link'
}

/**
 * Return route name for navigation link
 * If link is string then it will assume it is route-name
 * IF link is object it will resolve the object and will return the link
 * @param {Object, String} link navigation link object/string
 */
export const resolveNavDataRouteName = link => {
  if (isObject(link.route)) {
    const { route } = router.resolve(link.route)
    return route.name
  }
  return link.route
}

/**
 * Check if nav-link is active
 * @param {Object} link nav-link object
 */
export const isNavLinkActive = link => {
  // Matched routes array of current route
  const matchedRoutes = router.currentRoute.matched

  // Check if provided route matches route's matched route
  const resolveRoutedName = resolveNavDataRouteName(link)

  if (!resolveRoutedName) return false

  return matchedRoutes.some(route => route.name === resolveRoutedName || route.meta.navActiveLink === resolveRoutedName)
}

/**
 * Check if nav group is
 * @param {Array} children Group children
 */
export const isNavGroupActive = children => {
  // Matched routes array of current route
  const matchedRoutes = router.currentRoute.matched

  return children.some(child => {
    // If child have children => It's group => Go deeper(recursive)
    if (child.children) {
      return isNavGroupActive(child.children)
    }

    // else it's link => Check for matched Route
    return isNavLinkActive(child, matchedRoutes)
  })
}

/**
 * Return b-link props to use
 * @param {Object, String} item navigation routeName or route Object provided in navigation data
 */
// prettier-ignore
export const navLinkProps = item => computed(() => {
  const props = {}

  // If route is string => it assumes => Create route object from route name
  // If route is not string => It assumes it's route object => returns route object
  if (item.route) props.to = typeof item.route === 'string' ? { name: item.route } : item.route
  else {
    props.href = item.href
    props.target = '_blank'
    props.rel = 'nofollow'
  }

  if (!props.target) props.target = item.target || null

  return props
})

export const mapNavigationRender = (item, permissions, user_role) => {
  
  if(item.id){       
    item.render = permissions.indexOf(item.id) != -1 ? true : false
  } else {
  
    if(item.children){
     
      let countItemsToRender = 0
      item.children.forEach(child => {
      
          if(child.id){      
           
            child.render = permissions.indexOf(child.id) != -1 ? true : false
            if(child.render)
              countItemsToRender++
          }else {
          
            let countItemsToRender2 = 0
            child.children.forEach(subchild => {
              if(subchild.id){           
                subchild.render = permissions.indexOf(subchild.id) != -1 ? true : false
                if(subchild.render)
                countItemsToRender2++
                countItemsToRender++
              }
            });
          
            child.render = countItemsToRender2 == 0 ? false : true         
          }
      });
      
      item.render = countItemsToRender == 0 ? false : true
    }else {
      
      if(item.header){
        item.render = true
      }
    }
  }
  if(item.title=="Restricciones"){
   
    if(!user_role.is_restriction){
      item.render = false
    

    }
  }
  console.log("ITEM RENDER", item.render)
}

