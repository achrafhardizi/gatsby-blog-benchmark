import * as React from "react"
import Header from "./header"
import Footer from "./footer"

const Layout = ({ location, title, children }) => {

  return (
    <div>
      <Header>
        {title}
      </Header>

      <main class="blog-post-main">{children}</main>

      <Footer />
    </div>
  )
}

export default Layout
